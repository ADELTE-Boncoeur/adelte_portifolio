import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profileImage from './assets/profile.jpg';

// ————————————————————————————————————
// THEME + CURSOR + LANGUAGE SYSTEM
// ————————————————————————————————————
type Theme = 'light' | 'dark' | 'neon' | 'sunset' | 'forest';
type Cursor = 'default' | 'pointer' | 'text' | 'cross' | 'grab';
type LangCode = 'en' | 'fr' | 'rw' | 'es' | 'ar' | 'zh' | 'pt' | 'de' | 'sw' | 'hi';

const THEMES: Array<{ id: Theme; name: string; bg: string; preview: string; emoji: string }> = [
  { id: 'light', name: 'Light Paper', bg: 'linear-gradient(135deg,#fefcf6,#fff7ed)', preview: 'linear-gradient(135deg,#fefcf6,#e0e7ff)', emoji: '☀️' },
  { id: 'dark', name: 'Dark Slate', bg: 'linear-gradient(135deg,#020617,#1e293b)', preview: 'linear-gradient(135deg,#020617,#312e81)', emoji: '🌙' },
  { id: 'neon', name: 'Neon Cyber', bg: 'linear-gradient(135deg,#050018,#ff00ff)', preview: 'linear-gradient(135deg,#050018,#00ffff)', emoji: '⚡' },
  { id: 'sunset', name: 'Sunset Glow', bg: 'linear-gradient(135deg,#fff7ed,#fb923c)', preview: 'linear-gradient(135deg,#fff7ed,#db2777)', emoji: '🌅' },
  { id: 'forest', name: 'Forest', bg: 'linear-gradient(135deg,#052e16,#10b981)', preview: 'linear-gradient(135deg,#052e16,#84cc16)', emoji: '🌲' }
];

const CURSORS: Array<{ id: Cursor; name: string; preview: string }> = [
  { id: 'default', name: 'Pointer', preview: 'M3 2 L3 22 L8 17 L11 25 L15 23 L12 15 L20 15 Z' },
  { id: 'pointer', name: 'Indigo', preview: 'M11 2 L11 20 L15 16 L18 23 L21 22 L18 15 L24 15 Z' },
  { id: 'text', name: 'Caret', preview: 'L6 3 V25 M3 14 H9' },
  { id: 'cross', name: 'Target', preview: 'M16 2 V30 M2 16 H30 circle' },
  { id: 'grab', name: 'Grab', preview: 'M11 4 V18 H8 V22 H24 V18 H21 V4' }
];

