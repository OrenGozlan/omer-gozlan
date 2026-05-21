import { useEffect, useState } from 'react';

export const translations = {
  he: {
    nav: { about: 'אודות', record: 'הישגים', targets: 'יעדים 2026', gallery: 'גלריה', sponsor: 'חסות', contact: 'צרו קשר' },
    hero: {
      tagline: 'כדורעף חופים | נבחרת ישראל',
      name: 'עומר גוזלן',
      sub: 'הכוכב העולה של כדורעף החופים בישראל',
      badges: ['אלוף עוקב', '4 מדליות בינלאומיות', 'מכון וינגייט'],
      blurb: 'בגיל 17 בלבד, עומר רושם היסטוריה כאחד הספורטאים הצעירים המבטיחים של ישראל. בעקבות הצלחה מדהימה בטורנירי בוגרים בתחילת עונת 2026, עומר מתחיל להתמקד בסבב המקצועני לבוגרים — כולל 4 תחרויות מתוכננות בסין, בולגריה, הונגריה ואנגליה, לצד תחרויות המטרה ב-U18 ו-U20 ואולימפיאדת הנוער דאקאר.',
      blurb_short: 'הסיפור של ישראל בכדורעף החופים — מסע אל אולימפיאדת הנוער דאקאר 2026.',
      cta: 'הצטרפו כשותפים',
      cta2: 'צפו בהישגים',
    },
    stats: [
      { n: '17', l: 'גיל' },
      { n: '#1', l: 'דירוג ישראל U18 ו-U20' },
      { n: '6', l: 'מדליות בתחרויות' },
      { n: 'י"א', l: 'תלמיד' },
    ],
    about: {
      heading: 'אודות עומר',
      bg_h: 'רקע',
      bg: 'עומר גוזלן, בן 17, אחד משחקני כדורעף החופים הצעירים המבטיחים בישראל. שילוב של כישרון, נחישות ואתיקת עבודה — עומר מתקדם במהירות לעבר קריירה ספורטיבית מקצועית.',
      edu_h: 'השכלה',
      edu: 'תלמיד י"ב, המכללה למצוינות בספורט, מכון וינגייט. שילוב של אימוני עילית עם מצוינות אקדמית באחד ממוסדות הספורט המובילים בישראל.',
      rec_h: 'הכרה ופוטנציאל',
      rec: 'מאמנים ודמויות מובילות בענף מזהים בעומר ספורטאי בעל פוטנציאל יוצא מן הכלל להגיע לרמות הבינלאומיות הגבוהות ביותר. השילוב של כישרון פיזי, חוסן מנטלי ומסירות מציב אותו ככוכב עתידי של הענף.',
    },
    record: {
      heading: 'שיא אליפות',
      s2026_h: 'עונת 2026',
      s2025_h: 'עונת 2025',
      s2024_h: 'עונת 2024',
      s2026: [
        { rank: '#1', title: 'גביע אומות CEV 2026', sub: 'בוגרים — מקום ראשון' },
        { rank: '#2', title: 'גביע לאומי הונגריה 2026', sub: 'בוגרים — מקום שני' },
        { rank: '#1', title: 'דירוג ישראל U20', sub: 'מקום ראשון' },
        { rank: '#1', title: 'דירוג ישראל U18', sub: 'מקום ראשון' },
      ],
      s2025: [
        { rank: '#1', title: 'אליפות ישראל U18 2025', sub: 'מקום ראשון' },
        { rank: '#5', title: 'אליפות ישראל בוגרים A 2025', sub: 'מקום חמישי' },
        { rank: '#3', title: 'CEV סלובניה', sub: 'מדליית ארד' },
        { rank: '#3', title: 'CEV קפריסין', sub: 'מדליית ארד' },
        { rank: '16', title: 'CEV U20 ספרד', sub: 'אליפות אירופה — שמינית גמר' },
        { rank: '16', title: 'CEV U18 איטליה', sub: 'אליפות אירופה — שמינית גמר' },
      ],
      s2024: [
        { rank: '#1', title: 'אליפות ישראל U16 2024', sub: 'מקום ראשון' },
        { rank: '#8', title: 'אליפות ישראל בוגרים B 2024', sub: 'מקום שמיני' },
        { rank: '#4', title: 'CEV צ׳כיה 2024', sub: 'טורניר CEV' },
      ],
      progression: 'מדומיננטיות בתחרויות נוער ועד תחרות ברמות בוגרים אליטיסטיות ואליפויות אירופה. עקביות עומר במגוון קבוצות גיל וטורנירים בינלאומיים מעידה על כישרון יוצא דופן ופוטנציאל להגיע לפסגות הכדורעף המקצועי.',
    },
    targets: {
      heading: 'יעדי 2026',
      sub: 'חתירה למצוינות בזירות הלאומית, היבשתית והעולמית',
      items: [
        { t: 'ישראל U18', s: 'אליפות לאומית', tag: 'לאומי' },
        { t: 'ישראל בוגרים A', s: 'אליפות לאומית', tag: 'לאומי' },
        { t: 'אליפות אירופה U18', s: 'טורניר CEV', tag: 'יבשתי' },
        { t: 'אליפות אירופה U20', s: 'טורניר CEV', tag: 'יבשתי' },
        { t: 'אליפות עולם U18', s: 'טורניר FIVB', tag: 'בינלאומי' },
        { t: 'אליפות עולם U20', s: 'טורניר FIVB', tag: 'בינלאומי' },
      ],
      olympic_h: '🏅 המשחקים האולימפיים',
      olympic_t: 'אולימפיאדת הנוער דאקאר 2026',
      olympic_b: 'ההישג המרכזי של ספורטאים צעירים ברחבי העולם. ייצוג ישראל בזירה האולימפית ותחרות על הכבוד הגבוה ביותר בספורט הנוער.',
      foot: 'כל תחרות היא אבן דרך לעבר היעד האולטימטיבי של עומר: לתחר ברמות הגבוהות ביותר של כדורעף החופים העולמי ולהביא גאווה לישראל.',
    },
    testimonial: {
      heading: 'הכרה מקצועית',
      quote: '"מעולם לא היה תלמיד י"א עם שתי מדליות אירופאיות. עומר הוא כישרון יוצא דופן — ספורטאי צעיר עם בגרות, התמדה ואמונה בלתי מעורערת בדרכו."',
      author: 'אייל אהרונסון',
      role: 'מנהל המכללה למצוינות בספורט, מכון וינגייט',
    },
    gallery: { heading: 'גלריית פעולה' },
    vision: {
      heading: 'חזון ויעדים',
      sub: 'מסלול ברור להפוך לאחד משחקני כדורעף החופים האליטיסטיים בעולם',
      items: [
        { t: 'מצוינות בינלאומית', d: 'המשך לייצג את ישראל בתחרויות בינלאומיות ולהגיע לצמרת הדירוג העולמי' },
        { t: 'קריירה מקצועית', d: 'בניית קריירה מקצועית מצליחה ברמות הגבוהות ביותר של הענף' },
        { t: 'השראה לדור הצעיר', d: 'להוות מודל ומנטור לדור הצעיר של ספורטאי ישראל' },
        { t: 'שבירת שיאים', d: 'המשך לרשום היסטוריה ולקבוע סטנדרטים חדשים לספורטאים ישראלים' },
      ],
    },
    sponsor: {
      heading: 'מטוסים לדאקאר 2026.',
      sub: '4 מדינות. 6 טורנירים. אולימפיאדה אחת. אנחנו מרכיבים את צוות המותגים שיתעופף עם עומר — שלושה מקומות שותפים פנויים.',
      items: [
        { t: 'כוכב עולה', d: 'שותפות עם ספורטאי בתחילת קריירה בינלאומית מבטיחה' },
        { t: 'קהל צעיר', d: 'חיבור לקהל אוהדי ספורט נוער ומשפחותיהם ברחבי ישראל' },
        { t: 'חשיפה בינלאומית', d: 'נראות מותג באליפויות אירופה ובטורנירים בינלאומיים' },
        { t: 'תוכן ומדיה', d: 'יצירת תוכן אותנטי ושיתופי פעולה ברשתות חברתיות' },
        { t: 'סיפור מעורר השראה', d: 'התחברות לספורטאי המגלם נחישות ומצוינות' },
        { t: 'שותפות ארוכת טווח', d: 'צמיחה משותפת ככל שעומר מתקדם לתחרות בינלאומית מקצועית' },
      ],
    },
    reach: {
      heading: 'חשיפת מותג והשפעה',
      intro: 'השתתפות בתחרויות כדורעף נוער עילית מציעה לחסויות חשיפת מותג משמעותית באמצעות נוכחות חיה, שידורי טלוויזיה, סטרימינג והגעה ברשתות חברתיות ברחבי אירופה והעולם. נראות שחקן נוער מובילה ניתנת להגברה דרך לוגואים על המדים, באנרים בצד המגרש ופרופילי שחקנים.',
      items: [
        { t: 'תחרויות גיל CEV', d: 'אליפויות U18 ו-U20 של CEV מתקיימות באתרים בקיבולת 750-1,000 צופים למשחק, עם נוכחות מינימלית של 400-1,250 אוהדים. הטורנירים נצפים בפלטפורמות כמו EuroVolley.TV. חסויות זוכות לחשיפה ב-25+ מדינות.' },
        { t: 'תחרויות CEV בוגרים', d: 'אירועי CEV בוגרים, כגון ליגת האלופות, מושכים קהל של מעל 1,000 למשחק עם סך נוכחות של 88,365. שידורי TV מגיעים לעשרות מיליונים (63.5 מיליון מצטבר בחמש שנים) ב-45+ ערוצים.' },
        { t: 'אליפויות עולם FIVB', d: 'אליפויות U18/U20 הולידו 19 מיליון צפיות ב-YouTube, 2.15 מיליון שעות צפייה ושיאי 131,500 צופים בו-זמנית. גמרים מושכים מיליונים בשווקי מפתח כמו איטליה ופולין (5+ מיליון משולב).' },
        { t: 'אולימפיאדת נוער דאקאר 2026', d: 'כדורעף משוחק באתרים כמו Dakar Arena (קיבולת 7,500), עם מעורבות של 60,000+ משתתפים. חסויות נהנות משותפויות מדיה של ה-IOC והגברה ברשתות חברתיות.' },
      ],
    },
    countdown: { days: 'ימים', to_dakar: 'עד דאקאר 2026' },
    sticky_cta: 'הצטרפו כשותפים',
    contact: {
      heading: 'בואו לדבר',
      sub: 'מחפשים שותף לדרך לדאקאר 2026? צרו קשר — נשלח לכם את חבילת החסות.',
      cta_email: 'שלחו אימייל',
      cta_ig: 'עקבו באינסטגרם',
    },
    footer: {
      name: 'עומר גוזלן',
      sub: 'נבחרת ישראל לכדורעף חופים | המכללה למצוינות בספורט, מכון וינגייט',
      copy: '© 2026 עומר גוזלן. כל הזכויות שמורות.',
    },
  },
  en: {
    nav: { about: 'About', record: 'Record', targets: '2026 Targets', gallery: 'Gallery', sponsor: 'Sponsor', contact: 'Get in Touch' },
    hero: {
      tagline: 'Beach Volleyball | Team Israel',
      name: 'OMER GOZLAN',
      sub: 'Rising Star of Israeli Beach Volleyball',
      badges: ['Back-to-Back Champion', '4x International Medalist', 'Wingate Institute'],
      blurb: 'Israel\'s #1 U18 beach volleyball player. 6 international medals by 17. Following breakout wins on the adult tour in early 2026, Omer is now stepping onto the pro adults circuit — 4 events in China, Bulgaria, Hungary, and England, alongside his target U18, U20, and Dakar 2026 Youth Olympics campaigns.',
      blurb_short: 'Israel\'s beach volleyball story — on the road to Dakar 2026 Youth Olympics.',
      cta: 'Become a Partner',
      cta2: 'View Achievements',
    },
    stats: [
      { n: '17', l: 'Years Old' },
      { n: '#1', l: 'Israel U18 & U20 Rank' },
      { n: '6', l: 'Competition Medals' },
      { n: '11', l: 'Grade Student' },
    ],
    about: {
      heading: 'About Omer',
      bg_h: 'Background',
      bg: 'Omer Gozlan, 17, is one of Israel\'s most promising young beach volleyball players. Combining exceptional talent, determination, and a strong work ethic, Omer is rapidly progressing on his path toward a professional athletic career.',
      edu_h: 'Education',
      edu: '12th Grade Student, The Academy for Excellence in Sports, Wingate Institute. Balancing elite athletic training with academic excellence at one of Israel\'s premier sports institutions.',
      rec_h: 'Recognition & Potential',
      rec: 'Coaches and leading figures in the sport recognize Omer as an athlete with outstanding potential to reach the highest international levels. His combination of physical talent, mental toughness, and dedication sets him apart as a future star of the sport.',
    },
    record: {
      heading: 'Championship Record',
      s2026_h: '2026 Season',
      s2025_h: '2025 Season',
      s2024_h: '2024 Season',
      s2026: [
        { rank: '#1', title: 'CEV Nations Cup 2026', sub: 'Adults — 1st Place' },
        { rank: '#2', title: 'Hungary National Cup 2026', sub: 'Adults — 2nd Place' },
        { rank: '#1', title: 'Israel U20 Ranking', sub: '1st Place' },
        { rank: '#1', title: 'Israel U18 Ranking', sub: '1st Place' },
      ],
      s2025: [
        { rank: '#1', title: '2025 Israel Championship', sub: 'Israel U18' },
        { rank: '#5', title: '2025 National Championship', sub: 'Israel Adults A' },
        { rank: '#3', title: 'CEV Slovenia', sub: 'Bronze Medal' },
        { rank: '#3', title: 'CEV Cyprus', sub: 'Bronze Medal' },
        { rank: '16', title: 'CEV U20 Spain', sub: 'European Championship — Last 16' },
        { rank: '16', title: 'CEV U18 Italy', sub: 'European Championship — Last 16' },
      ],
      s2024: [
        { rank: '#1', title: '2024 Israel Championship', sub: 'Israel U16' },
        { rank: '#8', title: '2024 National Championship', sub: 'Israel Adults B' },
        { rank: '#4', title: '2024 CEV Tournament', sub: 'CEV Czechia' },
      ],
      progression: 'From dominating youth competitions to competing at elite adult levels and European championships. Omer\'s consistent performance across multiple age groups and international tournaments demonstrates exceptional talent and the potential to reach the highest levels of professional beach volleyball.',
    },
    targets: {
      heading: '2026 Target Competitions',
      sub: 'Aiming for excellence across national, continental, and world stages',
      items: [
        { t: 'Israel U18', s: 'National Championship', tag: 'National' },
        { t: 'Israel Adults A', s: 'National Championship', tag: 'National' },
        { t: 'European Championship U18', s: 'CEV Tournament', tag: 'Continental' },
        { t: 'European Championship U20', s: 'CEV Tournament', tag: 'Continental' },
        { t: 'World Championship U18', s: 'FIVB Tournament', tag: 'International' },
        { t: 'World Championship U20', s: 'FIVB Tournament', tag: 'International' },
      ],
      olympic_h: '🏅 OLYMPIC GAMES',
      olympic_t: 'Dakar 2026 Youth Olympics',
      olympic_b: 'The pinnacle achievement for young athletes worldwide. Representing Israel on the Olympic stage and competing for the highest honor in youth sports.',
      foot: 'Each competition represents a stepping stone toward Omer\'s ultimate goal: competing at the highest levels of international beach volleyball and bringing pride to Israel.',
    },
    testimonial: {
      heading: 'Expert Recognition',
      quote: '"There has never been an 11th-grade student with two European medals. Omer is an exceptional talent — a young athlete with maturity, perseverance, and an unshakable belief in his path."',
      author: 'Eyal Aharonson',
      role: 'Director, Academy for Excellence in Sports, Wingate Institute',
    },
    gallery: { heading: 'Action Gallery' },
    vision: {
      heading: 'Vision & Goals',
      sub: 'A clear path to becoming one of the world\'s elite beach volleyball players',
      items: [
        { t: 'International Excellence', d: 'Continue representing Israel in international competitions and reach the top ranks of world beach volleyball' },
        { t: 'Professional Career', d: 'Build a successful professional career competing at the highest levels of the sport worldwide' },
        { t: 'Inspire Youth', d: 'Inspire and mentor the next generation of young athletes in Israel to pursue their dreams' },
        { t: 'Break Records', d: 'Continue making history and setting new standards for young Israeli athletes in beach volleyball' },
      ],
    },
    sponsor: {
      heading: 'Fly with Omer in 2026.',
      sub: 'Four countries. Six tournaments. One Youth Olympics. We\'re assembling the brand team now — three partner slots remain.',
      items: [
        { t: 'Rising Star', d: 'Partner with an athlete at the beginning of a promising international career' },
        { t: 'Young Audience', d: 'Connect with youth sports enthusiasts and their families across Israel' },
        { t: 'International Exposure', d: 'Brand visibility at European championships and international tournaments' },
        { t: 'Content & Media', d: 'Authentic content creation and social media collaboration opportunities' },
        { t: 'Inspiring Story', d: 'Align with a dedicated athlete who embodies determination and excellence' },
        { t: 'Long-term Partnership', d: 'Grow together as Omer advances to professional international competition' },
      ],
    },
    reach: {
      heading: 'Brand Exposure & Reach',
      intro: 'Participating in elite youth volleyball competitions offers sponsors substantial brand exposure through live attendance, TV broadcasts, streaming, and social media reach across Europe and globally. A youth player\'s visibility as a key athlete can amplify this via jersey logos, court-side banners, and player profiles. Exposure scales with event prestige, from continental youth events to world championships.',
      items: [
        { t: 'CEV Age Group Events', d: 'CEV U18 and U20 European Championships feature venues with capacities of 750-1,000 spectators per match, meeting minimum average attendances of 400-1,250 fans. These tournaments draw dedicated European crowds and are streamed on platforms like EuroVolley.TV, contributing to broader CEV digital audiences exceeding millions cumulatively. Sponsors gain visibility in 25+ countries via production coverage.' },
        { t: 'Senior CEV Competitions', d: 'Adult CEV events, such as Champions League or European Championships, attract larger crowds with averages over 1,000 per match and total attendances like 88,365 across seasons. High-profile matches see 5,000+ attendees, with TV audiences in the tens of millions (e.g., 63.5 million cumulative over five years). Broadcasts span 45+ channels, offering pan-European exposure.' },
        { t: 'FIVB World Championships (U18/U20, Netherlands 2026)', d: 'Past FIVB U18/U20 World Championships generated 19 million YouTube views, 2.15 million watch hours, and peaks of 131,500 concurrent viewers per match. Finals draw millions in key markets like Italy and Poland (5+ million combined). Hosting in the Netherlands boosts local attendance potential, with global streaming amplifying sponsor branding.' },
        { t: 'European Championships & Youth Olympics', d: 'European U18/U20 Championships mirror CEV figures with similar venue sizes and regional TV reach. The 2026 Youth Olympics in Dakar include volleyball at venues like Dakar Arena (7,500 capacity), engaging 60,000+ participants in past Olympic volleyball experiences and building youth-focused global buzz. Sponsors benefit from IOC media partnerships and social amplification.' },
      ],
    },
    countdown: { days: 'DAYS', to_dakar: 'TO DAKAR 2026' },
    sticky_cta: 'Become a Partner',
    contact: {
      heading: 'Let\'s talk.',
      sub: 'Looking to partner with Omer on the road to Dakar 2026? Get in touch — we\'ll send the sponsorship deck.',
      cta_email: 'Email Us',
      cta_ig: 'Follow on Instagram',
    },
    footer: {
      name: 'OMER GOZLAN',
      sub: 'Israeli Beach Volleyball National Team | The Academy for Excellence in Sports, Wingate Institute',
      copy: '© 2026 Omer Gozlan. All rights reserved.',
    },
  },
};

export function useLang() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he');

  useEffect(() => {
    if (localStorage.getItem('lang')) return;
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setLang(d.country_code === 'IL' ? 'he' : 'en'))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggle = () => {
    const next = lang === 'he' ? 'en' : 'he';
    localStorage.setItem('lang', next);
    setLang(next);
  };

  return { lang, t: translations[lang], toggle };
}
