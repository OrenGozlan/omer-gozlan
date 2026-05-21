import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from './i18n';

const PHOTOS = [
  '/photos/VIK_1692.jpg',
  '/photos/VIK_0434.jpg',
  '/photos/VIK_0475.jpg',
  '/photos/VIK_0504.jpg',
  '/photos/VIK_0507.jpg',
  '/photos/VIK_8913.JPG',
  '/photos/VIK_8968.JPG',
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
          className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              OMER GOZLAN
            </button>
            <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base">
              <button onClick={() => go('about')} className="hidden md:block hover:text-amber-400 font-semibold">{t.nav.about}</button>
              <button onClick={() => go('achievements')} className="hover:text-amber-400 font-semibold">{t.nav.achievements}</button>
              <button onClick={() => go('gallery')} className="hidden md:block hover:text-amber-400 font-semibold">{t.nav.gallery}</button>
              <button onClick={() => go('sponsor')} className="hover:text-amber-400 font-semibold">{t.nav.sponsor}</button>
              <button onClick={toggle} className="px-3 py-1 border border-amber-400 text-amber-400 rounded font-bold text-xs">
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${PHOTOS[0]})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-5xl md:text-8xl font-black mb-4 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          {t.hero.name}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 font-semibold mb-8">{t.hero.title}</p>
        <button onClick={() => document.getElementById('sponsor')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
          {t.hero.cta}
        </button>
      </motion.div>
    </section>
  );
}

function About({ t }) {
  return (
    <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-black mb-8 text-amber-400">{t.about.heading}</motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-lg md:text-xl leading-relaxed text-white/80">{t.about.body}</motion.p>
    </section>
  );
}

function Achievements({ t }) {
  return (
    <section id="achievements" className="py-24 px-6 bg-gradient-to-b from-black via-stone-950 to-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-amber-400">{t.achievements.heading}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {t.achievements.items.map((a, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-400/30 rounded-2xl p-8 hover:scale-105 transition-transform">
              <div className="text-7xl font-black bg-gradient-to-br from-amber-300 to-orange-500 bg-clip-text text-transparent mb-3">
                #{a.place}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{a.title}</h3>
              <p className="text-amber-300 font-semibold">{a.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ t }) {
  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-amber-400">{t.gallery.heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PHOTOS.slice(1).map((src, i) => (
          <motion.div key={src}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-xl aspect-[3/4] group">
            <img src={src} alt="" loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Sponsor({ t }) {
  return (
    <section id="sponsor" className="py-24 px-6 bg-gradient-to-b from-black to-amber-950/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-12 text-amber-400">{t.sponsor.heading}</h2>
        <ul className="grid md:grid-cols-2 gap-4 mb-12 text-start">
          {t.sponsor.bullets.map((b, i) => (
            <motion.li key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
              <span className="text-amber-400 text-2xl">★</span>
              <span className="text-lg">{b}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="py-8 text-center text-white/40 text-sm border-t border-white/10">
      {t.footer}
    </footer>
  );
}

export default function App() {
  const { lang, t, toggle } = useLang();
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav t={t} lang={lang} toggle={toggle} />
      <Hero t={t} />
      <About t={t} />
      <Achievements t={t} />
      <Gallery t={t} />
      <Sponsor t={t} />
      <Footer t={t} />
    </div>
  );
}