// Simple UI translations (translate the *interface* of the page, not full content)
const I18N: Record<LangCode, Record<string, string>> = {
  en: { hero: 'Building the Future Through Code', tagline: 'Software Developer • AI Builder • Platform Architect', viewProjects: 'View 12 Projects', writeRun: 'Write & Run Code', download: 'Download Resume', search: 'Search AdelTe Industries...' },
  fr: { hero: 'Construire l\'Avenir Grâce au Code', tagline: 'Développeur • Créateur d\'IA • Architecte Plateforme', viewProjects: 'Voir 12 Projets', writeRun: 'Écrire & Exécuter', download: 'Télécharger CV', search: 'Rechercher AdelTe Industries...' },
  rw: { hero: 'Kubaka ejo hakoreshejwe na Code', tagline: 'Umukinnyi wa Porogaramu • Umwubatsi wa AI', viewProjects: 'Reba Imishinga 12', writeRun: 'Andika & Koresha', download: 'Pakira CV', search: 'Shakisha AdelTe Industries...' },
  es: { hero: 'Construyendo el Futuro con Código', tagline: 'Desarrollador • Creador de IA • Arquitecto', viewProjects: 'Ver 12 Proyectos', writeRun: 'Escribir y Ejecutar', download: 'Descargar CV', search: 'Buscar AdelTe Industries...' },
  ar: { hero: 'بناء المستقبل من خلال الكود', tagline: 'مطور • منشئ ذكاء اصطناعي • مهندس منصات', viewProjects: 'عرض 12 مشروع', writeRun: 'كتابة وتشغيل', download: 'تحميل السيرة', search: 'ابحث في AdelTe...' },
  zh: { hero: '用代码构建未来', tagline: '开发者 • AI 创造者 • 平台架构师', viewProjects: '查看 12 个项目', writeRun: '编写并运行', download: '下载简历', search: '搜索 AdelTe Industries...' },
  pt: { hero: 'Construindo o Futuro com Código', tagline: 'Desenvolvedor • Criador de IA • Arquiteto', viewProjects: 'Ver 12 Projetos', writeRun: 'Escrever & Executar', download: 'Baixar CV', search: 'Buscar AdelTe Industries...' },
  de: { hero: 'Die Zukunft mit Code bauen', tagline: 'Entwickler • KI-Ersteller • Plattform-Architekt', viewProjects: '12 Projekte ansehen', writeRun: 'Schreiben & Ausführen', download: 'Lebenslauf laden', search: 'AdelTe Industries suchen...' },
  sw: { hero: 'Kujenga Kesho kwa Code', tagline: 'Mwanzo wa Programu • Mbunifu wa AI', viewProjects: 'Vipaumbele 12', writeRun: 'Andika & Endesha', download: 'Pakua CV', search: 'Tafuta AdelTe Industries...' },
  hi: { hero: 'कोड के साथ भविष्य का निर्माण', tagline: 'डेवलपर • AI निर्माता • प्लेटफ़ॉर्म आर्किटेक्ट', viewProjects: '12 प्रोजेक्ट देखें', writeRun: 'लिखें और चलाएँ', download: 'रिज्यूमे डाउनलोड', search: 'AdelTe Industries खोजें...' }
};

const LANG_OPTIONS: Array<{ code: LangCode; name: string; flag: string }> = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

const CODE_LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'SQL', 'HTML', 'CSS'];

