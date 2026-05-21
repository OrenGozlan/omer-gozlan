import { useEffect, useState } from 'react';

export const translations = {
  he: {
    nav: { achievements: 'הישגים', about: 'אודות', gallery: 'גלריה', sponsor: 'חסות' },
    hero: {
      name: 'עומר גוזלן',
      title: 'כדורעף חופים | נבחרת ישראל',
      cta: 'הצטרפו כשותפים',
    },
    about: {
      heading: 'אודות',
      body: 'שחקן כדורעף חופים מקצועי, מייצג את ישראל בזירות הבינלאומיות. שילוב של מצוינות אתלטית, עבודה קשה ומשמעת — שואף לפסגה האולימפית.',
    },
    achievements: {
      heading: 'הישגי 2026',
      items: [
        { place: '1', title: 'גביע אומות CEV 2026 — בוגרים', sub: 'מקום ראשון' },
        { place: '2', title: 'גביע לאומי הונגריה — בוגרים', sub: 'מקום שני' },
      ],
    },
    gallery: { heading: 'גלריה' },
    sponsor: {
      heading: 'מדוע לתת חסות?',
      bullets: [
        'חשיפה בינלאומית בטורנירי CEV ו-FIVB',
        'מיתוג על מדים, ציוד ותוכן ברשתות',
        'שותפות עם ספורטאי בדרך לאולימפיאדה',
        'קהל ישראלי ואירופי צעיר ופעיל',
      ],
      cta: 'צרו קשר',
    },
    footer: 'עומר גוזלן © 2026',
  },
  en: {
    nav: { achievements: 'Achievements', about: 'About', gallery: 'Gallery', sponsor: 'Sponsor' },
    hero: {
      name: 'OMER GOZLAN',
      title: 'Beach Volleyball | Team Israel',
      cta: 'Become a Partner',
    },
    about: {
      heading: 'About',
      body: 'Professional beach volleyball player representing Israel on the international stage. Athletic excellence, hard work, and discipline — chasing the Olympic dream.',
    },
    achievements: {
      heading: '2026 Achievements',
      items: [
        { place: '1', title: 'CEV Nations Cup 2026 — Adults', sub: '1st Place' },
        { place: '2', title: 'Hungary National Cup — Adults', sub: '2nd Place' },
      ],
    },
    gallery: { heading: 'Gallery' },
    sponsor: {
      heading: 'Why Sponsor?',
      bullets: [
        'International exposure at CEV & FIVB tournaments',
        'Branding on kit, gear, and social content',
        'Partnership with an Olympic-track athlete',
        'Engaged Israeli and European young audience',
      ],
      cta: 'Get in Touch',
    },
    footer: 'Omer Gozlan © 2026',
  },
};

export function useLang() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he');

  useEffect(() => {
    if (localStorage.getItem('lang')) return;
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        const detected = d.country_code === 'IL' ? 'he' : 'en';
        setLang(detected);
      })
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
