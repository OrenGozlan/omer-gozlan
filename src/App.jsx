import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './i18n';

const B = import.meta.env.BASE_URL;
const P = (f) => `${B}photos/${f}`;

const HERO_IMG = P('VIK_1692.jpg');

const GALLERY = [
  { src: P('VIK_0434.jpg'), he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0475.jpg'), he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0504.jpg'), he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_0507.jpg'), he: 'גביע אומות CEV 2026', en: 'CEV Nations Cup 2026' },
  { src: P('VIK_8913.JPG'), he: 'גביע לאומי הונגריה 2026', en: 'Hungary National Cup 2026' },
  { src: P('VIK_8968.JPG'), he: 'גביע לאומי הונגריה 2026', en: 'Hungary National Cup 2026' },
  { src: P('european-championship.jpg'), he: 'אליפות אירופה', en: 'European Championship' },
  { src: P('cyprus-bronze.jpg'), he: 'מדליית ארד קפריסין', en: 'Cyprus Bronze Medal' },
  { src: P('precision-pass.jpg'), he: 'מסירה מדויקת', en: 'Precision Pass' },
  { src: P('competition-intensity.jpg'), he: 'עצמת תחרות', en: 'Competition Intensity' },
  { src: P('cev-medal.jpg'), he: 'טקס מדליית CEV', en: 'CEV Medal Ceremony' },
  { src: P('championship-focus.jpg'), he: 'ריכוז באליפות', en: 'Championship Focus' },
  { src: P('victory-podium.jpg'), he: 'פודיום ניצחון', en: 'Victory Podium' },
  { src: P('power-spike.png'), he: 'הנחתת עוצמה', en: 'Power Spike' },
  { src: P('israeli-championship.png'), he: 'אליפות ישראל', en: 'Israeli Championship' },
  { src: P('beach-tournament.jpg'), he: 'טורניר חופים', en: 'Beach Tournament' },
  { src: P('championship-gold.jpg'), he: 'זהב אליפות', en: 'Championship Gold' },
  { src: P('focused-athlete.jpg'), he: 'ספורטאי ממוקד', en: 'Focused Athlete' },
  { src: P('team-partnership.jpg'), he: 'שיתוף פעולה', en: 'Team Partnership' },
  { src: P('defensive-play.jpg'), he: 'משחק הגנה', en: 'Defensive Play' },
  { src: P('victory-moment.jpg'), he: 'רגע ניצחון', en: 'Victory Moment' },
  { src: P('tournament-bronze.jpg'), he: 'ארד טורניר', en: 'Tournament Bronze' },
  { src: P('slovenia-cev.jpg'), he: 'CEV סלובניה', en: 'Slovenia CEV' },
];

function Nav({ t, lang, toggle }) {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 100);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-amber-200/60 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-lg md:text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
              OMER GOZLAN
            </button>
            <div className="flex items-center gap-2 md:gap-5 text-xs md:text-base">
              <button onClick={() => go('about')} className="hidden sm:block text-stone-700 hover:text-amber-700 font-semibold">{t.nav.about}</button>
              <button onClick={() => go('record')} className="text-stone-700 hover:text-amber-700 font-semibold">{t.nav.record}</button>
              <button onClick={() => go('targets')} className="hidden md:block text-stone-700 hover:text-amber-700 font-semibold">{t.nav.targets}</button>
              <button onClick={() => go('gallery')} className="hidden sm:block text-stone-700 hover:text-amber-700 font-semibold">{t.nav.gallery}</button>
              <button onClick={() => go('sponsor')} className="text-stone-700 hover:text-amber-700 font-semibold">{t.nav.sponsor}</button>
              <button onClick={toggle} className="px-2 md:px-3 py-1 border border-amber-500 text-amber-700 rounded font-bold text-xs hover:bg-amber-50">
                {lang === 'he' ? 'EN' : 'עב'}
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function Hero({ t }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${HERO_IMG})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-900/70 to-amber-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 pt-20 max-w-5xl">
        <div className="flex items-center justify-center gap-3 mb-6 text-white font-bold text-sm md:text-base drop-shadow-lg">
          <span>🏐</span><span>{t.hero.tagline}</span><span>🇮🇱</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-4 text-white drop-shadow-2xl leading-tight">
          {t.hero.name}
        </h1>
        <p className="text-xl md:text-3xl text-amber-50 font-bold mb-6 drop-shadow-lg">{t.hero.sub}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
          {t.hero.badges.map((b, i) => (
            <span key={i} className="px-3 md:px-4 py-1.5 bg-white/90 backdrop-blur border border-amber-300 rounded-full text-xs md:text-sm font-bold text-amber-800 shadow-lg">{b}</span>
          ))}
        </div>
        <p className="text-base md:text-lg text-white/95 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow">{t.hero.blurb}</p>
        <button onClick={() => document.getElementById('record')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
          {t.hero.cta}
        </button>
      </motion.div>
    </section>
  );
}

