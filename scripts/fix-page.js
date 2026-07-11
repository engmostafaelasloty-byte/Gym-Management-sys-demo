const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `                        {/* Submit */}
                        <button type="submit" className="auth-btn" id="loginBtn" disabled={loginLoading}>
                {/* Tabs */}
                <div className="tabs">`;

const replaceStr = `                        {/* Submit */}
                        <button type="submit" className="auth-btn" id="loginBtn" disabled={loginLoading}>
                            {loginLoading ? (
                                <span className="auth-btn-loading">
                                    <span className="auth-spinner"></span>
                                    {lang === 'ar' ? 'جاري الدخول...' : 'Signing in...'}
                                </span>
                            ) : (
                                lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'
                            )}
                        </button>
                    </form>

                    <button
                        className="auth-lang-btn"
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                    >
                        {lang === 'ar' ? '🌐 English' : '🌐 العربية'}
                    </button>
                </div>
            </main>
        );
    }

    // Main App
    const ROLE_LABELS_HEADER = {
        admin: lang === 'ar' ? 'مدير النظام' : 'Admin',
        trainer: lang === 'ar' ? 'مدرب' : 'Trainer',
        receptionist: lang === 'ar' ? 'استقبال' : 'Receptionist',
        accountant: lang === 'ar' ? 'محاسب' : 'Accountant',
        data_entry: lang === 'ar' ? 'مدخل بيانات' : 'Data Entry',
        marketing: lang === 'ar' ? 'تسويق' : 'Marketing',
        sales: lang === 'ar' ? 'مبيعات' : 'Sales',
    };

    return (
        <>
            <div className="night">
                {[...Array(25)].map((_, i) => (
                    <div key={i} className="shooting_star"></div>
                ))}
            </div>

            <main className="app">
                {/* Header */}
                <header className="topbar">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1>{t.gymTitle} — {mode === 'men' ? t.male : mode === 'women' ? t.female : t.mix}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button className="lang-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
                            {lang === 'ar' ? 'English' : 'العربية'}
                        </button>

                        {/* User Info Pill */}
                        {currentUser && (
                            <div className="user-info-pill">
                                <div className="user-avatar">
                                    {currentUser.name?.charAt(0) || '?'}
                                </div>
                                <div className="user-text">
                                    <span className="user-name">{currentUser.name}</span>
                                    <span className={\`user-role-badge role-\${currentUser.role}\`}>
                                        {ROLE_LABELS_HEADER[currentUser.role] || currentUser.role}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            className="logout-btn"
                            id="logoutBtn"
                            onClick={() => { setMode(null); setCurrentUser(null); }}
                            title={lang === 'ar' ? 'تسجيل الخروج من النظام' : 'Log out of system'}
                        >
                            <span>🚪</span>
                            {t.logout}
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="tabs">`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed successfully.');
} else {
    // If exact whitespace matching fails, regular expression
    const fallbackRegex = /\{\/\*\s*Submit\s*\*\/\}\s*<button type="submit" className="auth-btn" id="loginBtn" disabled=\{loginLoading\}>\s*\{\/\*\s*Tabs\s*\*\/\}\s*<div className="tabs">/s;
    if (fallbackRegex.test(content)) {
        content = content.replace(fallbackRegex, replaceStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed successfully using regex block replacement.');
    } else {
        console.log('Pattern not found.');
    }
}
