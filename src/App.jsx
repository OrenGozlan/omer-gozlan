import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './i18n';

const B = import.meta.env.BASE_URL;
const P = (f) => `${B}photos/${f}`;
const EMAIL = 'oren.gozlan@gmail.com';
const IG_OMER = 'g0zlan_';
const IG_TEAM = 'beachallvolleyball';

const HERO_IMG = P('VIK_1692.jpg');
const DAKAR_DATE = new Date('2026-10-31T00:00:00Z');
const daysToDakar = () => Math.max(0, Math.ceil((DAKAR_DATE - new Date()) / 86400000));

const GALLERY = [
  { src: P('VIK_0434.jpg'), event: 'cev2026', he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0475.jpg'), event: 'cev2026', he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0504.jpg'), event: 'cev2026', he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0507.jpg'), event: 'cev2026', he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_8913.JPG'), event: 'hungary', he: 'גביע לאומי הונגריה 2026', en: 'Hungary National Cup 2026' },
  { src: P('VIK_8968.JPG'), event: 'hungary', he: 'גביע לאומי הונגריה 2026', en: 'Hungary National Cup 2026' },
  { src: P('european-championship.jpg'), event: 'euro', he: 'אליפות אירופה', en: 'European Championship' },
  { src: P('cyprus-bronze.jpg'), event: 'euro', he: 'מדליית ארד קפריסין', en: 'Cyprus Bronze Medal' },
  { src: P('slovenia-cev.jpg'), event: 'euro', he: 'CEV סלובניה', en: 'Slovenia CEV' },
  { src: P('cev-medal.jpg'), event: 'euro', he: 'טקס מדליית CEV', en: 'CEV Medal Ceremony' },
  { src: P('tournament-bronze.jpg'), event: 'euro', he: 'ארד טורניר', en: 'Tournament Bronze' },
  { src: P('israeli-championship.png'), event: 'israel', he: 'אליפות ישראל', en: 'Israeli Championship' },
  { src: P('championship-gold.jpg'), event: 'israel', he: 'זהב אליפות', en: 'Championship Gold' },
  { src: P('beach-tournament.jpg'), event: 'israel', he: 'טורניר חופים', en: 'Beach Tournament' },
  { src: P('victory-podium.jpg'), event: 'action', he: 'פודיום ניצחון', en: 'Victory Podium' },
  { src: P('power-spike.png'), event: 'action', he: 'הנחתת עוצמה', en: 'Power Spike' },
  { src: P('precision-pass.jpg'), event: 'action', he: 'מסירה מדויקת', en: 'Precision Pass' },
  { src: P('competition-intensity.jpg'), event: 'action', he: 'עצמת תחרות', en: 'Competition Intensity' },
  { src: P('championship-focus.jpg'), event: 'action', he: 'ריכוז באליפות', en: 'Championship Focus' },
  { src: P('focused-athlete.jpg'), event: 'action', he: 'ספורטאי ממוקד', en: 'Focused Athlete' },
  { src: P('team-partnership.jpg'), event: 'action', he: 'שיתוף פעולה', en: 'Team Partnership' },
  { src: P('defensive-play.jpg'), event: 'action', he: 'משחק הגנה', en: 'Defensive Play' },
  { src: P('victory-moment.jpg'), event: 'action', he: 'רגע ניצחון', en: 'Victory Moment' },
];

const EVENT_GROUPS = {
  cev2026: { he: 'גביע אומות CEV 2026 — זהב', en: 'CEV Nations Cup 2026 — Gold' },
  hungary: { he: 'גביע לאומי הונגריה 2026 — כסף', en: 'Hungary National Cup 2026 — Silver' },
  euro: { he: 'אליפויות אירופה 2025', en: '2025 European Championships' },
  israel: { he: 'אליפות ישראל', en: 'Israel Championship' },
  action: { he: 'אקשן', en: 'Action' },
};

