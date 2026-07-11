'use client';

import { useState, useEffect, useRef } from 'react';

// ==============================================
// محرك البحث الذكي
// ==============================================

/**
 * تنظيف النص: إزالة التشكيل، توحيد الهمزات والياء، حروف إضافية
 */
function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[\u064B-\u065F]/g, '')         // إزالة التشكيل
        .replace(/[أإآا]/g, 'ا')                   // توحيد الألف
        .replace(/[ىي]/g, 'ي')                    // توحيد الياء
        .replace(/ة/g, 'ه')                       // توحيد التاء المربوطة
        .replace(/[^\u0600-\u06FFa-z0-9\s]/g, '') // إزالة الرموز
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * استخراج الكلمات من نص
 */
function tokenize(text) {
    return normalize(text).split(/\s+/).filter(w => w.length > 1);
}

/**
 * حساب درجة التشابه بين سؤال المستخدم وإجابة محتملة
 * يستخدم نظام نقاط متعدد المستويات
 */
function scoreEntry(entry, query, lang) {
    const normQuery = normalize(query);
    const queryTokens = tokenize(query);

    const questions = lang === 'ar' ? (entry.question_ar || []) : (entry.question_en || []);
    const keywords = lang === 'ar' ? (entry.keywords_ar || []) : (entry.keywords_en || []);
    const answer = lang === 'ar' ? (entry.answer_ar || '') : (entry.answer_en || '');

    let score = 0;

    // 1. مطابقة تامة مع أحد الأسئلة (أعلى درجة)
    for (const q of questions) {
        const normQ = normalize(q);
        if (normQ === normQuery) { score += 100; continue; }
        if (normQ.includes(normQuery) || normQuery.includes(normQ)) { score += 60; continue; }
    }

    // 2. مطابقة الكلمات المفتاحية مع السؤال
    for (const kw of keywords) {
        const normKw = normalize(kw);
        if (normKw === normQuery) { score += 70; continue; }
        if (normQuery.includes(normKw)) { score += normKw.length > 3 ? 25 : 10; continue; }
        if (normKw.includes(normQuery)) { score += 15; }
    }

    // 3. مطابقة كلمات السؤال مع الكلمات المفتاحية وأسئلة FAQ
    for (const token of queryTokens) {
        if (token.length < 2) continue;

        // تحقق من الكلمات المفتاحية
        for (const kw of keywords) {
            const normKw = normalize(kw);
            if (normKw === token) { score += 15; }
            else if (normKw.includes(token) || token.includes(normKw)) { score += token.length > 3 ? 8 : 3; }
        }

        // تحقق من الأسئلة
        for (const q of questions) {
            const normQ = normalize(q);
            if (normQ.includes(token)) { score += token.length > 3 ? 12 : 5; }
        }
    }

    // 4. مكافأة التطابق في موضوع الإجابة (بناءً على الكلمات الأساسية)
    const normAnswer = normalize(answer);
    for (const token of queryTokens) {
        if (token.length > 3 && normAnswer.includes(token)) { score += 3; }
    }

    // 5. عقوبة الردود القصيرة والعامة في السياق (مثل greeting)
    if (entry.id === 'greeting') {
        const greetWords = ['مرحب', 'اهل', 'هاي', 'سلام', 'صباح', 'مساء', 'ازيك', 'عامل', 'اخبار', 'hi', 'hello', 'hey'];
        const isGreeting = greetWords.some(g => normQuery.includes(g));
        if (!isGreeting) score = Math.max(0, score - 30);
    }

    return score;
}

/**
 * العثور على أفضل إجابة لسؤال المستخدم
 */
function findBestAnswer(faqData, query, lang) {
    if (!query.trim()) return null;

    const scored = faqData.map(entry => ({
        entry,
        score: scoreEntry(entry, query, lang)
    })).sort((a, b) => b.score - a.score);

    const best = scored[0];
    const threshold = 5; // الحد الأدنى لقبول الإجابة

    if (best && best.score >= threshold) {
        return best.entry;
    }
    return null;
}