function Stats({ t }) {
  return (
    <section className="py-14 px-6 bg-gradient-to-b from-amber-50 to-orange-50/60">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {t.stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center bg-white border border-amber-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">{s.n}</div>
            <div className="text-stone-600 text-sm md:text-base font-semibold">{s.l}</div>
          </motion.div>
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
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-amber-700">{t.about.heading}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-amber-50/60 border border-amber-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-amber-700 mb-4">{c.h}</h3>
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
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all">
            <div className="text-4xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">{a.rank}</div>
            <h4 className="text-lg font-bold mb-1 text-stone-800">{a.title}</h4>
            <p className="text-amber-700 text-sm font-semibold">{a.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
  return (
    <section id="record" className="py-24 px-6 bg-gradient-to-b from-orange-50/60 via-amber-50 to-orange-50/60">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-amber-700">{t.record.heading}</h2>
        <Season heading={t.record.s2026_h} items={t.record.s2026} accent="text-orange-700" />
        <Season heading={t.record.s2025_h} items={t.record.s2025} accent="text-amber-700" />
        <Season heading={t.record.s2024_h} items={t.record.s2024} accent="text-amber-600" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-stone-700 text-lg max-w-3xl mx-auto mt-8 leading-relaxed">
          {t.record.progression}
        </motion.p>
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
        <h2 className="text-4xl md:text-5xl font-black text-center text-amber-700 mb-3">{t.targets.heading}</h2>
        <p className="text-center text-stone-600 mb-12">{t.targets.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {t.targets.items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <span className={`self-start text-xs font-bold px-2 py-1 rounded border ${tagColor(it.tag)}`}>{it.tag}</span>
              <h3 className="text-xl font-bold mt-1 text-stone-800">{it.t}</h3>
              <p className="text-stone-600 text-sm">{it.s}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="inline-block text-xs md:text-sm font-black tracking-widest text-amber-50 mb-3">{t.targets.olympic_h}</div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">{t.targets.olympic_t}</h3>
          <p className="text-white/95 max-w-2xl mx-auto leading-relaxed">{t.targets.olympic_b}</p>
        </motion.div>
        <p className="text-center text-stone-600 max-w-3xl mx-auto mt-10 italic">{t.targets.foot}</p>
      </div>
    </section>
  );
}

function Testimonial({ t }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-amber-50 to-orange-50/60">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-amber-700 mb-10">{t.testimonial.heading}</h2>
        <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xl md:text-2xl text-stone-800 font-medium leading-relaxed italic mb-8">
          {t.testimonial.quote}
        </motion.blockquote>
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-xl text-white shadow-lg">
            EA
          </div>
          <div className="font-bold text-amber-800">{t.testimonial.author}</div>
          <div className="text-stone-600 text-sm">{t.testimonial.role}</div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ t, lang }) {
  return (
    <section id="gallery" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-amber-700">{t.gallery.heading}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.map((img, i) => (
            <motion.div key={img.src}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.05 }}
              className="relative overflow-hidden rounded-xl aspect-[3/4] group shadow-md hover:shadow-2xl transition-shadow">
              <img src={img.src} alt={img[lang]} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/85 via-amber-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs md:text-sm font-semibold text-white">{img[lang]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vision({ t }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-orange-50/60 to-amber-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center text-amber-700 mb-3">{t.vision.heading}</h2>
        <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">{t.vision.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.vision.items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-amber-200 rounded-2xl p-6 text-center hover:border-amber-400 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-amber-700 mb-3">{it.t}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{it.d}</p>
            </motion.div>
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
        <h2 className="text-4xl md:text-5xl font-black text-center text-amber-700 mb-3">{t.sponsor.heading}</h2>
        <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">{t.sponsor.sub}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.sponsor.items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 hover:bg-amber-100/60 hover:shadow-md transition-all">
              <div className="text-amber-500 text-3xl mb-3">★</div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">{it.t}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reach({ t }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-amber-50 to-orange-50/60">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center text-amber-700 mb-6">{t.reach.heading}</h2>
        <p className="text-center text-stone-700 max-w-4xl mx-auto mb-12 leading-relaxed">{t.reach.intro}</p>
        <div className="grid md:grid-cols-2 gap-5">
          {t.reach.items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-amber-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-amber-700 mb-3">{it.t}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="py-12 px-6 text-center border-t border-amber-200 bg-amber-50">
      <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">{t.footer.name}</h3>
      <p className="text-stone-700 text-sm md:text-base mb-4 max-w-2xl mx-auto">{t.footer.sub}</p>
      <p className="text-stone-500 text-xs">{t.footer.copy}</p>
    </footer>
  );
}

export default function App() {
  const { lang, t, toggle } = useLang();
  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900">
      <Nav t={t} lang={lang} toggle={toggle} />
      <Hero t={t} />
      <Stats t={t} />
      <About t={t} />
      <Record t={t} />
      <Targets t={t} />
      <Testimonial t={t} />
      <Gallery t={t} lang={lang} />
      <Vision t={t} />
      <Sponsor t={t} />
      <Reach t={t} />
      <Footer t={t} />
    </div>
  );
}