const CODE_LOGOS = [
  { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/javascript.svg' },
  { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/typescript.svg' },
  { name: 'Python', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg' },
  { name: 'Java', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/java.svg' },
  { name: 'C#', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/csharp.svg' },
  { name: 'Go', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/go.svg' },
  { name: 'Rust', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/rust.svg' },
  { name: 'SQL', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postgresql.svg' },
  { name: 'HTML', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/html5.svg' },
  { name: 'CSS', src: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/css3.svg' }
];

const EXTERNAL_LINKS = [
  { name: 'Kivu Luxury', href: 'http://luxury-properties-eta.vercel.app/' },
  { name: 'Visit Rwanda', href: 'https://visitrwanda-seven.vercel.app/' },
  { name: 'Projects', href: '#projects' }
];

const SPOKEN_LANGUAGES = [
  { name: 'English', flag: '🇬🇧' },
  { name: 'Kinyarwanda', flag: '🇷🇼' },
  { name: 'Français', flag: '🇫🇷' },
  { name: 'Español', flag: '🇪🇸' }
];

// Map our codes to Google Translate codes
const GTRANS_CODES: Record<LangCode, string> = {
  en: 'en', fr: 'fr', rw: 'rw', es: 'es', ar: 'ar', zh: 'zh-CN', pt: 'pt', de: 'de', sw: 'sw', hi: 'hi'
};

function setGoogleTranslateCookie(target: string) {
  const value = target === 'en' ? '' : `/en/${target}`;
  // set for current host + all variations so widget picks it up
  const expire = 'expires=' + new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toUTCString();
  document.cookie = `googtrans=${value}; path=/; ${expire}`;
  try {
    const host = window.location.hostname;
    document.cookie = `googtrans=${value}; domain=.${host}; path=/; ${expire}`;
  } catch {}
}

// Load Google Translate once
function ensureGoogleTranslate() {
  if (document.getElementById('google-translate-script')) return;
  (window as any).googleTranslateElementInit = function () {
    try {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    } catch {}
  };
  const s = document.createElement('script');
  s.id = 'google-translate-script';
  s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.body.appendChild(s);
}

function applyGoogleTranslate(code: LangCode) {
  const target = GTRANS_CODES[code];
  setGoogleTranslateCookie(target);
  // Try to drive the hidden combo if it exists, else reload to apply cookie
  const trySelect = (attempt = 0) => {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = target;
      combo.dispatchEvent(new Event('change'));
    } else if (attempt < 20) {
      setTimeout(() => trySelect(attempt + 1), 250);
    } else {
      // fallback: reload so cookie takes effect
      window.location.reload();
    }
  };
  if (target === 'en') {
    // reset to original
    window.location.reload();
  } else {
    trySelect();
  }
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (typeof localStorage !== 'undefined' && (localStorage.getItem('adelte-theme') as Theme)) || 'light');
  const [cursor, setCursor] = useState<Cursor>(() => (typeof localStorage !== 'undefined' && (localStorage.getItem('adelte-cursor') as Cursor)) || 'pointer');
  const [lang, setLangState] = useState<LangCode>(() => (typeof localStorage !== 'undefined' && (localStorage.getItem('adelte-lang') as LangCode)) || 'en');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-cursor', cursor);
    try { localStorage.setItem('adelte-theme', theme); } catch {}
    try { localStorage.setItem('adelte-cursor', cursor); } catch {}
  }, [theme, cursor]);

  useEffect(() => { ensureGoogleTranslate(); }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    try { localStorage.setItem('adelte-lang', code); } catch {}
    applyGoogleTranslate(code);
  };

  return { theme, setTheme, cursor, setCursor, lang, setLang, t: I18N[lang] };
}

// ————————————————————————————————————
// SCROLL SPY — track which section is in view
// ————————————————————————————————————
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] || '');
  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0] || '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [ids.join(',')]);
  return active;
}

// ————————————————————————————————————
// 3D TILT CARD WRAPPER
// ————————————————————————————————————
function Tilt3D({ children, className='' }:{ children: React.ReactNode; className?:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e:React.MouseEvent)=>{
    const el = ref.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left)/r.width - 0.5;
    const my = (e.clientY - r.top)/r.height - 0.5;
    el.style.transform = `rotateX(${(-my*12).toFixed(2)}deg) rotateY(${(mx*14).toFixed(2)}deg) scale(1.03)`;
  };
  const onLeave = ()=>{ const el = ref.current; if (el) el.style.transform = 'rotateX(0) rotateY(0) scale(1)'; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{perspective:'900px', transition:'transform 0.2s', transformStyle:'preserve-3d'}} className={className}>
      {children}
    </div>
  );
}

// ————————————————————————————————————
// ASSETS
// ————————————————————————————————————
const PROFILE = profileImage;

const IMG = {
  mab: 'https://images.pexels.com/photos/16027824/pexels-photo-16027824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  cmd: 'https://images.pexels.com/photos/32026177/pexels-photo-32026177.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  rw:  'https://images.pexels.com/photos/36470605/pexels-photo-36470605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  lux: 'https://images.pexels.com/photos/29679172/pexels-photo-29679172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  kb:  'https://images.pexels.com/photos/5944189/pexels-photo-5944189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  cloud:'https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  job: 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  game:'https://images.pexels.com/photos/29901199/pexels-photo-29901199.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  f1:  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  f2:  'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  f3:  'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  ai:  'https://images.pexels.com/photos/34804017/pexels-photo-34804017.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

// ————————————————————————————————————
// NAVBAR ITEMS — Each has a vector/icon (SVG), real logo URL revealed on hover
// ————————————————————————————————————
type NavItem = {
  href: string;
  name: string;
  // Pure SVG vector (always visible)
  svg: React.ReactNode;
  // Real "official" logo image that appears on hover
  logo: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: '#about', name: 'About',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
    logo: 'https://api.dicebear.com/9.x/notionists/svg?seed=Adelte&backgroundColor=c7d2fe'
  },
  {
    href: '#skills', name: 'Skills',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'
  },
  {
    href: '#projects', name: 'Projects',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'
  },
  {
    href: '#contact', name: 'Contact',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png'
  },
];