// ==============================================
// قوالب ردود ذكية
// ==============================================
function buildSmartFallback(query, lang) {
    const lq = query.toLowerCase();
    const topics = lang === 'ar' ? [
        'المشتركين', 'الدفع', 'الاشتراك', 'الموظفين', 'التقارير',
        'الصلاحيات', 'الدخول', 'البضائع', 'المصروفات', 'الحصص'
    ] : [
        'subscribers', 'payment', 'subscription', 'staff', 'reports',
        'permissions', 'login', 'goods', 'expenses', 'classes'
    ];

    const matchedTopics = topics.filter(t => lq.includes(t.toLowerCase()));

    if (lang === 'ar') {
        return matchedTopics.length > 0
            ? `لم أجد إجابة دقيقة عن "${query}".\n💡 يمكنك:\n• اختيار موضوع من الأسئلة المقترحة أدناه\n• صياغة السؤال بطريقة مختلفة\n• الضغط على الأسئلة المقترحة لاستعراض الموضوعات`
            : `لم أفهم سؤالك تماماً، هل تقصد أحد هذه المواضيع؟\n📌 ${topics.slice(0, 4).join(' | ')}\n\nجرب تكتب سؤالك بشكل أوضح أو اختر من الأسئلة المقترحة.`;
    } else {
        return matchedTopics.length > 0
            ? `I couldn't find a precise answer for "${query}".\n💡 Try:\n• Choosing from the suggested questions below\n• Rephrasing your question\n• Using keywords like: ${matchedTopics.join(', ')}`
            : `I didn't quite understand your question.\n📌 Common topics: ${topics.slice(0, 4).join(' | ')}\n\nTry using different keywords or choose from the suggested questions.`;
    }
}

