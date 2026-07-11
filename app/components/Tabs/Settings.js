'use client';
import React, { useState } from 'react';

const CURRENCIES = [
    { code: 'AFN', name: 'Afghani', ar: 'أفغاني' },
    { code: 'ALL', name: 'Lek', ar: 'ليك ألباني' },
    { code: 'DZD', name: 'Algerian Dinar', ar: 'دينار جزائري' },
    { code: 'USD', name: 'US Dollar', ar: 'دولار أمريكي' },
    { code: 'EUR', name: 'Euro', ar: 'يورو' },
    { code: 'AOA', name: 'Kwanza', ar: 'كوانزا أنغولي' },
    { code: 'XCD', name: 'East Caribbean Dollar', ar: 'دولار شرق الكاريبي' },
    { code: 'ARS', name: 'Argentine Peso', ar: 'بيزو أرجنتيني' },
    { code: 'AMD', name: 'Armenian Dram', ar: 'درام أرميني' },
    { code: 'AWG', name: 'Aruban Florin', ar: 'فلورن أروبي' },
    { code: 'AUD', name: 'Australian Dollar', ar: 'دولار أسترالي' },
    { code: 'AZN', name: 'Azerbaijan Manat', ar: 'مانات أذربيجاني' },
    { code: 'BSD', name: 'Bahamian Dollar', ar: 'دولار باهامي' },
    { code: 'BHD', name: 'Bahraini Dinar', ar: 'دينار بحريني' },
    { code: 'BDT', name: 'Taka', ar: 'تاكا بنغلاديشي' },
    { code: 'BBD', name: 'Barbados Dollar', ar: 'دولار بربادوسي' },
    { code: 'BYN', name: 'Belarusian Ruble', ar: 'روبل بيلاروسي' },
    { code: 'BZD', name: 'Belize Dollar', ar: 'دولار بليزي' },
    { code: 'XOF', name: 'CFA Franc BCEAO', ar: 'فرنك غرب أفريقيا' },
    { code: 'BMD', name: 'Bermudian Dollar', ar: 'دولار برمودي' },
    { code: 'INR', name: 'Indian Rupee', ar: 'روبية هندية' },
    { code: 'BTN', name: 'Ngultrum', ar: 'نغولترم بوتاني' },
    { code: 'BOB', name: 'Boliviano', ar: 'بوليفاريو بوليفي' },
    { code: 'BAM', name: 'Convertible Mark', ar: 'مارك بوسني' },
    { code: 'BWP', name: 'Pula', ar: 'بولا بوتسواني' },
    { code: 'NOK', name: 'Norwegian Krone', ar: 'كرونة نرويجية' },
    { code: 'BRL', name: 'Brazilian Real', ar: 'ريال برازيلي' },
    { code: 'BND', name: 'Brunei Dollar', ar: 'دولار بروني' },
    { code: 'BGN', name: 'Lev', ar: 'ليف بلغاري' },
    { code: 'BIF', name: 'Burundi Franc', ar: 'فرنك بوروندي' },
    { code: 'CVE', name: 'Cabo Verde Escudo', ar: 'إيسكودو كابو فيردي' },
    { code: 'KHR', name: 'Riel', ar: 'ريال كمبودي' },
    { code: 'XAF', name: 'CFA Franc BEAC', ar: 'فرنك وسط أفريقيا' },
    { code: 'CAD', name: 'Canadian Dollar', ar: 'دولار كندي' },
    { code: 'KYD', name: 'Cayman Islands Dollar', ar: 'دولار جزر كايمان' },
    { code: 'CLP', name: 'Chilean Peso', ar: 'بيزو شيلي' },
    { code: 'CNY', name: 'Yuan Renminbi', ar: 'يوان صيني' },
    { code: 'COP', name: 'Colombian Peso', ar: 'بيزو كولومبي' },
    { code: 'KMF', name: 'Comorian Franc', ar: 'فرنك جزر القمر' },
    { code: 'CDF', name: 'Congolese Franc', ar: 'فرنك كونغولي' },
    { code: 'NZD', name: 'New Zealand Dollar', ar: 'دولار نيوزيلندي' },
    { code: 'CRC', name: 'Costa Rican Colon', ar: 'كولون كوستاريكي' },
    { code: 'HRK', name: 'Kuna', ar: 'كونا كرواتية' },
    { code: 'CUP', name: 'Cuban Peso', ar: 'بيزو كوبي' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', ar: 'غيلدر هولندي' },
    { code: 'CZK', name: 'Czech Koruna', ar: 'كرونة تشيكية' },
    { code: 'DKK', name: 'Danish Krone', ar: 'كرونة دنماركية' },
    { code: 'DJF', name: 'Djibouti Franc', ar: 'فرنك جيبوتي' },
    { code: 'DOP', name: 'Dominican Peso', ar: 'بيزو دومينيكاني' },
    { code: 'EGP', name: 'Egyptian Pound', ar: 'جنيه مصري' },
    { code: 'SVC', name: 'El Salvador Colon', ar: 'كولون سلفادوري' },
    { code: 'ERN', name: 'Nakfa', ar: 'ناكفا إريتري' },
    { code: 'SZL', name: 'Lilangeni', ar: 'ليلانجيني سوازيلندي' },
    { code: 'ETB', name: 'Ethiopian Birr', ar: 'بير إثيوبي' },
    { code: 'FKP', name: 'Falkland Islands Pound', ar: 'جنيه جزر فوكلاند' },
    { code: 'FJD', name: 'Fiji Dollar', ar: 'دولار فيجي' },
    { code: 'XPF', name: 'CFP Franc', ar: 'فرنك فرنسي' },
    { code: 'GMD', name: 'Dalasi', ar: 'دالاسي غامبي' },
    { code: 'GEL', name: 'Lari', ar: 'لاري جورجي' },
    { code: 'GHS', name: 'Ghana Cedi', ar: 'سيدي غاني' },
    { code: 'GIP', name: 'Gibraltar Pound', ar: 'جنيه جبل طارق' },
    { code: 'GTQ', name: 'Quetzal', ar: 'كويتزال غواتيمالي' },
    { code: 'GBP', name: 'Pound Sterling', ar: 'جنيه إسترليني' },
    { code: 'GNF', name: 'Guinean Franc', ar: 'فرنك غيني' },
    { code: 'GYD', name: 'Guyana Dollar', ar: 'دولار غياني' },
    { code: 'HTG', name: 'Gourde', ar: 'غورد هايتي' },
    { code: 'HNL', name: 'Lempira', ar: 'ليمبيرا هندوراسي' },
    { code: 'HKD', name: 'Hong Kong Dollar', ar: 'دولار هونج كونج' },
    { code: 'HUF', name: 'Forint', ar: 'فورينت مجري' },
    { code: 'ISK', name: 'Iceland Krona', ar: 'كرونة آيسلندية' },
    { code: 'IDR', name: 'Rupiah', ar: 'روبية إندونيسية' },
    { code: 'IRR', name: 'Iranian Rial', ar: 'ريال إيراني' },
    { code: 'IQD', name: 'Iraqi Dinar', ar: 'دينار عراقي' },
    { code: 'ILS', name: 'New Israeli Sheqel', ar: 'شيكل إسرائيلي' },
    { code: 'JMD', name: 'Jamaican Dollar', ar: 'دولار جامايكي' },
    { code: 'JPY', name: 'Yen', ar: 'ين ياباني' },
    { code: 'JOD', name: 'Jordanian Dinar', ar: 'دينار أردني' },
    { code: 'KZT', name: 'Tenge', ar: 'تينغ كازاخستاني' },
    { code: 'KES', name: 'Kenyan Shilling', ar: 'شلن كيني' },
    { code: 'KPW', name: 'North Korean Won', ar: 'وون كوري شمالي' },
    { code: 'KRW', name: 'Won', ar: 'وون كوري جنوبي' },
    { code: 'KWD', name: 'Kuwaiti Dinar', ar: 'دينار كويتي' },
    { code: 'KGS', name: 'Som', ar: 'سوم قيرغيزستاني' },
    { code: 'LAK', name: 'Lao Kip', ar: 'كيب لاوسي' },
    { code: 'LBP', name: 'Lebanese Pound', ar: 'ليرة لبنانية' },
    { code: 'LSL', name: 'Loti', ar: 'لوتي ليسوتو' },
    { code: 'LRD', name: 'Liberian Dollar', ar: 'دولار ليبيري' },
    { code: 'LYD', name: 'Libyan Dinar', ar: 'دينار ليبي' },
    { code: 'CHF', name: 'Swiss Franc', ar: 'فرنك سويسري' },
    { code: 'MOP', name: 'Pataca', ar: 'باتاكا ماكاوي' },
    { code: 'MKD', name: 'Denar', ar: 'دينار مقدوني' },
    { code: 'MGA', name: 'Malagasy Ariary', ar: 'أرياري مدغشقر' },
    { code: 'MWK', name: 'Malawi Kwacha', ar: 'كواتشا ملاوي' },
    { code: 'MYR', name: 'Malaysian Ringgit', ar: 'رينغيت ماليزي' },
    { code: 'MVR', name: 'Rufiyaa', ar: 'روفية مالديفية' },
    { code: 'MRU', name: 'Ouguiya', ar: 'أوقية موريتانية' },
    { code: 'MUR', name: 'Mauritius Rupee', ar: 'روبية موريشيوسية' },
    { code: 'MXN', name: 'Mexican Peso', ar: 'بيزو مكسيكي' },
    { code: 'MDL', name: 'Moldovan Leu', ar: 'ليو مولدوفي' },
    { code: 'MNT', name: 'Tugrik', ar: 'توغريك منغولي' },
    { code: 'MAD', name: 'Moroccan Dirham', ar: 'درهم مغربي' },
    { code: 'MZN', name: 'Mozambique Metical', ar: 'ميتيكال موزمبيقي' },
    { code: 'MMK', name: 'Kyat', ar: 'كيات ميانماري' },
    { code: 'NAD', name: 'Namibia Dollar', ar: 'دولار ناميبي' },
    { code: 'NPR', name: 'Nepalese Rupee', ar: 'روبية نيبالية' },
    { code: 'NIO', name: 'Cordoba Oro', ar: 'كوردوبا نيكاراغوا' },
    { code: 'NGN', name: 'Naira', ar: 'نايرا نيجيري' },
    { code: 'OMR', name: 'Omani Rial', ar: 'ريال عماني' },
    { code: 'PKR', name: 'Pakistan Rupee', ar: 'روبية باكستانية' },
    { code: 'PAB', name: 'Balboa', ar: 'بالبوا بنمي' },
    { code: 'PGK', name: 'Kina', ar: 'كينا بابوا غينيا الجديدة' },
    { code: 'PYG', name: 'Guarani', ar: 'غواراني باراغواي' },
    { code: 'PEN', name: 'Sol', ar: 'سول بيروفي' },
    { code: 'PHP', name: 'Philippine Peso', ar: 'بيزو فلبيني' },
    { code: 'PLN', name: 'Zloty', ar: 'زلوتي بولندي' },
    { code: 'QAR', name: 'Qatari Rial', ar: 'ريال قطري' },
    { code: 'RON', name: 'Romanian Leu', ar: 'ليو روماني' },
    { code: 'RUB', name: 'Russian Ruble', ar: 'روبل روسي' },
    { code: 'RWF', name: 'Rwanda Franc', ar: 'فرنك رواندي' },
    { code: 'SHP', name: 'Saint Helena Pound', ar: 'جنيه سانت هيلينا' },
    { code: 'WST', name: 'Tala', ar: 'تالا ساموي' },
    { code: 'STN', name: 'Dobra', ar: 'دوبرا ساو تومي' },
    { code: 'SAR', name: 'Saudi Riyal', ar: 'ريال سعودي' },
    { code: 'RSD', name: 'Serbian Dinar', ar: 'دينار صربي' },
    { code: 'SCR', name: 'Seychelles Rupee', ar: 'روبية سيشيلية' },
    { code: 'SLL', name: 'Leone', ar: 'ليون سيراليوني' },
    { code: 'SGD', name: 'Singapore Dollar', ar: 'دولار سنغافوري' },
    { code: 'SBD', name: 'Solomon Islands Dollar', ar: 'دولار جزر سليمان' },
    { code: 'SOS', name: 'Somali Shilling', ar: 'شلن صومالي' },
    { code: 'ZAR', name: 'Rand', ar: 'راند جنوب أفريقيا' },
    { code: 'SSP', name: 'South Sudanese Pound', ar: 'جنيه جنوب السودان' },
    { code: 'LKR', name: 'Sri Lanka Rupee', ar: 'روبية سريلانكي' },
    { code: 'SDG', name: 'Sudanese Pound', ar: 'جنيه سوداني' },
    { code: 'SRD', name: 'Surinam Dollar', ar: 'دولار سورينامي' },
    { code: 'SEK', name: 'Swedish Krona', ar: 'كرونة سويدية' },
    { code: 'SYP', name: 'Syrian Pound', ar: 'ليرة سورية' },
    { code: 'TWD', name: 'New Taiwan Dollar', ar: 'دولار تايواني جديد' },
    { code: 'TJS', name: 'Somoni', ar: 'سوموني طاجيكستاني' },
    { code: 'TZS', name: 'Tanzanian Shilling', ar: 'شلن تنزاني' },
    { code: 'THB', name: 'Baht', ar: 'بات تايلاندي' },
    { code: 'TOP', name: 'Pa’anga', ar: 'بانغا تونغا' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', ar: 'دولار ترينيداد وتوباغو' },
    { code: 'TND', name: 'Tunisian Dinar', ar: 'دينار تونسي' },
    { code: 'TRY', name: 'Turkish Lira', ar: 'ليرة تركية' },
    { code: 'TMT', name: 'Turkmenistan New Manat', ar: 'مانات تركمانستاني' },
    { code: 'UGX', name: 'Uganda Shilling', ar: 'شلن أوغندي' },
    { code: 'UAH', name: 'Hryvnia', ar: 'هريفنيا أوكرانية' },
    { code: 'AED', name: 'UAE Dirham', ar: 'درهم إماراتي' },
    { code: 'UYU', name: 'Peso Uruguayo', ar: 'بيزو أوروغواي' },
    { code: 'UZS', name: 'Uzbekistan Sum', ar: 'سوم أوزبكستاني' },
    { code: 'VUV', name: 'Vatu', ar: 'فاتو فانواتو' },
    { code: 'VES', name: 'Bolívar Soberano', ar: 'بوليفار فنزويلي' },
    { code: 'VND', name: 'Dong', ar: 'دونغ فيتنامي' },
    { code: 'YER', name: 'Yemeni Rial', ar: 'ريال يمني' },
    { code: 'ZMW', name: 'Zambian Kwacha', ar: 'كواتشا زامبي' },
    { code: 'ZWL', name: 'Zimbabwe Dollar', ar: 'دولار زيمبابوي' },
];

export default function SettingsTab({
    lang, t, mode, currentUser, handleBackup, handleRestore, setShowPasswordModal, clearAllData, loadAllData,
    currency, setCurrency, gymName, setGymName, gymLogo, setGymLogo,
    logoSize, setLogoSize, logoGlow, setLogoGlow,
    smsGatewayUrl, setSmsGatewayUrl, smsApiKey, setSmsApiKey, smsSenderId, setSmsSenderId, smsEnabled, setSmsEnabled, updateSettings
}) {
    const trans = (key, arText, enText) => {
        if (lang === 'ar') return arText;
        if (t && t[key]) return t[key];
        return enText;
    };

    const [openTime, setOpenTime] = useState('06:00');
    const [closeTime, setCloseTime] = useState('22:00');
    const [saved, setSaved] = useState(false);

    const handleSaveGymInfo = () => {
        localStorage.setItem('gymName', gymName);
        localStorage.setItem('currency', currency);
        localStorage.setItem('openTime', openTime);
        localStorage.setItem('closeTime', closeTime);
        localStorage.setItem('gymLogo', gymLogo || '');
        localStorage.setItem('logoSize', logoSize);
        localStorage.setItem('logoGlow', logoGlow);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGymLogo(reader.result);
                localStorage.setItem('gymLogo', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        setOpenTime(localStorage.getItem('openTime') || '06:00');
        setCloseTime(localStorage.getItem('closeTime') || '22:00');
    }, []);

    const cardStyle = {
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
    };

    const sectionTitle = {
        marginTop: 0,
        marginBottom: 16,
        fontSize: 15,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    return (
        <section className="panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>{t.settings}</h2>
                <div style={{
                    padding: '4px 12px',
                    background: 'rgba(255,87,87,0.15)',
                    border: '1px solid rgba(255,87,87,0.3)',
                    borderRadius: 20,
                    fontSize: 12,
                    color: '#ff7f7f',
                    fontWeight: 600,
                }}>
                    🔒 {trans('adminOnly', 'صلاحية المدير فقط', 'Admin Only')}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

                {/* Gym Info & Logo Control */}
                <div style={cardStyle}>
                    <h3 style={sectionTitle}>🏋️ {trans('gymInfoAndLogo', 'معلومات النادي واللوجو', 'Gym info & Logo')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        
                        {/* Logo Upload & Advanced Controls */}
                        <div style={{ 
                            background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 12, 
                            border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: 15 }}>
                                <div style={{ 
                                    width: logoSize, height: logoSize, borderRadius: '50%', 
                                    border: `2px solid ${logoGlow}40`,
                                    boxShadow: `0 0 20px ${logoGlow}30`,
                                    margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden', background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s'
                                }}>
                                    {gymLogo ? (
                                        <img src={gymLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: logoSize * 0.5 }}>🏋️</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                    <button 
                                        className="small" 
                                        onClick={() => document.getElementById('logo-upload').click()}
                                        style={{ background: 'rgba(255,255,255,0.1)', fontSize: 11 }}
                                    >
                                        {trans('changeLogo', 'تغيير اللوجو', 'Change Logo')}
                                    </button>
                                    {gymLogo && (
                                        <button 
                                            className="small" 
                                            onClick={() => {setGymLogo(null); localStorage.removeItem('gymLogo');}}
                                            style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', fontSize: 11 }}
                                        >
                                            {trans('delete', 'حذف', 'Delete')}
                                        </button>
                                    )}
                                </div>
                                <input 
                                    id="logo-upload" type="file" accept="image/*" 
                                    style={{ display: 'none' }} onChange={handleLogoUpload} 
                                />
                            </div>

                            {/* Controls */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                                        <span>{trans('logoSize', 'حجم اللوجو', 'Logo Size')}</span>
                                        <span>{logoSize}px</span>
                                    </div>
                                    <input 
                                        type="range" min="30" max="100" value={logoSize} 
                                        onChange={e => {
                                            setLogoSize(parseInt(e.target.value));
                                            localStorage.setItem('logoSize', e.target.value);
                                        }}
                                        style={{ width: '100%', height: 4 }}
                                    />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                                        <span>{trans('glowColor', 'لون التوهج', 'Glow Color')}</span>
                                    </div>
                                    <input 
                                        type="color" value={logoGlow} 
                                        onChange={e => {
                                            setLogoGlow(e.target.value);
                                            localStorage.setItem('logoGlow', e.target.value);
                                        }}
                                        style={{ width: '100%', height: 30, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                {trans('gymName', 'اسم النادي', 'Gym Name')}
                            </label>
                            <input
                                value={gymName}
                                onChange={e => {
                                    const val = e.target.value;
                                    setGymName(val);
                                    localStorage.setItem('gymName', val);
                                }}
                                placeholder={trans('gymNamePlaceholder', 'اسم الجيم...', 'Gym name...')}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                {trans('currency', 'العملة', 'Currency')}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    list="currency-list"
                                    value={currency}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setCurrency(val);
                                        localStorage.setItem('currency', val);
                                    }}
                                    placeholder={trans('selectCurrencyPlaceholder', 'اختر أو اكتب العملة...', 'Select or type currency...')}
                                    style={{ width: '100%' }}
                                />
                                <datalist id="currency-list">
                                    {CURRENCIES.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.code} - {trans('currency_' + c.code, c.ar, c.name)}
                                        </option>
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>
                                <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                    {trans('openTime', 'وقت الفتح', 'Open Time')}
                                </label>
                                <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                    {trans('closeTime', 'وقت الإغلاق', 'Close Time')}
                                </label>
                                <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} />
                            </div>
                        </div>
                        <button
                            onClick={handleSaveGymInfo}
                            style={{
                                background: saved ? 'rgba(14,230,183,0.2)' : 'linear-gradient(135deg,#0b6b8a,#1496b0)',
                                border: saved ? '1px solid rgba(14,230,183,0.4)' : 'none',
                                color: saved ? '#0ee6b7' : 'white',
                                padding: '10px', borderRadius: 10, fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            {saved ? '✅ ' + trans('saved', 'تم الحفظ', 'Saved!') : '💾 ' + trans('save', 'حفظ', 'Save')}
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div style={cardStyle}>
                    <h3 style={sectionTitle}>💾 {trans('dataManagement', 'إدارة البيانات', 'Data Management')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button
                            onClick={handleBackup}
                            style={{
                                background: 'rgba(11,107,138,0.2)', border: '1px solid rgba(11,107,138,0.3)',
                                color: '#1496b0', padding: '12px', borderRadius: 10, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            📥 {trans('exportBackup', 'تحميل نسخة احتياطية', 'Export Backup')}
                        </button>
                        <button
                            onClick={() => document.getElementById('restore-file').click()}
                            style={{
                                background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)',
                                color: '#ffc107', padding: '12px', borderRadius: 10, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            📤 {trans('importBackup', 'استعادة نسخة احتياطية', 'Import Backup')}
                        </button>
                        <input
                            id="restore-file"
                            type="file"
                            style={{ display: 'none' }}
                            accept=".json"
                            onChange={handleRestore}
                        />
                    </div>
                </div>


                {/* SMS Gateway Settings */}
                <div style={cardStyle}>
                    <h3 style={sectionTitle}>💬 {trans('smsGatewaySettings', 'إعدادات بوابة الرسائل (SMS)', 'SMS Gateway Settings')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 13, marginBottom: 5 }}>
                            <input 
                                type="checkbox" 
                                checked={smsEnabled} 
                                onChange={async (e) => {
                                    const val = e.target.checked;
                                    setSmsEnabled(val);
                                    await updateSettings({ 'notifications.smsEnabled': val });
                                }} 
                            />
                            {trans('enableSmsNotifications', 'تفعيل إرسال رسائل الـ SMS', 'Enable SMS notifications')}
                        </label>
                        
                        <div>
                            <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                {trans('smsGatewayApiUrl', 'رابط بوابة الرسائل (API URL)', 'SMS Gateway API URL')}
                            </label>
                            <input
                                value={smsGatewayUrl}
                                onChange={e => setSmsGatewayUrl(e.target.value)}
                                placeholder="https://api.gateway.com/send?key={API_KEY}&to={TO}&msg={MESSAGE}&sender={SENDER_ID}"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                            />
                            <small style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, display: 'block', lineHeight: 1.3 }}>
                                {trans(
                                    'smsPlaceholdersHint',
                                    'استخدم المتغيرات: {API_KEY} للمفتاح، {TO} للرقم، {MESSAGE} للرسالة، {SENDER_ID} للمرسل.',
                                    'Use placeholders: {API_KEY} for key, {TO} for number, {MESSAGE} for message, {SENDER_ID} for sender.'
                                )}
                            </small>
                        </div>

                        <div>
                            <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                {trans('apiKeyToken', 'مفتاح السرية (API Key)', 'API Key / Token')}
                            </label>
                            <input
                                type="password"
                                value={smsApiKey}
                                onChange={e => setSmsApiKey(e.target.value)}
                                placeholder="API Key..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 12, opacity: 0.5, marginBottom: 4, display: 'block' }}>
                                {trans('senderId', 'اسم المرسل (Sender ID)', 'Sender ID')}
                            </label>
                            <input
                                value={smsSenderId}
                                onChange={e => setSmsSenderId(e.target.value)}
                                placeholder="GMS_ALERT"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }}
                            />
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    await updateSettings({
                                        'notifications.smsGatewayUrl': smsGatewayUrl,
                                        'notifications.smsApiKey': smsApiKey,
                                        'notifications.smsSenderId': smsSenderId,
                                        'notifications.smsEnabled': smsEnabled
                                    });
                                    alert(trans('smsSettingsSaved', '✅ تم حفظ إعدادات البوابة بنجاح!', '✅ SMS gateway settings saved successfully!'));
                                } catch (err) {
                                    alert(trans('smsSettingsSaveFailed', '❌ فشل الحفظ: ', '❌ Save failed: ') + err.message);
                                }
                            }}
                            style={{
                                background: 'linear-gradient(135deg,#0b6b8a,#1496b0)',
                                border: 'none',
                                color: 'white',
                                padding: '10px', borderRadius: 10, fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.3s',
                                marginTop: 5
                            }}
                        >
                            💾 {trans('saveGatewaySettings', 'حفظ إعدادات البوابة', 'Save Gateway Settings')}
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div style={{ ...cardStyle, borderColor: 'rgba(255,0,0,0.15)' }}>
                    <h3 style={{ ...sectionTitle, color: '#ff6b6b' }}>
                        ⚠️ {trans('dangerZone', 'منطقة الخطر', 'Danger Zone')}
                    </h3>
                    <button
                        onClick={async () => {
                            const confirmed = confirm(
                                trans(
                                    'resetSystemWarning',
                                    '⚠️ تحذير شديد: سيتم مسح جميع البيانات وتصفير النظام بالكامل!\n\nهل أنت متأكد تماماً؟',
                                    '⚠️ FINAL WARNING: All data will be permanently deleted and the system will be reset!\n\nAre you absolutely sure?'
                                )
                            );
                            if (confirmed) {
                                await clearAllData();
                                localStorage.clear();
                                sessionStorage.clear();
                                alert(trans(
                                    'systemResetSuccess',
                                    '✅ تم مسح البيانات وتصفير النظام بنجاح. سيتم إعادة تحميل الصفحة الآن لتمكينك من إنشاء حساب مالك النظام الجديد.',
                                    '✅ All data cleared and system reset successfully. The page will reload now to allow you to create the new owner account.'
                                ));
                                window.location.reload();
                            }
                        }}
                        style={{
                            width: '100%', background: 'rgba(255,0,0,0.1)',
                            border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b',
                            padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        🗑️ {trans('resetSystem', 'مسح جميع البيانات', 'Reset System')}
                    </button>
                </div>
            </div>
        </section>
    );
}