// ————————————————————————————————————
// NAVBAR — Icon-only, hover reveals real official logo + name
// ————————————————————————————————————
function ThemeCog({ theme, setTheme, cursor, setCursor, lang, setLang }:{ theme: Theme; setTheme:(t:Theme)=>void; cursor: Cursor; setCursor:(c:Cursor)=>void; lang: LangCode; setLang:(l:LangCode)=>void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'theme' | 'cursor' | 'lang'>('theme');
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 transition-all" title="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 z-50">
            <div className="flex gap-1 mb-3 rounded-full bg-slate-100 p-1 text-[10px] font-black uppercase tracking-widest">
              {(['theme', 'cursor', 'lang'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-1.5 transition ${tab === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>{t}</button>
              ))}
            </div>

            {tab === 'theme' && (
              <div className="grid grid-cols-1 gap-2">
                {THEMES.map(th => (
                  <button key={th.id} onClick={() => setTheme(th.id)} className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${theme === th.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: th.bg }}>{th.emoji}</div>
                    <div className="flex-1">
                      <div className="font-black text-xs">{th.name}</div>
                      <div className="text-[10px] text-slate-500">{th.id.toUpperCase()}</div>
                    </div>
                    {theme === th.id && <span className="text-emerald-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {tab === 'cursor' && (
              <div className="grid grid-cols-1 gap-2">
                {CURSORS.map(c => (
                  <button key={c.id} onClick={() => setCursor(c.id)} className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${cursor === c.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border flex items-center justify-center">
                      <svg viewBox="0 0 32 32" className="w-6 h-6" dangerouslySetInnerHTML={{ __html: `<path d="${c.preview}" fill="currentColor" stroke="black" stroke-width="1.4" />` }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-xs">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.id}</div>
                    </div>
                    {cursor === c.id && <span className="text-emerald-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {tab === 'lang' && (
              <div className="grid grid-cols-2 gap-2">
                {LANG_OPTIONS.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${lang === l.code ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <div className="text-lg">{l.flag}</div>
                    <div className="flex-1">
                      <div className="font-black text-xs">{l.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase">{l.code}</div>
                    </div>
                    {lang === l.code && <span className="text-emerald-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ onDownloadResume }:{ onDownloadResume:()=>void }) {
  const [hovered, setHovered] = useState<number|null>(null);
  const { theme, setTheme, cursor, setCursor, lang, setLang } = useTheme();
  const sectionIds = NAV_ITEMS.map(n => n.href.replace('#', ''));
  const activeId = useScrollSpy(sectionIds);
  return (
    <header className="fixed z-50 w-full top-0 border-b backdrop-blur-xl transition-colors" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 flex h-16 items-center justify-between gap-2">
        <a href="#top" className="flex items-center gap-3 group">
          <div>
            <div className="font-black text-xl tracking-tighter" style={{ color: 'var(--text)' }}>ADELTE</div>
            <div className="text-[9px] -mt-1 font-bold tracking-[3px]" style={{ color: 'var(--accent)' }}>DIGITAL ENGINEER</div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-2">
          {EXTERNAL_LINKS.map(link => (
            <a key={link.name} href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="rounded-full border border-slate-300 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
              {link.name}
            </a>
          ))}
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = item.href.replace('#', '') === activeId;
            return (
            <a
              key={item.name}
              href={item.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative w-11 h-11 flex items-center justify-center rounded-xl transition-all group"
              style={{ color: isActive ? '#fff' : 'var(--text-2)', background: isActive ? 'var(--accent)' : 'transparent' }}
              title={item.name}
            >
              <motion.div
                animate={{ opacity: hovered === i ? 0 : 1, scale: hovered === i ? 0.6 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute w-5 h-5"
              >
                {item.svg}
              </motion.div>

              <motion.img
                src={item.logo}
                alt={item.name}
                initial={false}
                animate={{ opacity: hovered === i ? 1 : 0, scale: hovered === i ? 1 : 0.6 }}
                transition={{ duration: 0.25 }}
                className="absolute w-6 h-6 object-contain"
              />

              {/* Active indicator dot */}
              {isActive && (
                <motion.div layoutId="navActiveDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#fff' }} />
              )}

              {/* Tooltip: shows name when hovered OR when this is the active section */}
              <AnimatePresence>
                {(hovered === i || (isActive && hovered === null)) && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap tracking-widest uppercase pointer-events-none shadow-lg flex items-center gap-1"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {isActive && hovered === null && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    {isActive && hovered === null ? `You are here: ${item.name}` : item.name}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ background: 'var(--accent)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Hidden Google Translate mount point */}
          <div id="google_translate_element" className="hidden" />
          <ThemeCog theme={theme} setTheme={setTheme} cursor={cursor} setCursor={setCursor} lang={lang} setLang={setLang} />
          <button onClick={onDownloadResume} className="text-xs font-semibold px-5 py-2 rounded-full transition" style={{ background: 'var(--accent)', color: '#fff' }}>
            <span className="hidden sm:inline">DOWNLOAD RESUME</span>
            <span className="sm:hidden">CV</span>
          </button>
        </div>
      </div>
      {/* Active section progress label (mobile + clarity) */}
      <ActiveSectionBadge activeId={activeId} />
    </header>
  );
}

function ActiveSectionBadge({ activeId }:{ activeId: string }) {
  const item = NAV_ITEMS.find(n => n.href.replace('#', '') === activeId);
  if (!item) return null;
  return (
    <div className="md:hidden px-6 pb-2 -mt-1">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        You are here: {item.name}
      </div>
    </div>
  );
}

// ————————————————————————————————————
// REUSABLE PAPER BACKGROUND
// ————————————————————————————————————
function Paper({ children, tight=false, className='' }:{ children?: React.ReactNode; tight?: boolean; className?: string }) {
  return (
    <div className={`relative ${tight?'':'px-6'} ${className}`} style={{ background: 'var(--paper-bg)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'var(--paper-bg)' }} />
        <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: `repeating-linear-gradient(to bottom, var(--paper-line) 0px, var(--paper-line) 1px, transparent 1px, transparent 28px)` }} />
        <div className="absolute left-[64px] top-0 bottom-0 w-[2px] opacity-40 hidden md:block" style={{ background: 'var(--paper-margin)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(to right, var(--paper-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--paper-grid) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Reveal({ children, delay=0, className='' }:{ children: React.ReactNode; delay?:number; className?:string }) {
  return (
    <motion.div initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: 'easeOut', delay }} className={className}>
      {children}
    </motion.div>
  );
}

// ————————————————————————————————————
// PROJECTS DATA
// ————————————————————————————————————

type P = {id:string; title:string; desc:string; img:string; tags:string[]; features:string[]; figma?:string};

const PROJECTS: P[] = [
  {id:'mab', title:'MAB AI', desc:'AI examination marking platform.', img:IMG.mab, tags:['AI','Education','Python'], features:['Automatic marking','Guide generation','Exam storage','Analytics']},
  {id:'cmd', title:'AdelTe Commander', desc:'Private desktop command center.', img:IMG.cmd, tags:['Desktop','Automation'], features:['Voice commands','Automation','Security','Keyboard shortcuts','System mgmt']},
  {id:'rw',  title:'Visit Rwanda', desc:'Tourism ecosystem platform.', img:IMG.rw, tags:['Tourism','Vue'], features:['Destinations','Hotels','Activities','Booking']},
  {id:'lux', title:'Luxury Marketplace', desc:'Real estate + social.', img:IMG.lux, tags:['Marketplace','Real Estate'], features:['Luxury villas','Social','Story sharing','Video','Investment']},
  {id:'kb',  title:'Virtual Keyboard', desc:'Custom keyboard with emoji.', img:IMG.kb, tags:['UI','JS'], features:['Dark mode','Emoji picker','Copy/Paste','Languages','Sound effects']},
  {id:'cloud',title:'Secure Cloud Storage', desc:'Google Drive-style platform.', img:IMG.cloud, tags:['Cloud','Node.js'], features:['Long-term storage','Email access','File management']},
  {id:'job', title:'Job Portal', desc:'Full hiring platform.', img:IMG.job, tags:['Portal','Dashboard'], features:['Job posting','Applications','Admin','Candidate mgmt']},
  {id:'game',title:'3D RPG', desc:'Three.js multiplayer RPG.', img:IMG.game, tags:['Three.js','Multiplayer'], features:['Missions','XP','Animations','Warehouse env']},
  {id:'f1',  title:'SOS School Page', desc:'Figma prototype.', img:IMG.f1, tags:['Figma','UI/UX'], features:['Student dashboard','Announcements','Schedule'], figma:'https://www.figma.com/proto/pDFzhFctoM66kNdNQrLwmf/sos-school-page?node-id=1-2&starting-point-node-id=1%3A2'},
  {id:'f2',  title:'Design System', desc:'Figma components.', img:IMG.f2, tags:['Figma','Design System'], features:['Components','Tokens','Variants','Auto-layout'], figma:'https://www.figma.com/proto/2mXMlWPSPHGfxX22Jhk0xq/Untitled?node-id=3-1031'},
  {id:'f3',  title:'Untitled App Concept', desc:'Modern concept.', img:IMG.f3, tags:['Figma','Concept'], features:['Onboarding','Notebook UI','Interactions'], figma:'https://www.figma.com/design/5HmgXxaIHzOtTeKc6u9vou/Untitled?node-id=0-1&p=f&t=lVUaVpzmakH6XTBY-0'},
  {id:'ai',  title:'AI Exam Marking', desc:'Advanced AI integration.', img:IMG.ai, tags:['AI','Automation'], features:['Prompt engineering','AI integration','Exam marking','Analytics']},
];

// ————————————————————————————————————
// MAIN APP
// ————————————————————————————————————
export default function App() {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<P|null>(null);

  useEffect(()=> {
    const t = setTimeout(()=>setLoading(false), 1000);
    return () => clearTimeout(t);
  },[]);

  const downloadResume = () => {
    const content = `ADELTE — Software Developer | AI Builder | Platform Architect | Digital Innovator\n\nRwanda\nEmail: mloaze778@gmail.com\nPhone: 0722635461\nGitHub: github.com/ADELTE-Boncoeur\n\nWelcome to AdelTe Industries. Building the Future Through Code.\n\nProjects: MAB AI, AdelTe Commander, Visit Rwanda, Luxury Marketplace, Virtual Keyboard, Cloud Storage, Job Portal, 3D RPG, Figma Prototypes, AI Exam Marking.`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], {type:'text/plain'}));
    a.download = 'ADELTE_Resume.txt'; a.click();
  };

  return (
    <div className="bg-[#fefcf6] text-slate-900 min-h-screen overflow-x-hidden">
      {/* LOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[200] bg-[#fefcf6] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-[12px] border-indigo-200 border-t-indigo-700 rounded-full animate-spin"/>
              <div className="font-black text-3xl tracking-tighter">ADELTE</div>
              <div className="text-indigo-600 text-sm font-mono mt-1">LOADING DIGITAL ENGINEER'S NOTEBOOK...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar onDownloadResume={downloadResume} />

      {/* HERO — extreme 3D shadows + animations */}
      <section id="top" className="min-h-[100dvh] relative flex items-center justify-center pt-20 overflow-hidden">
        <Paper>
          <div className="absolute inset-0 bg-[radial-gradient(#64748b_0.6px,transparent_1px)] bg-[length:4px_4px] opacity-[0.04]"/>
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({length:10}).map((_,i)=>(
              <motion.div key={i} className="absolute text-[11px] text-indigo-800/25 font-mono px-3 py-1 border border-indigo-200/60 bg-white/50 rounded" style={{left:`${12+i*8}%`,top:`${20+(i%3)*22}%`}} animate={{y:[0,-28,0], rotate:[i%2===0?-10:8, i%2===0?5:-9, i%2===0?-10:8]}} transition={{duration:6+i*0.7, repeat:Infinity}}>
                {i%3===0?'Welcome to AdelTe Industries':i%3===1?'function build() {}':'print("ADELTE")'}
              </motion.div>
            ))}
          </div>

          <div className="relative px-6 max-w-6xl py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="space-y-6 text-left">
                <div className="inline-block rounded-full border border-indigo-200 bg-white/70 px-5 py-1 text-xs tracking-widest font-semibold text-indigo-700">RWANDA • 2025–2026</div>
                <h1 className="hero-title text-[72px] md:text-[96px] lg:text-[110px] font-black tracking-[-5px] leading-none mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">ADELTE</h1>
                <div className="hero-subtitle text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-700">Building the Future Through Code</div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {['Software Developer','AI Builder','Platform Architect','Digital Innovator'].map(t => (
                    <div key={t} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-slate-50 text-slate-900">{t}</div>
                  ))}
                </div>

                <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-4">Core coding languages</div>
                  <div className="flex flex-wrap gap-2">
                    {CODE_LANGUAGES.map(lang => (
                      <span key={lang} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{lang}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a href="#projects" className="hero-shadow px-9 py-3.5 rounded-full font-semibold text-sm transition" style={{ background: 'var(--accent)', color: '#fff' }}>VIEW 12 PROJECTS</a>
                  <a href="#contact" className="px-9 py-3.5 rounded-full border-2 font-semibold text-sm transition" style={{ borderColor: 'var(--text)', color: 'var(--text)' }}>LET'S TALK</a>
                  <button onClick={downloadResume} className="px-9 py-3.5 rounded-full border font-semibold text-sm transition" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>DOWNLOAD RESUME</button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {SPOKEN_LANGUAGES.map(item => (
                    <div key={item.name} className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 shadow-2xl">
                <img src={PROFILE} alt="AdelTe" className="object-cover w-full h-full min-h-[480px]" />
              </div>
            </div>

            <div className="logo-marquee mt-12 rounded-[3rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-sm overflow-hidden">
              <div className="logo-marquee-track flex items-center gap-6">
                {CODE_LOGOS.concat(CODE_LOGOS).map((logo, index) => (
                  <div key={`${logo.name}-${index}`} className="flex min-w-[200px] items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                    <img src={logo.src} alt={logo.name} className="h-10 w-10" />
                    <span className="text-sm font-semibold text-slate-700">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Paper>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-[1200px] mx-auto px-6 py-24 grid lg:grid-cols-[420px,1fr] gap-16 items-center">
        <Reveal>
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-indigo-600 mb-4">About Me</div>
            <h2 className="text-5xl font-black tracking-tight mb-6">A focused engineer with product-first thinking.</h2>
            <p className="text-lg leading-9 text-slate-700 mb-6">I create intelligent software, AI experiences, and scalable platforms for education, marketplaces, tourism, and automation. My work blends strong UX, efficient engineering, and pragmatic design.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Location', 'Rwanda'],
                ['Email', 'mloaze778@gmail.com'],
                ['Phone', '0722635461'],
                ['GitHub', 'ADELTE-Boncoeur'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</div>
                  <div className="mt-2 font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-4">Spoken languages</div>
              <div className="flex flex-wrap gap-3">
                {SPOKEN_LANGUAGES.map(item => (
                  <div key={item.name} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="skills" className="py-20 bg-gradient-to-b from-white to-indigo-50 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-[0.35em] text-indigo-600 mb-3">Core strengths</div>
            <h2 className="text-5xl font-black tracking-tight">Capabilities that move ideas forward</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Frontend', skills: ['React', 'Tailwind', 'Responsive UI', 'Motion'] },
              { title: 'Backend', skills: ['Node.js', 'APIs', 'Database design', 'Cloud'] },
              { title: 'AI & Automation', skills: ['AI integration', 'Smart workflows', 'Exam marking', 'Data pipelines'] },
              { title: 'Design', skills: ['UI systems', 'Interaction', 'Product strategy', 'Prototype'] },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <Paper className="p-8 rounded-[2rem] border border-slate-200 shadow-lg">
                  <div className="text-indigo-700 font-black text-3xl mb-5">{item.title}</div>
                  <ul className="space-y-3 text-slate-600">
                    {item.skills.map(skill => (
                      <li key={skill} className="flex items-center gap-3 text-sm">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">✓</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Paper>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 py-20 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-sm uppercase tracking-[0.35em] text-indigo-600 mb-3">Selected projects</div>
              <h2 className="font-black text-6xl tracking-[-2.8px]">Design-led product work</h2>
            </div>
            <p className="max-w-xl text-slate-500">A modern portfolio of platforms, AI systems, and product experiences with polished visuals, clear outcomes, and strong technical execution.</p>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3" style={{perspective:'1200px'}}>
            {PROJECTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.03}>
                <Tilt3D className="transition">
                  <div onClick={() => setModal(p)} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl cursor-pointer transition hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full aspect-[16/10] object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
                        {p.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="font-black text-2xl mb-2">{p.title}</div>
                      <p className="text-sm text-slate-600 leading-7 mb-5">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-6">{p.features.slice(0, 3).map(feature => <span key={feature}>• {feature}</span>)}</div>
                      <div className="flex gap-3 flex-wrap">
                        <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">View details</button>
                        {p.figma && (
                          <a href={p.figma} target="_blank" onClick={e => e.stopPropagation()} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Open Figma</a>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-900 py-24 px-6 text-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-indigo-300 mb-4">Say hello</div>
            <h2 className="text-5xl font-black tracking-tight mb-6">Let's build your next product.</h2>
            <p className="max-w-xl text-slate-300 text-lg leading-8">If you want elegant interfaces, smart automation, or a platform with real business impact, I deliver thoughtful design and strong engineering.</p>
          </div>
          <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            {[['Email', 'mloaze778@gmail.com', 'mailto:mloaze778@gmail.com'], ['Phone', '0722635461', 'tel:0722635461'], ['GitHub', 'ADELTE-Boncoeur', 'https://github.com/ADELTE-Boncoeur']].map(([label, value, href]) => (
              <a key={label} href={href} target="_blank" className="block rounded-3xl border border-white/10 px-5 py-4 transition hover:bg-white/10">
                <div className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</div>
                <div className="mt-2 text-lg font-semibold text-white">{value}</div>
              </a>
            ))}
            <button onClick={downloadResume} className="w-full rounded-full bg-indigo-600 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-indigo-500">Download resume</button>
          </div>
        </div>
      </section>

      <footer className="text-xs text-center py-8 bg-[#fefcf6] border-t text-slate-500">ADELTE INDUSTRIES — Rwanda • All projects built with real paper, code and passion. © 2026</footer>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center p-4" onClick={()=>setModal(null)}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.96,opacity:0}} onClick={e=>e.stopPropagation()} className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
              <img src={modal.img} className="w-full" alt=""/>
              <div className="p-8">
                <div className="font-black text-4xl tracking-tighter mb-1">{modal.title}</div>
                <div className="text-slate-600 mb-6">{modal.desc}</div>
                <div className="mb-6">
                  <div className="font-semibold mb-2">Key features</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">{modal.features.map(feature => <li key={feature}>• {feature}</li>)}</ul>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button onClick={()=>setModal(null)} className="rounded-full border border-slate-300 py-3 text-sm font-semibold">Close</button>
                  {modal.figma && <a href={modal.figma} target="_blank" className="rounded-full bg-indigo-600 py-3 text-center text-sm font-semibold text-white">Open Figma</a>}
                  <a href="#contact" onClick={()=>setModal(null)} className="rounded-full bg-slate-900 py-3 text-center text-sm font-semibold text-white">Contact me</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