// ==============================================
// مكوّن الشاتبوت
// ==============================================
export default function ChatBot({ faqData, lang }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [suggestionPage, setSuggestionPage] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const SUGGESTIONS_PER_PAGE = 4;
    const allSuggestions = faqData.filter(f => f.id !== 'greeting' && f.id !== 'chatbot-help' && f.id !== 'developer-info');
    const totalPages = Math.ceil(allSuggestions.length / SUGGESTIONS_PER_PAGE);
    const visibleSuggestions = allSuggestions.slice(suggestionPage * SUGGESTIONS_PER_PAGE, (suggestionPage + 1) * SUGGESTIONS_PER_PAGE);

    const t = lang === 'ar' ? {
        title: 'المساعد الذكي',
        placeholder: 'اسألني أي سؤال بأي صياغة...',
        suggested: 'موضوعات سريعة',
        send: 'إرسال',
        typing: 'يكتب...',
        more: 'المزيد ▶',
    } : {
        title: 'Smart Assistant',
        placeholder: 'Ask me anything...',
        suggested: 'Quick Topics',
        send: 'Send',
        typing: 'Typing...',
        more: 'More ▶',
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcome = lang === 'ar'
                ? `مرحباً! 👋 أنا مساعدك الذكي لنظام إدارة الجيم.\n\nيمكنني الإجابة على **أي سؤال** بخصوص النظام بأي صياغة — جرب اسألني!`
                : `Hi there! 👋 I'm your smart gym management assistant.\n\nI can answer **any question** about the system in any format — just ask me!`;
            setMessages([{ text: welcome, sender: 'bot', isWelcome: true }]);
        }
    }, [isOpen, lang]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = (text) => {
        const query = (text || input).trim();
        if (!query) return;

        // إضافة رسالة المستخدم
        setMessages(prev => [...prev, { text: query, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        // وقت تأخير ذكي يعكس إحساس التفكير
        const delay = 400 + Math.min(query.length * 8, 800);

        setTimeout(() => {
            setIsTyping(false);
            const result = findBestAnswer(faqData, query, lang);
            const answer = result
                ? (lang === 'ar' ? result.answer_ar : result.answer_en)
                : buildSmartFallback(query, lang);

            setMessages(prev => [...prev, { text: answer, sender: 'bot' }]);
        }, delay);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {/* Toggle Button */}
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(true)} title={t.title}>
                    <span style={{ fontSize: 28 }}>💬</span>
                    {/* Pulse animation */}
                    <span className="chat-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {/* Header */}
                    <div className="chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, flexShrink: 0
                            }}>✨</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>{t.title}</div>
                                <div style={{ fontSize: 11, opacity: 0.7, color: 'white' }}>
                                    {isTyping ? t.typing : (lang === 'ar' ? '● نشط الآن' : '● Online')}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                            width: 28, height: 28, borderRadius: '50%', fontSize: 16,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>×</button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.sender}`}>
                                {m.sender === 'bot' && (
                                    <div className="bot-avatar">✨</div>
                                )}
                                <div
                                    className="message-bubble"
                                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                />
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="message bot">
                                <div className="bot-avatar">✨</div>
                                <div className="message-bubble typing-bubble">
                                    <span className="dot" /><span className="dot" /><span className="dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    <div className="chat-suggestions">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <p style={{ margin: 0, fontSize: 11, opacity: 0.5 }}>{t.suggested}</p>
                            {totalPages > 1 && (
                                <button
                                    onClick={() => setSuggestionPage((suggestionPage + 1) % totalPages)}
                                    style={{
                                        fontSize: 10, padding: '2px 6px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.5)'
                                    }}
                                >
                                    {t.more}
                                </button>
                            )}
                        </div>
                        <div className="suggestions-list">
                            {visibleSuggestions.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => handleSend(lang === 'ar' ? f.question_ar[0] : f.question_en[0])}
                                >
                                    {lang === 'ar' ? f.question_ar[0] : f.question_en[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <form className="chat-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.placeholder}
                        />
                        <button type="submit" disabled={!input.trim()} style={{
                            background: input.trim() ? 'linear-gradient(135deg,#0b6b8a,#1496b0)' : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.2s'
                        }}>
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .chatbot-container {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    z-index: 9999;
                    font-family: inherit;
                }

                /* Toggle Button */
                .chat-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0b6b8a, #1496b0);
                    border: none;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(11, 107, 138, 0.55);
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .chat-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 40px rgba(11, 107, 138, 0.7);
                }
                .chat-pulse {
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 2px solid rgba(20,150,176,0.4);
                    animation: pulse-ring 2s ease-out infinite;
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(0.9); opacity: 0.7; }
                    100% { transform: scale(1.3); opacity: 0; }
                }

                /* Chat Window */
                .chat-window {
                    width: 360px;
                    height: 540px;
                    background: linear-gradient(180deg, #071018, #08121a);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,150,176,0.1) inset;
                    overflow: hidden;
                    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes slideUp {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to   { transform: translateY(0) scale(1); opacity: 1; }
                }

                /* Header */
                .chat-header {
                    background: linear-gradient(135deg, #0b5a75, #0e8aad);
                    padding: 14px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }

                /* Messages */
                .chat-messages {
                    flex: 1;
                    padding: 14px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.1) transparent;
                }
                .chat-messages::-webkit-scrollbar { width: 4px; }
                .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

                /* Message Bubbles */
                .message {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    max-width: 90%;
                    animation: msgIn 0.25s ease-out;
                }
                @keyframes msgIn {
                    from { transform: translateY(6px); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
                .message.bot { align-self: flex-start; }
                .message.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
                .bot-avatar {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px; flex-shrink: 0;
                }
                .message-bubble {
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .message.bot .message-bubble {
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.9);
                    border-bottom-left-radius: 4px;
                }
                .message.user .message-bubble {
                    background: linear-gradient(135deg, #0b6b8a, #1496b0);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                /* Typing indicator */
                .typing-bubble {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 12px 16px;
                }
                .dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.4);
                    animation: bounce 1.2s ease-in-out infinite;
                }
                .dot:nth-child(2) { animation-delay: 0.15s; }
                .dot:nth-child(3) { animation-delay: 0.3s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40%           { transform: translateY(-6px); background: #0ee6b7; }
                }

                /* Suggestions */
                .chat-suggestions {
                    padding: 10px 14px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    background: rgba(0,0,0,0.15);
                }
                .suggestions-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                .suggestions-list button {
                    font-size: 11px;
                    padding: 4px 10px;
                    background: rgba(20,150,176,0.08);
                    border: 1px solid rgba(20,150,176,0.2);
                    border-radius: 20px;
                    box-shadow: none;
                    color: rgba(255,255,255,0.65);
                    cursor: pointer;
                    transition: all 0.15s;
                    white-space: nowrap;
                    max-width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .suggestions-list button:hover {
                    background: rgba(20,150,176,0.2);
                    color: #1496b0;
                    border-color: rgba(20,150,176,0.4);
                    transform: translateY(-1px);
                }

                /* Input */
                .chat-input {
                    padding: 12px 14px;
                    display: flex;
                    gap: 8px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    background: rgba(0,0,0,0.1);
                }
                .chat-input input {
                    flex: 1;
                    height: 38px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 0 14px;
                    font-size: 13px;
                    color: white;
                    margin: 0;
                }
                .chat-input input:focus {
                    border-color: rgba(20,150,176,0.4);
                    outline: none;
                }
                .chat-input button {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    padding: 0;
                    font-size: 16px;
                    flex-shrink: 0;
                    border: none;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .chat-input button:not(:disabled):hover {
                    transform: scale(1.1);
                }

                @media (max-width: 480px) {
                    .chat-window { width: 92vw; height: 75vh; }
                    .chatbot-container { left: 12px; bottom: 12px; }
                }
            `}</style>
        </div>
    );
}