function Nav({ t, lang, toggle }) {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 100);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const links = [
    ['about', t.nav.about],
    ['record', t.nav.record],
    ['targets', t.nav.targets],
    ['gallery', t.nav.gallery],
    ['sponsor', t.nav.sponsor],
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-lg md:text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
              OMER GOZLAN
            </button>
            <div className="hidden md:flex items-center gap-5 text-sm">
              {links.map(([id, label]) => (
                <button key={id} onClick={() => go(id)} className="text-stone-700 hover:text-amber-700 font-semibold">{label}</button>
              ))}
              <button onClick={() => go('contact')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-sm hover:scale-105 transition-transform shadow">
                {t.nav.contact}
              </button>
              <button onClick={toggle} className="px-3 py-1 border border-amber-500 text-amber-700 rounded font-bold text-xs hover:bg-amber-50">
                {lang === 'he' ? 'EN' : 'עב'}
              </button>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <button onClick={toggle} className="px-2 py-1 border border-amber-500 text-amber-700 rounded font-bold text-xs">
                {lang === 'he' ? 'EN' : 'עב'}
              </button>
              <button onClick={() => setOpen(o => !o)} aria-label="menu" className="p-2 text-stone-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {open ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>
                    : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>}
                </svg>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="md:hidden overflow-hidden bg-white border-t border-amber-200/60">
                <div className="px-6 py-4 flex flex-col gap-3">
                  {links.map(([id, label]) => (
                    <button key={id} onClick={() => go(id)} className="text-start text-stone-700 hover:text-amber-700 font-semibold py-2">
                      {label}
                    </button>
                  ))}
                  <button onClick={() => go('contact')}
                    className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-center">
                    {t.nav.contact}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function Hero({ t }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${HERO_IMG})` }} />
      <div className="absolute inset-0 bg-stone-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-900/80" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 pt-20 max-w-5xl">
        <div className="hero-text flex items-center justify-center gap-3 mb-6 text-amber-200 font-bold text-sm md:text-base">
          <span className="bidi-iso">🏐</span><span>{t.hero.tagline}</span><span className="bidi-iso">🇮🇱</span>
        </div>
        <h1 className="font-display-en hero-text text-6xl md:text-9xl font-black mb-4 text-white leading-[0.9] uppercase">
          {t.hero.name}
        </h1>
        <p className="hero-text text-xl md:text-3xl text-amber-100 font-bold mb-6">{t.hero.sub}</p>
        <div className="inline-flex items-center gap-3 px-5 py-2 mb-6 bg-amber-500/20 backdrop-blur border border-amber-300/50 rounded-full">
          <span className="text-2xl md:text-3xl font-black text-amber-200 tabular-nums">{daysToDakar()}</span>
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-amber-100">{t.countdown.days} · {t.countdown.to_dakar}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
          {t.hero.badges.map((b, i) => (
            <span key={i} className="px-3 md:px-4 py-1.5 bg-white/95 border border-amber-300 rounded-full text-xs md:text-sm font-bold text-amber-800 shadow-lg">{b}</span>
          ))}
        </div>
        <p className="hero-text hidden md:block text-base md:text-lg text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed">{t.hero.blurb}</p>
        <p className="hero-text md:hidden text-base text-white/95 max-w-md mx-auto mb-8 leading-relaxed">{t.hero.blurb_short}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl w-full sm:w-auto">
            {t.hero.cta}
          </button>
          <button onClick={() => document.getElementById('record')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/70 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors w-full sm:w-auto">
            {t.hero.cta2}
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function Stats({ t }) {
  return (
    <section className="py-20 md:py-28 px-6 bg-slate-900 text-white border-y-4 border-amber-500">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800">
        {t.stats.map((s, i) => (
          <div key={i} className="bg-slate-900 text-center p-8 md:p-10">
            <div className="font-display-en text-7xl md:text-9xl font-black text-amber-400 tabular-nums leading-none mb-3">{s.n}</div>
            <div className="text-stone-300 text-xs md:text-sm font-bold uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ t }) {
  const cards = [
    { h: t.about.bg_h, b: t.about.bg },
    { h: t.about.edu_h, b: t.about.edu },
    { h: t.about.rec_h, b: t.about.rec },
  ];
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 text-center text-amber-800">{t.about.heading}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-amber-50/60 border border-amber-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-amber-800 mb-4">{c.h}</h3>
              <p className="text-stone-700 leading-relaxed">{c.b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Record({ t }) {
  const Season = ({ heading, items, accent }) => (
    <div className="mb-10">
      <h3 className={`text-2xl md:text-3xl font-black mb-5 ${accent}`}>{heading}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a, i) => (
          <div key={i} className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all">
            <div className="text-4xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">{a.rank}</div>
            <h4 className="text-lg font-bold mb-1 text-stone-800">{a.title}</h4>
            <p className="text-amber-800 text-sm font-semibold">{a.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section id="record" className="py-24 px-6 bg-gradient-to-b from-orange-50/60 via-amber-50 to-orange-50/60">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 text-center text-amber-800">{t.record.heading}</h2>
        <Season heading={t.record.s2026_h} items={t.record.s2026} accent="text-orange-700" />
        <Season heading={t.record.s2025_h} items={t.record.s2025} accent="text-amber-800" />
        <Season heading={t.record.s2024_h} items={t.record.s2024} accent="text-amber-700" />
        <p className="text-center text-stone-700 text-lg max-w-3xl mx-auto mt-8 leading-relaxed">{t.record.progression}</p>
      </div>
    </section>
  );
}

function Targets({ t }) {
  const tagColor = (tag) => {
    if (['לאומי', 'National'].includes(tag)) return 'bg-blue-100 border-blue-300 text-blue-800';
    if (['יבשתי', 'Continental'].includes(tag)) return 'bg-purple-100 border-purple-300 text-purple-800';
    return 'bg-amber-100 border-amber-300 text-amber-800';
  };
  return (
    <section id="targets" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight text-center text-amber-800 mb-3">{t.targets.heading}</h2>
        <p className="text-center text-stone-600 mb-12">{t.targets.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {t.targets.items.map((it, i) => (
            <div key={i} className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <span className={`self-start text-xs font-bold px-2 py-1 rounded border ${tagColor(it.tag)}`}>{it.tag}</span>
              <h3 className="text-xl font-bold mt-1 text-stone-800">{it.t}</h3>
              <p className="text-stone-600 text-sm">{it.s}</p>
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="inline-block text-xs md:text-sm font-black tracking-widest text-amber-50 mb-3">{t.targets.olympic_h}</div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 hero-text">{t.targets.olympic_t}</h3>
          <p className="text-white/95 max-w-2xl mx-auto leading-relaxed">{t.targets.olympic_b}</p>
        </motion.div>
        <p className="text-center text-stone-600 max-w-3xl mx-auto mt-10 italic">{t.targets.foot}</p>
      </div>
    </section>
  );
}

function Testimonial({ t }) {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-amber-50 to-orange-50/60">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-amber-800 mb-10">{t.testimonial.heading}</h2>
        <blockquote className="text-xl md:text-2xl text-stone-800 font-medium leading-relaxed italic mb-8">
          {t.testimonial.quote}
        </blockquote>
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-xl text-white shadow-lg">EA</div>
          <div className="font-bold text-amber-800">{t.testimonial.author}</div>
          <div className="text-stone-600 text-sm">{t.testimonial.role}</div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ t, lang }) {
  const [lightbox, setLightbox] = useState(null);
  const grouped = Object.keys(EVENT_GROUPS).map(key => ({
    key,
    title: EVENT_GROUPS[key][lang],
    photos: GALLERY.filter(g => g.event === key),
  }));

  return (
    <section id="gallery" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 text-center text-amber-800">{t.gallery.heading}</h2>
        {grouped.map(group => (
          <div key={group.key} className="mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-amber-700 mb-5">{group.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {group.photos.map((img) => (
                <button key={img.src} onClick={() => setLightbox(img)}
                  className="relative overflow-hidden rounded-xl aspect-[3/4] group shadow-md hover:shadow-2xl transition-shadow text-start">
                  <img src={img.src} alt={img[lang]} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 to-transparent p-2.5">
                    <span className="text-xs font-semibold text-white">{img[lang]}</span>
                  </div>
                  <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-3">
                    <span className="text-sm font-semibold text-white">{img[lang]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-stone-950/95 flex items-center justify-center p-4 cursor-pointer">
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl">×</button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={lightbox.src} alt={lightbox[lang]}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" />
            <div className="absolute bottom-6 left-0 right-0 text-center text-white font-semibold">{lightbox[lang]}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Vision({ t }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-orange-50/60 to-amber-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight text-center text-amber-800 mb-3">{t.vision.heading}</h2>
        <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">{t.vision.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.vision.items.map((it, i) => (
            <div key={i} className="bg-white border border-amber-200 rounded-2xl p-6 text-center hover:border-amber-400 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-amber-800 mb-3">{it.t}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reach({ t }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-slate-900 text-white border-y-4 border-amber-500">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black text-center text-amber-400 mb-6 uppercase tracking-tight">{t.reach.heading}</h2>
        <p className="text-center text-stone-300 max-w-4xl mx-auto mb-12 leading-relaxed text-lg">{t.reach.intro}</p>
        <div className="grid md:grid-cols-2 gap-5">
          {t.reach.items.map((it, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-7 hover:border-amber-500 transition-colors">
              <h3 className="text-xl font-bold text-amber-400 mb-3">{it.t}</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sponsor({ t }) {
  return (
    <section id="sponsor" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display-en text-4xl md:text-6xl font-black uppercase tracking-tight text-center text-amber-800 mb-4">{t.sponsor.heading}</h2>
        <p className="text-center text-stone-700 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">{t.sponsor.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {t.sponsor.items.map((it, i) => (
            <div key={i} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 hover:bg-amber-100/60 hover:shadow-md transition-all">
              <div className="text-amber-500 text-3xl mb-3">★</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">{it.t}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
            {t.nav.contact} →
          </button>
        </div>
      </div>
    </section>
  );
}

function Contact({ t, lang }) {
  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-5 hero-text">{t.contact.heading}</h2>
        <p className="text-lg md:text-xl text-amber-50 mb-10 leading-relaxed">{t.contact.sub}</p>
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(lang === 'he' ? 'חסות לעומר גוזלן' : 'Sponsorship — Omer Gozlan')}`}
            className="px-8 py-4 bg-white text-amber-700 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
            ✉ {t.contact.cta_email}
          </a>
          <a href={`https://instagram.com/${IG_OMER}`} target="_blank" rel="noopener"
            className="px-8 py-4 bg-stone-900/20 backdrop-blur border-2 border-white text-white rounded-full font-bold text-lg hover:bg-stone-900/30 transition-colors">
            📷 @{IG_OMER}
          </a>
        </div>
        <p className="mt-8 text-amber-50/90 text-sm">
          <a href={`mailto:${EMAIL}`} className="underline hover:text-white">{EMAIL}</a>
          {' · '}
          <a href={`https://instagram.com/${IG_TEAM}`} target="_blank" rel="noopener" className="underline hover:text-white">@{IG_TEAM}</a>
        </p>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="py-10 px-6 text-center border-t border-amber-200 bg-amber-50">
      <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">{t.footer.name}</h3>
      <p className="text-stone-700 text-sm md:text-base mb-4 max-w-2xl mx-auto">{t.footer.sub}</p>
      <div className="flex items-center justify-center gap-4 mb-4 text-sm">
        <a href={`mailto:${EMAIL}`} className="text-amber-700 hover:text-amber-900 font-semibold">✉ {EMAIL}</a>
        <a href={`https://instagram.com/${IG_OMER}`} target="_blank" rel="noopener" className="text-amber-700 hover:text-amber-900 font-semibold">📷 @{IG_OMER}</a>
      </div>
      <p className="text-stone-500 text-xs">{t.footer.copy}</p>
    </footer>
  );
}

function StickyCTA({ t }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-5 end-5 z-40 px-5 md:px-7 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-black uppercase tracking-wide text-sm md:text-base shadow-2xl hover:scale-105 transition-transform">
          {t.sticky_cta} →
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const { lang, t, toggle } = useLang();
  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900">
      <Nav t={t} lang={lang} toggle={toggle} />
      <StickyCTA t={t} />
      <Hero t={t} />
      <Stats t={t} />
      <About t={t} />
      <Record t={t} />
      <Targets t={t} />
      <Testimonial t={t} />
      <Gallery t={t} lang={lang} />
      <Vision t={t} />
      <Reach t={t} />
      <Sponsor t={t} />
      <Contact t={t} lang={lang} />
      <Footer t={t} />
    </div>
  );
}
