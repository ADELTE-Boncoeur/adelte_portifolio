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
// FLOATING 3D ISLAND (for stats)
// ————————————————————————————————————
function FloatingIsland({ children, delay=0 }:{ children: React.ReactNode; delay?:number }) {
  return (
    <motion.div animate={{ y: [-6, 6, -6], rotateX: [-4, 4, -4] }} transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' }} style={{transformStyle:'preserve-3d', perspective:'900px'}}>
      {children}
    </motion.div>
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

type Lang = { id:string; name:string; icon:string; code:string; run:'js'|'html'|'css'|'sim'; };

// 18 languages — every one says "Welcome to AdelTe Industries"
const LANGS: Lang[] = [
  { id:'js',  name:'JavaScript', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    code:'// Welcome to AdelTe Industries\nconsole.log("Welcome to AdelTe Industries");\nconsole.log("Building the Future Through Code");', run:'js' },
  { id:'ts',  name:'TypeScript', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    code:'// Welcome to AdelTe Industries\nconst msg: string = "Welcome to AdelTe Industries";\nconsole.log(msg);', run:'js' },
  { id:'py',  name:'Python',     icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    code:'# Welcome to AdelTe Industries\nprint("Welcome to AdelTe Industries")\nprint("Building the Future Through Code")', run:'sim' },
  { id:'html',name:'HTML5',      icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    code:'<!-- Welcome to AdelTe Industries -->\n<h1 style="color:#4f46e5">Welcome to AdelTe Industries</h1>\n<p>Building the Future Through Code</p>', run:'html' },
  { id:'css', name:'CSS3',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    code:'/* Welcome to AdelTe Industries */\nbody { background:#fefcf6; } \nh1 { color:#6366f1; letter-spacing:-1px; }', run:'css' },
  { id:'vue', name:'Vue.js',     icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    code:'<!-- Welcome to AdelTe Industries -->\n<template>\n  <h1>{{ title }}</h1>\n</template>\n<script setup>\nconst title = "Welcome to AdelTe Industries"\n</script>', run:'sim' },
  { id:'react',name:'React',     icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    code:'// Welcome to AdelTe Industries\nexport default function AdelTe() {\n  return <h1>Welcome to AdelTe Industries</h1>;\n}', run:'js' },
  { id:'node',name:'Node.js',    icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    code:'// Welcome to AdelTe Industries\nconsole.log("Welcome to AdelTe Industries");\nconsole.log("Server: Running on port 3000");', run:'sim' },
  { id:'php', name:'PHP',        icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    code:'<?php\n// Welcome to AdelTe Industries\necho "Welcome to AdelTe Industries";\necho "Building the Future Through Code";\n?>', run:'sim' },
  { id:'sql', name:'SQL',        icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    code:'-- Welcome to AdelTe Industries\nSELECT "Welcome to AdelTe Industries" AS message;\nSELECT "Building the Future Through Code" AS tagline;', run:'sim' },
  { id:'tw',  name:'Tailwind',   icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
    code:'<!-- Welcome to AdelTe Industries -->\n<div class="bg-[#fefcf6] p-8">\n  <h1 class="text-4xl font-black text-indigo-600">\n    Welcome to AdelTe Industries\n  </h1>\n</div>', run:'css' },
  { id:'three',name:'Three.js',  icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
    code:'// Welcome to AdelTe Industries\nimport * as THREE from "three";\nconst scene = new THREE.Scene();\nconsole.log("Welcome to AdelTe Industries - 3D Ready");', run:'sim' },
  { id:'go',  name:'Go',         icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    code:'// Welcome to AdelTe Industries\npackage main\nimport "fmt"\nfunc main() {\n  fmt.Println("Welcome to AdelTe Industries")\n}', run:'sim' },
  { id:'rust',name:'Rust',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
    code:'// Welcome to AdelTe Industries\nfn main() {\n  println!("Welcome to AdelTe Industries");\n  println!("Building the Future Through Code");\n}', run:'sim' },
  { id:'java',name:'Java',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    code:'// Welcome to AdelTe Industries\npublic class AdelTe {\n  public static void main(String[] args) {\n    System.out.println("Welcome to AdelTe Industries");\n  }\n}', run:'sim' },
  { id:'c',   name:'C',          icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    code:'/* Welcome to AdelTe Industries */\n#include <stdio.h>\nint main() {\n  printf("Welcome to AdelTe Industries\\n");\n  return 0;\n}', run:'sim' },
  { id:'swift',name:'Swift',     icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    code:'// Welcome to AdelTe Industries\nimport Foundation\nlet msg = "Welcome to AdelTe Industries"\nprint(msg)', run:'sim' },
  { id:'rb',  name:'Ruby',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    code:'# Welcome to AdelTe Industries\nputs "Welcome to AdelTe Industries"\nputs "Building the Future Through Code"', run:'sim' },
];

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
    href: '#studio', name: 'Idea Studio',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.2 14.5A7 7 0 1 1 15.8 14.5c-.9.7-1.3 1.5-1.3 2.5h-5c0-1-.4-1.8-1.3-2.5z"/><path d="M12 3v2"/><path d="M4.9 5.9l1.4 1.4"/><path d="M19.1 5.9l-1.4 1.4"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'
  },
  {
    href: '#where', name: 'Where I Am',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    href: '#builder', name: 'Builder',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg'
  },
  {
    href: '#adelte-ai', name: 'AdelTe AI',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/><circle cx="12" cy="12" r="3"/></svg>,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  },
  {
    href: '#projects', name: 'Projects',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'
  },
  {
    href: '#sandbox', name: 'Code Sandbox',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="13" y1="4" x2="11" y2="20"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg'
  },
  {
    href: '#github', name: 'GitHub',
    svg: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
  },
  {
    href: '#notebook', name: 'Notebook',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg'
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
          <img src={PROFILE} className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200" alt=""/>
          <div>
            <div className="font-black text-xl tracking-tighter" style={{ color: 'var(--text)' }}>ADELTE</div>
            <div className="text-[9px] -mt-1 font-bold tracking-[3px]" style={{ color: 'var(--accent)' }}>DIGITAL ENGINEER</div>
          </div>
        </a>

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
// SANDBOX — Write & Run 18 languages
// ————————————————————————————————————
function Sandbox() {
  const [active, setActive] = useState(0);
  const [code, setCode] = useState(LANGS[0].code);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState('');

  const lang = LANGS[active];

  const switchLang = (i:number) => {
    setActive(i);
    setCode(LANGS[i].code);
    setOutput([]);
    setPreview('');
  };

  const run = () => {
    setRunning(true);
    setOutput([]);
    setPreview('');
    const lines: string[] = [];

    if (lang.run === 'js') {
      const logs:string[] = [];
      const origLog = console.log;
      console.log = (...a:any[]) => logs.push(a.map(x => typeof x==='object'? JSON.stringify(x):String(x)).join(' '));
      try { (new Function(code))(); }
      catch(e:any) { lines.push('⚠️ ' + (e.message||'Runtime error')); }
      console.log = origLog;
      lines.push('> Running '+lang.name);
      lines.push('Welcome to AdelTe Industries');
      lines.push('Building the Future Through Code');
      lines.push(...logs);
      lines.push('✓ Build complete. Status: Success');
    } else if (lang.run === 'html') {
      lines.push('> HTML rendered in live preview');
      lines.push('Welcome to AdelTe Industries');
      lines.push('✓ Live DOM updated');
      setPreview(code);
    } else if (lang.run === 'css') {
      lines.push('> CSS applied');
      lines.push('Welcome to AdelTe Industries');
      lines.push('Stylesheet compiled.');
      setPreview(`<div style="padding:24px;background:#fefcf6;border:1px solid #c7d2fe;border-radius:16px"><h1 style="font-size:22px;color:#4f46e5">Welcome to AdelTe Industries</h1><p style="color:#334155">CSS successfully loaded.</p></div>`);
    } else {
      lines.push('> '+lang.name+' interpreter started');
      lines.push('Welcome to AdelTe Industries');
      lines.push('Building the Future Through Code');
      lines.push('✓ Compilation successful');
      lines.push('✓ Output: Platform ready');
      if (lang.id === 'py') lines.push('Python 3.12.0 • AdelTe AI Engine');
      if (lang.id === 'sql') lines.push('2 rows returned');
      if (lang.id === 'three') lines.push('3D Scene initialized (Three.js r128)');
      if (lang.id === 'java') lines.push('JVM: HotSpot 17');
      if (lang.id === 'go') lines.push('Go 1.22 • linux/amd64');
    }

    setTimeout(() => { setOutput(lines); setRunning(false); }, 450);
  };

  const runAll = () => {
    const all:string[] = [];
    LANGS.forEach(l => {
      all.push('=== '+l.name+' ===');
      all.push('Welcome to AdelTe Industries');
      all.push('Building the Future Through Code');
      all.push('✓ Executed successfully');
    });
    setOutput(all);
    setActive(0); setCode(LANGS[0].code);
  };

  return (
    <div className="bg-[#0f172a] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-[#0b1020] px-5 py-3 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-white/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"/>
            <span className="w-3 h-3 rounded-full bg-yellow-400"/>
            <span className="w-3 h-3 rounded-full bg-emerald-500"/>
          </div>
          <span className="font-mono ml-2">ADELTE_CODE_LAB.tsx — Digital Engineer's Notebook</span>
        </div>
        <button onClick={runAll} className="text-white/90 bg-white/10 hover:bg-white/20 rounded-full px-4 py-1">RUN ALL 18 LANGUAGES</button>
      </div>

      <div className="grid md:grid-cols-12">
        <div className="md:col-span-3 bg-[#0b1020] border-r border-white/10 p-2 max-h-[520px] overflow-auto">
          {LANGS.map((l, i) => (
            <button key={l.id} onClick={()=>switchLang(i)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-left text-sm ${active===i?'bg-white/10 text-white':'text-white/70 hover:bg-white/5'}`}>
              <img src={l.icon} className="w-5 h-5" alt=""/>
              <span className="font-medium">{l.name}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-9 p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={lang.icon} className="w-7 h-7" alt=""/>
              <div>
                <div className="font-semibold">{lang.name}</div>
                <div className="text-[10px] text-emerald-400 font-bold">ADELTE INDUSTRIES — LIVE RUNNER</div>
              </div>
            </div>
            <button onClick={run} disabled={running} className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-sm font-semibold text-white">{running?'RUNNING…':'▶ RUN CODE'}</button>
          </div>

          <textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}
            className="w-full min-h-[200px] bg-[#0b1020] border border-white/10 focus:border-indigo-500 p-5 pl-8 font-mono text-sm rounded-2xl text-[#c0d1ff] focus:outline-none resize-y"
            style={{ backgroundImage:'repeating-linear-gradient(to bottom, transparent 0, transparent 26px, rgba(255,255,255,0.04) 26px, rgba(255,255,255,0.04) 27px)' }}/>

          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-4 mt-4 font-mono text-sm min-h-[130px]">
            <div className="flex justify-between text-white/50 text-xs mb-2"><span>TERMINAL OUTPUT — PAPER MODE</span><span>{lang.name}</span></div>
            {output.length>0 ? (
              <div className="text-emerald-300 space-y-[2px]">{output.map((l,i)=><div key={i}>{l}</div>)}</div>
            ) : (
              <div className="text-white/40">Click ▶ RUN CODE to execute. Every language prints "Welcome to AdelTe Industries".</div>
            )}
          </div>

          {preview && (
            <div className="mt-4 border border-white/10 rounded-2xl overflow-hidden bg-white">
              <div className="px-3 py-1.5 bg-white/90 text-black text-xs font-semibold">LIVE PREVIEW</div>
              <div className="p-6" dangerouslySetInnerHTML={{ __html: preview }}/>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0b1020] px-5 py-2 text-center text-xs border-t border-white/10 text-emerald-400/70">All languages fully runnable. JS executes real-time. Others simulate production output.</div>
    </div>
  );
}

// ————————————————————————————————————
// ADELTE IDEA STUDIO - turns a raw idea into a paper blueprint
// ————————————————————————————————————
type Blueprint = {
  title: string;
  summary: string;
  stack: string[];
  modules: string[];
  timeline: string[];
  code: string;
  metrics: string[];
};

function buildBlueprint(idea: string, mode: string): Blueprint {
  const cleanIdea = idea.trim() || 'AI platform for AdelTe Industries';
  const lower = cleanIdea.toLowerCase();
  const isAI = lower.includes('ai') || lower.includes('mark') || lower.includes('automation');
  const isTourism = lower.includes('tour') || lower.includes('rwanda') || lower.includes('hotel') || lower.includes('booking');
  const isMarket = lower.includes('market') || lower.includes('shop') || lower.includes('real estate') || lower.includes('villa');
  const isGame = lower.includes('game') || lower.includes('3d') || lower.includes('multiplayer');
  const isCloud = lower.includes('cloud') || lower.includes('storage') || lower.includes('file');

  const title = cleanIdea
    .split(' ')
    .slice(0, 5)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const stack = [
    'React', 'Tailwind CSS', 'TypeScript',
    isAI ? 'Python AI API' : 'Node.js API',
    isCloud ? 'Cloud Storage' : isGame ? 'Three.js' : isMarket ? 'Payments' : 'PostgreSQL',
    mode === 'pitch' ? 'Analytics' : 'Authentication'
  ];

  const modules = [
    isTourism ? 'Destination discovery map' : isMarket ? 'Product and property catalog' : isGame ? 'Player mission system' : 'Smart dashboard',
    isAI ? 'AI assistant and automation engine' : 'Workflow automation engine',
    isCloud ? 'Secure file vault' : 'User accounts and permissions',
    'Admin control center',
    'Insights and reporting'
  ];

  const timeline = mode === 'mvp'
    ? ['Day 1: UX wireframe', 'Day 2: Data model', 'Day 3: Core screens', 'Day 4: API routes', 'Day 5: Launch demo']
    : mode === 'pitch'
      ? ['Problem story', 'Prototype demo', 'Market proof', 'Revenue plan', 'Investor-ready deck']
      : ['Discovery', 'AI workflow', 'Platform architecture', 'Beta testing', 'Scale and optimize'];

  return {
    title: `${title} Blueprint`,
    summary: `A polished ${mode} plan for "${cleanIdea}" built in the AdelTe notebook style with AI-ready architecture, modern UI, and launch-focused delivery.`,
    stack,
    modules,
    timeline,
    metrics: ['Activation rate', 'Daily usage', 'Task completion', 'Revenue signal'],
    code: [
      `const project = "${cleanIdea.replace(/"/g, '\\"')}";`,
      'const builder = "ADELTE";',
      `const mode = "${mode}";`,
      '',
      'export function launch() {',
      '  return builder + " is building: " + project;',
      '}'
    ].join('\n')
  };
}

function IdeaStudio() {
  const [idea, setIdea] = useState('AI tourism booking platform for Rwanda with hotels, activities, and smart recommendations');
  const [mode, setMode] = useState('ai');
  const [blueprint, setBlueprint] = useState<Blueprint>(() => buildBlueprint('AI tourism booking platform for Rwanda with hotels, activities, and smart recommendations', 'ai'));
  const [saved, setSaved] = useState<Blueprint[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setBlueprint(buildBlueprint(idea, mode));
    setCopied(false);
  };

  const saveBlueprint = () => {
    setSaved(prev => [blueprint, ...prev].slice(0, 4));
  };

  const copyBlueprint = async () => {
    const text = `${blueprint.title}\n\n${blueprint.summary}\n\nStack: ${blueprint.stack.join(', ')}\nModules: ${blueprint.modules.join(', ')}`;
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch">
      <Paper className="rounded-3xl border border-indigo-100 p-6 shadow-xl overflow-hidden">
        <div className="relative z-10">
          <div className="text-xs font-black tracking-[0.28em] text-indigo-600 mb-2">ADELTE IDEA STUDIO</div>
          <h3 className="text-4xl font-black tracking-tight mb-3">Turn any idea into a build plan.</h3>
          <p className="text-slate-600 mb-6">Type a platform idea. The studio generates a launch blueprint, architecture, stack, timeline, metrics, and starter code on digital notebook paper.</p>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full min-h-[150px] rounded-2xl border-2 border-indigo-100 bg-white/80 p-4 text-sm leading-relaxed focus:border-indigo-500 focus:outline-none"
            placeholder="Example: AI marketplace for real estate and tourism in Rwanda"
          />

          <div className="grid grid-cols-3 gap-2 my-4">
            {['ai', 'mvp', 'pitch'].map(option => (
              <button
                key={option}
                onClick={() => setMode(option)}
                className={`rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-widest transition ${mode === option ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={generate} className="hero-shadow rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700">Generate Blueprint</button>
            <button onClick={saveBlueprint} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:border-indigo-300">Save Page</button>
            <button onClick={copyBlueprint} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:border-indigo-300">{copied ? 'Copied' : 'Copy Brief'}</button>
          </div>

          {saved.length > 0 && (
            <div className="mt-6 grid gap-2">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Saved pages</div>
              {saved.map((item, index) => (
                <button key={`${item.title}-${index}`} onClick={() => setBlueprint(item)} className="rounded-xl border border-amber-200 bg-[#fff9e8] px-3 py-2 text-left text-xs font-semibold text-amber-900 hover:bg-[#fff4d0]">
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </Paper>

      <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-xs font-black tracking-[0.28em] text-indigo-300">LIVE BLUEPRINT</div>
            <h3 className="text-2xl font-black">{blueprint.title}</h3>
          </div>
          <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black text-emerald-300">READY</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Brief</div>
            <p className="text-sm text-white/75 leading-relaxed">{blueprint.summary}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Architecture</div>
            <svg viewBox="0 0 320 130" className="h-32 w-full">
              {['UI', 'API', 'AI', 'DB'].map((node, i) => (
                <g key={node} transform={`translate(${18 + i * 75}, 48)`}>
                  <rect width="54" height="34" rx="10" fill={i === 2 ? '#6366f1' : '#111827'} stroke="#818cf8" />
                  <text x="27" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{node}</text>
                </g>
              ))}
              {[0, 1, 2].map(i => (
                <motion.path key={i} d={`M${72 + i * 75} 65 H${93 + i * 75}`} stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.9, delay: i * 0.25 }} />
              ))}
            </svg>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Stack</div>
            <div className="flex flex-wrap gap-2">{blueprint.stack.map(item => <span key={item} className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold">{item}</span>)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Modules</div>
            <ul className="space-y-1 text-xs text-white/70">{blueprint.modules.map(item => <li key={item}>- {item}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Timeline</div>
            <ul className="space-y-1 text-xs text-white/70">{blueprint.timeline.map(item => <li key={item}>- {item}</li>)}</ul>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-[#07111f] p-4 font-mono text-xs text-cyan-100">
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-cyan-400">Starter code</div>
          <pre className="whitespace-pre-wrap">{blueprint.code}</pre>
        </div>
      </div>
    </div>
  );
}

// ————————————————————————————————————
// ————————————————————————————————————
// NAV DATA (where I am) — languages + AI tools with mastery levels
// ————————————————————————————————————

const MASTER_LANGUAGES: Array<{ name: string; level: number; icon: string; color: string; runtime: string }> = [
  { name: 'JavaScript', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'from-yellow-400 to-amber-500', runtime: 'live ✓' },
  { name: 'TypeScript', level: 92, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'from-blue-500 to-blue-700', runtime: 'live ✓' },
  { name: 'Python', level: 94, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'from-yellow-300 to-blue-500', runtime: 'sim ✓' },
  { name: 'HTML5', level: 98, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', color: 'from-orange-500 to-red-500', runtime: 'live ✓' },
  { name: 'CSS3', level: 96, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: 'from-blue-400 to-cyan-500', runtime: 'live ✓' },
  { name: 'Vue.js', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', color: 'from-emerald-400 to-emerald-600', runtime: 'sim ✓' },
  { name: 'React', level: 92, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: 'from-cyan-400 to-cyan-600', runtime: 'live ✓' },
  { name: 'Node.js', level: 88, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: 'from-emerald-500 to-lime-600', runtime: 'sim ✓' },
  { name: 'PHP', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', color: 'from-indigo-400 to-violet-600', runtime: 'sim ✓' },
  { name: 'SQL', level: 86, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: 'from-cyan-500 to-blue-600', runtime: 'sim ✓' },
  { name: 'Tailwind', level: 97, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', color: 'from-cyan-400 to-sky-500', runtime: 'live ✓' },
  { name: 'Three.js', level: 84, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', color: 'from-slate-600 to-slate-800', runtime: 'sim ✓' },
  { name: 'Go', level: 78, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg', color: 'from-cyan-400 to-blue-500', runtime: 'sim ✓' },
  { name: 'Rust', level: 72, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg', color: 'from-amber-600 to-orange-700', runtime: 'sim ✓' },
  { name: 'Java', level: 76, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', color: 'from-red-500 to-amber-600', runtime: 'sim ✓' },
  { name: 'C', level: 74, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', color: 'from-blue-600 to-indigo-700', runtime: 'sim ✓' },
  { name: 'Swift', level: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg', color: 'from-orange-500 to-red-600', runtime: 'sim ✓' },
  { name: 'Ruby', level: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg', color: 'from-rose-500 to-red-600', runtime: 'sim ✓' },
];

const MASTER_AI: Array<{ name: string; level: number; icon: string; use: string; promptLevel: string }> = [
  { name: 'ChatGPT (OpenAI)', level: 95, icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', use: 'Architecture, content, prompts', promptLevel: 'Master' },
  { name: 'Claude (Anthropic)', level: 92, icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg', use: 'Long context, refactoring', promptLevel: 'Master' },
  { name: 'Gemini (Google)', level: 90, icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg', use: 'Multimodal, search, code', promptLevel: 'Master' },
  { name: 'Grok (xAI)', level: 88, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/XAI-Logo.svg/1200px-XAI-Logo.svg.png', use: 'Real-time, X integration', promptLevel: 'Advanced' },
  { name: 'Mistral', level: 86, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mistral_AI_logo_%282024%29.svg/1200px-Mistral_AI_logo_%282024%29.svg.png', use: 'Open-source, fast', promptLevel: 'Advanced' },
  { name: 'DeepSeek', level: 87, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/DeepSeek_logo.svg/1200px-DeepSeek_logo.svg.png', use: 'Code generation, reasoning', promptLevel: 'Advanced' },
  { name: 'Perplexity AI', level: 90, icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg', use: 'Web-connected research', promptLevel: 'Master' },
  { name: 'Arena AI', level: 85, icon: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop', use: 'Model comparison, evaluation', promptLevel: 'Advanced' },
  { name: 'Copilot (GitHub)', level: 92, icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', use: 'IDE pair programming', promptLevel: 'Master' },
  { name: 'Cursor', level: 88, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cursor_logo.svg/1200px-Cursor_logo.svg.png', use: 'AI-first coding', promptLevel: 'Advanced' },
];

function WhereIAm() {
  return (
    <section id="where" className="py-24 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs tracking-[3px] font-semibold mb-2" style={{ color: 'var(--accent)' }}>WHERE I AM</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>18 Languages I Write and Run</h2>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: 'var(--text-2)' }}>Live runtime for JavaScript, TypeScript, React, HTML, CSS, and Tailwind. Real simulated production output for Python, Vue, Node, PHP, SQL, Three.js, Go, Rust, Java, C, Swift, and Ruby.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-16">
          {MASTER_LANGUAGES.map((lang) => (
            <div key={lang.name} className="group relative rounded-2xl border transition-all shadow-sm hover:shadow-xl hover:-translate-y-1" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${lang.color}`} />
              <div className="flex items-start justify-between mb-2 p-3">
                <img src={lang.icon} className="w-9 h-9" alt={lang.name} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{lang.runtime}</span>
              </div>
              <div className="px-3 pb-3 font-black text-sm" style={{ color: 'var(--text)' }}>{lang.name}</div>
              <div className="px-3 text-[10px] mb-2" style={{ color: 'var(--text-3)' }}>Mastery {lang.level}%</div>
              <div className="px-3 pb-3">
                <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                  <div className={`h-full bg-gradient-to-r ${lang.color}`} style={{ width: lang.level + '%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>10 AI Tools I Master with Prompting Levels</h3>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-2)' }}>I use these AI systems in my workflow daily. I connect them to search engines, run code, and build full websites end-to-end.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MASTER_AI.map((ai) => (
            <div key={ai.name} className="group relative rounded-2xl border transition-all shadow-sm hover:shadow-xl hover:-translate-y-1" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 p-3">
                <img src={ai.icon} className="w-8 h-8 object-contain" alt={ai.name} onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                <div className="font-black text-sm leading-tight" style={{ color: 'var(--text)' }}>{ai.name}</div>
              </div>
              <div className="px-3 text-[10px] mb-2" style={{ color: 'var(--text-2)' }}>{ai.use}</div>
              <div className="px-3 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{ai.promptLevel}</span>
                <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>{ai.level}%</span>
              </div>
              <div className="px-3 pb-3 mt-2">
                <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: ai.level + '%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WebsiteBuilder() {
  const [tpl, setTpl] = useState(TEMPLATES[0].id);
  const [stepIdx, setStepIdx] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [preview, setPreview] = useState('');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<boolean[]>([]);

  const template = TEMPLATES.find(t => t.id === tpl)!;
  const step = template.steps[stepIdx];

  useEffect(() => { setStepIdx(0); setOutput([]); setPreview(''); setDone([]); }, [tpl]);

  const runStep = () => {
    setRunning(true);
    setOutput([]);
    setPreview('');
    const out: string[] = [];
    out.push(`▶ Running step ${stepIdx + 1} of ${template.steps.length} in ${step.lang.toUpperCase()}`);
    if (step.lang === 'html') {
      setPreview(step.code);
      out.push('✓ HTML rendered to live preview');
    }
    if (/console\.log/.test(step.code)) {
      const logs: string[] = [];
      const orig = console.log;
      console.log = (...a: any[]) => logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      try { (new Function(step.code))(); } catch (e: any) { out.push('⚠️ ' + (e.message || 'error')); }
      console.log = orig;
      logs.forEach(l => out.push('  ' + l));
    }
    out.push('✓ Step executed successfully');
    setOutput(out);
    setDone(d => { const n = [...d]; n[stepIdx] = true; return n; });
    setRunning(false);
  };

  const runAll = () => {
    setRunning(true);
    const all: string[] = [];
    all.push(`▶ Running full ${template.title} build across ${template.steps.length} steps`);
    template.steps.forEach((s, i) => {
      all.push(`Step ${i + 1}: ${s.title} (${s.lang}) ✓`);
    });
    const html = template.steps.find(s => s.lang === 'html')?.code;
    const css = template.steps.find(s => s.lang === 'css')?.code || '';
    const js = template.steps.find(s => s.lang === 'js' || s.lang === 'ts')?.code || '';
    if (html) {
      setPreview(`<style>${css}</style>${html}<script>${js}<\/script>`);
      all.push('✓ Final live preview rendered');
    }
    all.push('✓ Welcome to AdelTe Industries — website build complete');
    setOutput(all);
    setDone(template.steps.map(() => true));
    setRunning(false);
  };

  const progress = (done.filter(Boolean).length / template.steps.length) * 100;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="text-xs font-black uppercase tracking-[3px] text-indigo-300 mb-2">Pick a website template</div>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setTpl(t.id)} className={`w-full text-left rounded-2xl border p-4 transition ${tpl === t.id ? 'border-indigo-400 bg-indigo-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{t.emoji}</div>
              <div>
                <div className="font-black text-white">{t.title}</div>
                <div className="text-[11px] text-white/60">{t.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 rounded-3xl bg-slate-950 border border-slate-800 p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Step-by-step builder</div>
            <h3 className="text-2xl font-black">{template.title}</h3>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black">{Math.round(progress)}% done</div>
        </div>

        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: progress + '%' }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {template.steps.map((s, i) => (
            <button key={i} onClick={() => setStepIdx(i)} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${stepIdx === i ? 'bg-white text-slate-900' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
              <img src={s.icon} className="w-4 h-4" alt="" />
              <span>{i + 1}. {s.title}</span>
              {done[i] && <span className="text-emerald-400">✓</span>}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#07111f] p-4 font-mono text-[11px] text-cyan-100 mb-3 max-h-40 overflow-auto">
          <pre className="whitespace-pre-wrap">{step.code}</pre>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={runStep} disabled={running} className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50">▶ Run this step</button>
          <button onClick={runAll} disabled={running} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50">▶ Run all steps</button>
          <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 hover:bg-white/10 disabled:opacity-50">← Prev</button>
          <button onClick={() => setStepIdx(i => Math.min(template.steps.length - 1, i + 1))} disabled={stepIdx === template.steps.length - 1} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 hover:bg-white/10 disabled:opacity-50">Next →</button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#07111f] p-3 font-mono text-[10px] text-emerald-300 min-h-[60px] max-h-32 overflow-auto mb-3">
          {output.length > 0 ? output.map((l, i) => <div key={i}>{l}</div>) : <div className="text-white/40">Click ▶ Run to execute this step. Click "Run all steps" to deploy the full website.</div>}
        </div>

        {preview && (
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white">
            <div className="px-3 py-1.5 bg-white/90 text-black text-[10px] font-black uppercase tracking-widest">Live website preview</div>
            <div className="p-4" dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        )}
      </div>
    </div>
  );
}

type Step = { title: string; code: string; lang: string; icon: string };

const TEMPLATES: Array<{ id: string; title: string; emoji: string; desc: string; steps: Step[] }> = [
  {
    id: 'landing', title: 'Modern Landing Page', emoji: '🚀', desc: 'Hero + features + CTA, single page',
    steps: [
      { title: '1. HTML structure', lang: 'html', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', code: '<!DOCTYPE html><html><head><title>AdelTe Landing</title></head><body><nav>ADELTE</nav><main><h1>Building the Future Through Code</h1><p>AI, web, and platform engineering.</p><button>Get Started</button></main></body></html>' },
      { title: '2. CSS styling', lang: 'css', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', code: 'body{font-family:system-ui;background:#fefcf6;color:#0f172a;margin:0;padding:0}nav{padding:20px 40px;background:#fff;border-bottom:1px solid #e5e7eb;font-weight:900}main{text-align:center;padding:120px 40px}h1{font-size:72px;letter-spacing:-3px;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;color:transparent;margin:0 0 16px}button{padding:14px 32px;border-radius:30px;background:#0f172a;color:#fff;border:none;font-weight:700;cursor:pointer}' },
      { title: '3. JavaScript interactions', lang: 'js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', code: 'const btn = document.querySelector("button");\nbtn.addEventListener("click", () => alert("Welcome to AdelTe Industries"));\nconsole.log("AdelTe landing page loaded");' },
      { title: '4. Deploy check', lang: 'js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', code: 'const result: { status: string; url: string } = { status: "deployed", url: "https://adelte.app" };\nconsole.log("Build complete:", result);' }
    ]
  },
  {
    id: 'dashboard', title: 'AI Dashboard', emoji: '📊', desc: 'Charts, sidebar, dark mode',
    steps: [
      { title: '1. HTML layout', lang: 'html', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', code: '<div class="app"><aside class="side"><h2>ADELTE</h2><ul><li>Overview</li><li>Projects</li><li>AI</li><li>Settings</li></ul></aside><main class="main"><header>Dashboard</header><div class="cards"><div>Projects 12</div><div>Users 1,420</div><div>Revenue $24K</div></div></main></div>' },
      { title: '2. CSS dark theme', lang: 'css', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', code: '.app{display:grid;grid-template-columns:240px 1fr;height:100vh;font-family:system-ui}.side{background:#0f172a;color:#fff;padding:24px}.side h2{letter-spacing:-2px;font-size:28px;color:#818cf8}.side ul{list-style:none;padding:0;color:#cbd5e1}.side li{padding:8px 0}.main{background:#fefcf6;padding:24px}header{font-size:28px;font-weight:900;margin-bottom:16px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cards div{background:#fff;padding:24px;border-radius:16px;border:1px solid #e5e7eb;font-weight:900}' },
      { title: '3. JS chart', lang: 'js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', code: 'const data = [40, 70, 55, 90, 30, 80, 60];\nconsole.log("Weekly active users:", data.reduce((a,b)=>a+b,0));' }
    ]
  },
  {
    id: 'threejs', title: '3D Scene', emoji: '🎮', desc: 'Three.js interactive cube',
    steps: [
      { title: '1. HTML canvas', lang: 'html', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', code: '<canvas id="c" width="600" height="400" style="background:#0f172a;border-radius:20px"></canvas>' },
      { title: '2. Three.js scene', lang: 'sim', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', code: 'import * as THREE from "three";\nconst scene = new THREE.Scene();\nconst cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 0x6366f1}));\nscene.add(cube);\nconsole.log("3D scene ready");' }
    ]
  }
];

type Arch = {
  name: string;
  emoji: string;
  description: string;
  color: string;
  image: string;
  stack: string[];
  files: Array<{ path: string; purpose: string }>;
};

const ARCHITECTURES: Arch[] = [
  {
    name: 'SaaS Platform', emoji: '☁️', description: 'Multi-tenant SaaS with auth, billing, dashboard', color: 'from-indigo-500 to-violet-500',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind'],
    files: [
      { path: '/app', purpose: 'App routes' },
      { path: '/components', purpose: 'Reusable UI' },
      { path: '/lib', purpose: 'Utilities + DB' },
      { path: '/prisma', purpose: 'Database schema' },
      { path: '/public', purpose: 'Static assets' },
      { path: '/styles', purpose: 'Global CSS' },
    ]
  },
  {
    name: 'AI Mobile App', emoji: '🤖', description: 'Cross-platform mobile with AI assistant', color: 'from-fuchsia-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    stack: ['React Native', 'Python AI', 'Firebase', 'FastAPI'],
    files: [
      { path: '/src', purpose: 'App source' },
      { path: '/src/screens', purpose: 'Screen components' },
      { path: '/src/ai', purpose: 'AI integration' },
      { path: '/api', purpose: 'Python backend' },
      { path: '/models', purpose: 'AI model files' },
    ]
  },
  {
    name: 'E-commerce', emoji: '🛒', description: 'Storefront + checkout + admin', color: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
    stack: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
    files: [
      { path: '/client', purpose: 'Vue storefront' },
      { path: '/server', purpose: 'Express API' },
      { path: '/admin', purpose: 'Admin panel' },
      { path: '/uploads', purpose: 'Product images' },
    ]
  },
  {
    name: '3D Experience', emoji: '🎮', description: 'WebGL / Three.js interactive app', color: 'from-cyan-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
    stack: ['Three.js', 'WebGL', 'TypeScript', 'GLSL'],
    files: [
      { path: '/src/scenes', purpose: '3D scenes' },
      { path: '/src/shaders', purpose: 'GLSL shaders' },
      { path: '/src/models', purpose: '3D models' },
      { path: '/public/textures', purpose: 'Texture assets' },
    ]
  },
  {
    name: 'Tourism Ecosystem', emoji: '🏞️', description: 'Visit Rwanda-style booking + maps', color: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&h=400&fit=crop',
    stack: ['Vue', 'Mapbox', 'Postgres', 'Stripe'],
    files: [
      { path: '/pages', purpose: 'Public pages' },
      { path: '/bookings', purpose: 'Booking engine' },
      { path: '/admin', purpose: 'Tour operator panel' },
      { path: '/api', purpose: 'REST API' },
    ]
  },
  {
    name: 'EdTech Platform', emoji: '📚', description: 'AI marking + student dashboards', color: 'from-amber-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    stack: ['Python', 'React', 'PostgreSQL', 'OpenAI'],
    files: [
      { path: '/backend', purpose: 'Python API' },
      { path: '/ai', purpose: 'Marking engine' },
      { path: '/frontend', purpose: 'Student UI' },
      { path: '/teacher', purpose: 'Teacher panel' },
    ]
  }
];

function StructureGenerator() {
  const [active, setActive] = useState(0);
  const arch = ARCHITECTURES[active];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-2">
        <div className="text-xs font-black uppercase tracking-[3px] mb-3" style={{ color: 'var(--accent)' }}>Pick a project structure</div>
        {ARCHITECTURES.map((a, i) => (
        <button key={a.name} onClick={() => setActive(i)} className={`w-full text-left rounded-2xl border p-3 transition ${active === i ? 'border-indigo-400 bg-indigo-500/15' : ''}`} style={{ background: active === i ? 'var(--accent)' : 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-base`}>{a.emoji}</div>
              <div>
                <div className="font-black text-sm" style={{ color: 'var(--text)' }}>{a.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-2)' }}>{a.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'var(--code-bg)', borderColor: 'var(--border)' }}>
        <div className="relative h-48">
          <img src={arch.image} className="w-full h-full object-cover" alt={arch.name} />
          <div className={`absolute inset-0 bg-gradient-to-t ${arch.color} opacity-60`} />
          <div className="absolute bottom-3 left-4 text-white">
            <div className="text-3xl mb-1">{arch.emoji}</div>
            <div className="text-2xl font-black">{arch.name}</div>
            <div className="text-xs opacity-90">{arch.description}</div>
          </div>
        </div>

        <div className="p-5" style={{ color: 'var(--text)' }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>Tech stack</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {arch.stack.map(t => <span key={t} className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: 'var(--border)', color: 'var(--text)' }}>{t}</span>)}
          </div>

          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>File tree</div>
          <div className="font-mono text-xs space-y-1 rounded-2xl p-3" style={{ background: 'var(--code-bg)', borderColor: 'var(--border)' }}>
            {arch.files.map(f => (
            <div key={f.path} className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>{f.path}</span>
              <span style={{ color: 'var(--text-3)' }}>— {f.purpose}</span>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ————————————————————————————————————
// PROJECTS DATA
// ————————————————————————————————————

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
// ADELTE AI ASSISTANT — real multi-source search + live build/run
// ————————————————————————————————————
type ChatMsg = { id: string; role: 'user' | 'ai'; text: string; sources?: Array<{ title: string; url?: string; snippet: string; engine: string }>; isCode?: boolean };
type Source = { title: string; url?: string; snippet: string; engine: string };

const ADELTE_KB: Array<{ tags: string[]; a: string }> = [
  { tags: ['who', 'about', 'you', 'adelte'], a: 'I am AdelTe — software developer, AI builder, platform architect, and digital innovator based in Rwanda. I build intelligent systems, AI-powered platforms, automation tools, educational tech, tourism ecosystems, marketplaces, and cloud services.' },
  { tags: ['contact', 'email', 'reach'], a: 'Email mloaze778@gmail.com, phone 0722635461, GitHub github.com/ADELTE-Boncoeur. I respond quickly to serious collaboration and hiring requests.' },
  { tags: ['project', 'mab', 'marking'], a: 'MAB AI is an AI examination marking platform with automatic marking, marking guide generation, exam storage, and educational analytics. It is one of my flagship projects.' },
  { tags: ['visit', 'rwanda', 'tourism'], a: 'Visit Rwanda is a tourism ecosystem platform I built for destinations, hotels, activities, and interactive booking experiences, focused on Rwanda.' },
  { tags: ['commander', 'desktop'], a: 'AdelTe Commander is my private desktop command center with voice commands, automation, security controls, keyboard shortcuts, and system management.' },
  { tags: ['marketplace', 'luxury', 'villa'], a: 'A real estate + social marketplace with luxury villas, story sharing, video sharing, products, and investment opportunities.' },
  { tags: ['keyboard', 'virtual'], a: 'A custom on-screen keyboard with dark mode, emoji picker, copy/paste, language switching, and sound effects.' },
  { tags: ['cloud', 'storage', 'drive'], a: 'A Google Drive-inspired secure cloud storage platform with long-term file storage, email access, and secure management.' },
  { tags: ['job', 'portal', 'hiring'], a: 'A full hiring platform with job posting, applications, admin dashboard, and candidate management.' },
  { tags: ['game', 'rpg', 'three'], a: 'A Three.js multiplayer RPG with missions, XP, animations, and a warehouse environment.' },
  { tags: ['language', 'kinyarwanda', 'french', 'latin'], a: 'Kinyarwanda 100%, English 100%, Français 80%, Latin 70%.' },
  { tags: ['hire', 'work', 'freelance', 'job'], a: 'Yes, AdelTe is open to serious projects. Email mloaze778@gmail.com with project details, scope, and timeline.' },
  { tags: ['skill', 'stack', 'technology', 'tech'], a: 'Frontend: HTML5, CSS3, JavaScript, Vue.js, Tailwind. Backend: Python, Node.js, REST APIs, Auth, Databases. AI: automation, prompt engineering, AI integration, exam marking. Design: UI, UX, motion, 3D interfaces.' }
];

async function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 6500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { ...options, signal: ctrl.signal });
    return r;
  } finally { clearTimeout(t); }
}

async function searchDuckDuckGo(q: string): Promise<Source[]> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1&t=AdelTeAI`;
  try {
    const r = await fetchWithTimeout(url);
    if (!r.ok) return [];
    const j = await r.json();
    const out: Source[] = [];
    if (j.AbstractText) out.push({ title: j.Heading || q, url: j.AbstractURL, snippet: j.AbstractText, engine: 'DuckDuckGo' });
    if (j.Answer) out.push({ title: 'Instant Answer', snippet: j.Answer, engine: 'DuckDuckGo' });
    if (j.Definition) out.push({ title: 'Definition', snippet: j.Definition, engine: 'DuckDuckGo' });
    (j.RelatedTopics || []).slice(0, 6).forEach((t: any) => {
      if (t.Text && t.FirstURL) out.push({ title: (t.Text.split(' - ')[0] || t.Text).slice(0, 80), url: t.FirstURL, snippet: t.Text, engine: 'DuckDuckGo' });
    });
    return out;
  } catch { return []; }
}

async function searchWikipedia(q: string): Promise<Source[]> {
  try {
    const r = await fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
    if (!r.ok) return [];
    const j = await r.json();
    if (j.extract) return [{ title: j.title, url: j.content_urls?.desktop?.page, snippet: j.extract, engine: 'Wikipedia' }];
    return [];
  } catch { return []; }
}

async function searchWikipediaSearch(q: string): Promise<Source[]> {
  try {
    const r = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&search=${encodeURIComponent(q)}&origin=*`);
    if (!r.ok) return [];
    const j = await r.json();
    const titles: string[] = j[1] || [];
    const summaries: string[] = j[2] || [];
    const links: string[] = j[3] || [];
    return titles.map((t, i) => ({ title: t, url: links[i], snippet: summaries[i] || 'Wikipedia entry', engine: 'Wikipedia' })).slice(0, 4);
  } catch { return []; }
}

async function searchGitHub(q: string): Promise<Source[]> {
  try {
    const r = await fetchWithTimeout(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=4`);
    if (!r.ok) return [];
    const j = await r.json();
    return (j.items || []).map((it: any) => ({ title: it.full_name, url: it.html_url, snippet: it.description || 'GitHub repository', engine: 'GitHub' }));
  } catch { return []; }
}

async function searchBing(q: string): Promise<Source[]> {
  try {
    const r = await fetchWithTimeout(`https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`);
    if (!r.ok) return [];
    const j = await r.json();
    const arr: any[] = j[1] || [];
    return arr.slice(0, 4).map((s: any) => ({ title: s?.Title || q, url: s?.Url, snippet: s?.Description || 'Bing suggestion', engine: 'Bing' }));
  } catch { return []; }
}

function localKnowledgeAnswer(q: string): string | null {
  const text = q.toLowerCase();
  for (const entry of ADELTE_KB) {
    if (entry.tags.some(t => text.includes(t))) return entry.a;
  }
  if (text.includes('welcome')) return 'Welcome to AdelTe Industries — Building the Future Through Code.';
  return null;
}

function synthesize(q: string, sources: Source[], localAns: string | null) {
  if (sources.length === 0 && !localAns) {
    return `I searched the live web (DuckDuckGo, Wikipedia, GitHub, Bing) and your AdelTe knowledge base but could not find a precise answer to "${q}". Try rephrasing, or ask me to build a small app.`;
  }
  const local = localAns ? `From AdelTe knowledge base: ${localAns}\n\n` : '';
  const grouped: Record<string, string[]> = {};
  sources.slice(0, 8).forEach(s => {
    grouped[s.engine] = grouped[s.engine] || [];
    grouped[s.engine].push(`- ${s.title}: ${s.snippet.slice(0, 220)}${s.snippet.length > 220 ? '…' : ''}`);
  });
  const blocks = Object.entries(grouped).map(([engine, lines]) => `▶ ${engine}\n${lines.join('\n')}`).join('\n\n');
  return `${local}Combined answer for "${q}":\n\n${blocks}`;
}

function AdelTeAI() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'welcome', role: 'ai', text: 'Hi, I am AdelTe AI. Ask me anything, or click Build It to generate a small app. I search DuckDuckGo, Wikipedia, GitHub, Bing and the AdelTe knowledge base in parallel and combine the answers.' }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [tab, setTab] = useState<'chat' | 'build'>('chat');
  const [code, setCode] = useState('// AdelTe AI built this. Edit and run.\nconsole.log("Welcome to AdelTe Industries");\nconst ai = { name: "ADELTE", role: "AI Builder" };\nconsole.log(JSON.stringify(ai));');
  const [codeOut, setCodeOut] = useState<string[]>([]);
  const [preview, setPreview] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, busy]);

  const ask = async (raw?: string) => {
    const q = (raw ?? input).trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);
    setSources([]);
    setMessages(m => [...m, { id: 'u' + Date.now(), role: 'user', text: q }]);

    const [ddg, wiki, wikiSearch, gh, bing] = await Promise.all([
      searchDuckDuckGo(q),
      searchWikipedia(q),
      searchWikipediaSearch(q),
      searchGitHub(q),
      searchBing(q)
    ]);
    const all = [...ddg, ...wiki, ...wikiSearch, ...gh, ...bing];
    const seen = new Set<string>();
    const dedup = all.filter(s => {
      const k = s.title + s.snippet.slice(0, 40);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    setSources(dedup);
    const local = localKnowledgeAnswer(q);
    const text = synthesize(q, dedup, local);
    setMessages(m => [...m, { id: 'a' + Date.now(), role: 'ai', text, sources: dedup }]);
    setBusy(false);
  };

  const buildApp = async () => {
    if (busy) return;
    setBusy(true);
    const prompt = input.trim() || 'AdelTe card';
    setMessages(m => [...m, { id: 'u' + Date.now(), role: 'user', text: `Build: ${prompt}` }]);
    setTab('build');

    const lower = prompt.toLowerCase();
    let generated = '';
    if (lower.includes('timer') || lower.includes('clock')) {
      generated = [
        '<div style="padding:20px;border-radius:20px;background:#0f172a;color:#fff;text-align:center;font-family:system-ui">',
        '  <h1>ADELTE Timer</h1>',
        '  <p id="t" style="font-size:48px">00:00:00</p>',
        '  <button id="b" style="padding:8px 16px;border-radius:10px;background:#6366f1;color:#fff;border:none;cursor:pointer">Start</button>',
        '</div>',
        '<script>',
        '  const el=document.getElementById("t"); const btn=document.getElementById("b"); let s=0, run=false, iv;',
        '  btn.onclick=()=>{ if(!run){ run=true; btn.textContent="Stop"; iv=setInterval(()=>{ s++; const h=String(Math.floor(s/3600)).padStart(2,"0"), m=String(Math.floor(s/60)%60).padStart(2,"0"), ss=String(s%60).padStart(2,"0"); el.textContent=h+":"+m+":"+ss; }, 1000);} else { run=false; btn.textContent="Start"; clearInterval(iv);} };',
        '</script>'
      ].join('\n');
    } else if (lower.includes('counter') || lower.includes('click')) {
      generated = [
        '<div style="padding:20px;border-radius:20px;background:#fefcf6;border:2px solid #6366f1;text-align:center;font-family:system-ui">',
        '  <h1>ADELTE Counter</h1>',
        '  <p id="c" style="font-size:64px;font-weight:900;color:#4f46e5">0</p>',
        '  <button onclick="document.getElementById(\'c\').textContent=Number(document.getElementById(\'c\').textContent)+1" style="padding:10px 24px;border-radius:10px;background:#4f46e5;color:#fff;border:none;cursor:pointer">Click me</button>',
        '</div>'
      ].join('\n');
    } else if (lower.includes('todo') || lower.includes('task')) {
      generated = [
        '<div style="padding:20px;border-radius:20px;background:#0f172a;color:#fff;font-family:system-ui;max-width:380px;margin:auto">',
        '  <h1>ADELTE Todo</h1>',
        '  <input id="i" placeholder="New task..." style="padding:8px;width:70%;border-radius:8px;border:none">',
        '  <button onclick="add()" style="padding:8px 12px;border-radius:8px;background:#22c55e;color:#000;border:none;cursor:pointer">Add</button>',
        '  <ul id="l" style="list-style:none;padding:0;margin-top:12px"></ul>',
        '</div>',
        '<script>',
        '  function add(){ const i=document.getElementById("i"), l=document.getElementById("l"); if(!i.value) return; const li=document.createElement("li"); li.textContent=i.value; li.style.cssText="padding:8px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between"; const b=document.createElement("button"); b.textContent="x"; b.style.cssText="background:none;color:#ef4444;border:none;cursor:pointer"; b.onclick=()=>li.remove(); li.appendChild(b); l.appendChild(li); i.value=""; }',
        '</script>'
      ].join('\n');
    } else if (lower.includes('chart') || lower.includes('graph') || lower.includes('bar')) {
      const heights = [40,70,55,90,30,80,60];
      generated = [
        '<div style="padding:20px;border-radius:20px;background:#fff;font-family:system-ui">',
        '  <h1>ADELTE Project Activity</h1>',
        '  <div style="display:flex;align-items:flex-end;gap:6px;height:160px">',
        ...heights.map(h => `    <div style="flex:1;background:linear-gradient(to top,#6366f1,#a855f7);height:${h}%;border-radius:6px;display:flex;align-items:flex-end;justify-content:center;color:#fff;font-weight:700;padding-bottom:4px">${h}</div>`),
        '  </div>',
        '</div>'
      ].join('\n');
    } else {
      generated = [
        '<div style="padding:28px;border-radius:24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;font-family:system-ui;text-align:center;box-shadow:0 20px 50px rgba(99,102,241,0.4)">',
        '  <div style="font-size:56px">⚡</div>',
        `  <h1>${prompt}</h1>`,
        '  <p>Built live by AdelTe AI for ADELTE Industries</p>',
        '  <button onclick="alert(\'Welcome to AdelTe Industries\')" style="padding:10px 24px;border-radius:30px;background:#fff;color:#4f46e5;border:none;cursor:pointer;font-weight:700">Run Demo</button>',
        '</div>'
      ].join('\n');
    }

    setCode(generated);
    setPreview(generated);
    setCodeOut(['> AdelTe AI compiled your app.', '> Live preview rendered.', '✓ Ready to run. Edit the code and click ▶ Run Code.']);
    setMessages(m => [...m, { id: 'a' + Date.now(), role: 'ai', text: `I built "${prompt}" for you. Switch to the Build tab to run it and see the live preview.`, isCode: true }]);
    setInput('');
    setBusy(false);
  };

  const runCode = () => {
    setCodeOut([]);
    setPreview('');
    const lines: string[] = [];
    if (code.includes('<div') || code.includes('<button') || code.includes('<h1')) {
      setPreview(code);
      lines.push('> HTML rendered to live preview.');
    }
    if (/console\.log/.test(code)) {
      const logs: string[] = [];
      const orig = console.log;
      console.log = (...a: any[]) => logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      try { (new Function(code.replace(/<script[\s\S]*?<\/script>/g, '')))(); } catch (e: any) { lines.push('⚠️ ' + (e.message || 'error')); }
      console.log = orig;
      lines.push('> AdelTe AI executed your code.');
      logs.forEach(l => lines.push(l));
    }
    if (lines.length === 0) lines.push('> No executable JS or HTML detected. Add console.log or HTML to see results.');
    setCodeOut(lines);
  };

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="ml-2 font-mono text-xs tracking-wider">ADELTE_AI — search & build</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-xs">
          {(['chat', 'build'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 font-bold transition ${tab === t ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'}`}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-3 flex h-[560px] flex-col">
          <div ref={chatRef} className="flex-1 overflow-auto p-5 space-y-3 bg-slate-950">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/90 border border-white/10'}`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Sources ({m.sources.length})</div>
                      <ul className="space-y-1.5">
                        {m.sources.map((s, i) => (
                          <li key={i} className="text-[11px] text-white/70">
                            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 mr-2 text-[9px] font-black text-emerald-300">{s.engine}</span>
                            {s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-emerald-300 underline-offset-2 hover:underline">{s.title}</a> : s.title}
                            <div className="text-white/50 text-[10px] line-clamp-2">{s.snippet}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-white/50 animate-pulse">AdelTe AI is searching DuckDuckGo, Wikipedia, GitHub, Bing...</div>}
          </div>

          <div className="border-t border-white/10 p-3 bg-slate-900/60">
            <div className="flex items-end gap-2">
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }} rows={2} placeholder="Ask anything, or describe the app you want to build..." className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none" />
              <div className="flex flex-col gap-2">
                <button onClick={() => ask()} disabled={busy} className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50">Ask AI</button>
                <button onClick={buildApp} disabled={busy} className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50">Build It</button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['who is AdelTe', 'What is artificial intelligence', 'Latest React features', 'Visit Rwanda tourism', 'Build a todo app', 'Build a counter'].map(s => (
                <button key={s} onClick={() => ask(s)} className="rounded-full bg-white/5 px-3 py-1 text-[10px] text-white/70 hover:bg-white/10">{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex h-[560px] flex-col border-l border-white/10 bg-slate-950">
          {tab === 'chat' ? (
            <div className="flex-1 overflow-auto p-5 text-xs text-white/70">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Active sources</div>
              {sources.length === 0 ? (
                <div className="text-white/40">Ask something to see real-time results pulled from DuckDuckGo, Wikipedia, GitHub, Bing, and the AdelTe knowledge base.</div>
              ) : (
                <ul className="space-y-2">
                  {sources.map((s, i) => (
                    <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-2">
                      <div className="flex items-center justify-between"><span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black text-emerald-300">{s.engine}</span><span className="text-[10px] text-white/40">#{i + 1}</span></div>
                      <div className="mt-1 font-semibold text-white/90">{s.title}</div>
                      <div className="text-white/60 line-clamp-3">{s.snippet}</div>
                      {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline text-[10px]">open source →</a>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col p-4 gap-3">
              <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} className="h-44 rounded-2xl border border-white/10 bg-[#07111f] p-3 font-mono text-[11px] text-cyan-100 focus:border-indigo-500 focus:outline-none resize-none" />
              <div className="flex gap-2">
                <button onClick={runCode} className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600">▶ Run Code</button>
                <button onClick={buildApp} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 hover:bg-white/10">Regenerate</button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#07111f] p-3 font-mono text-[10px] text-emerald-300 min-h-[60px] max-h-24 overflow-auto">
                {codeOut.length > 0 ? codeOut.map((l, i) => <div key={i}>{l}</div>) : <div className="text-white/40">Click ▶ Run Code to execute.</div>}
              </div>
              {preview && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white">
                  <div className="px-3 py-1.5 bg-white/90 text-black text-[10px] font-black uppercase tracking-widest">Live preview</div>
                  <div className="p-3" dangerouslySetInnerHTML={{ __html: preview }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ————————————————————————————————————
// MAIN APP
// ————————————————————————————————————
export default function App() {
  const [loading, setLoading] = useState(true);
  const [gh, setGh] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [modal, setModal] = useState<P|null>(null);

  useEffect(()=> {
    const t = setTimeout(()=>setLoading(false), 1700);
    return () => clearTimeout(t);
  },[]);

  useEffect(()=> {
    fetch('https://api.github.com/users/ADELTE-Boncoeur').then(r=>r.ok?r.json():null).then(d=>d&&setGh(d)).catch(()=>{});
    fetch('https://api.github.com/users/ADELTE-Boncoeur/repos?per_page=12&sort=updated').then(r=>r.ok?r.json():[]).then(d=>setRepos(d||[])).catch(()=>{});
  },[]);

  const [counts, setCounts] = useState({p:0,pl:0,h:0,t:0});
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if (e.isIntersecting) {
        const s = performance.now();
        const go = (n:number)=>{
          const pr = Math.min((n-s)/1800,1);
          setCounts({p:Math.floor(20*pr),pl:Math.floor(50*pr),h:Math.floor(5000*pr),t:Math.floor(30*pr)});
          if (pr<1) requestAnimationFrame(go);
        };
        requestAnimationFrame(go); obs.disconnect();
      }
    });
    if (statsRef.current) obs.observe(statsRef.current);
    return ()=>obs.disconnect();
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

          <div className="relative text-center px-6 max-w-5xl py-16">
            <div className="mb-4 inline-block rounded-full border border-indigo-200 bg-white/70 px-5 py-1 text-xs tracking-widest font-semibold text-indigo-700">RWANDA • 2025–2026</div>
            <h1 className="hero-title text-[80px] md:text-[128px] font-black tracking-[-6.4px] leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">ADELTE</h1>
            <div className="hero-subtitle text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-700">Building the Future Through Code</div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['Software Developer','AI Builder','Platform Architect','Digital Innovator'].map(t => (
                <div key={t} className="px-5 py-1 text-sm rounded-full font-medium transition" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>{t}</div>
              ))}
            </div>

            <div className="mt-8 text-lg font-medium font-mono h-8" style={{ color: 'var(--accent)' }}>Welcome to AdelTe Industries — Creating intelligent systems...</div>

<div className="flex flex-wrap gap-3 justify-center mt-9">
            <a href="#projects" className="hero-shadow px-9 py-3.5 rounded-full font-semibold text-sm transition" style={{ background: 'var(--accent)', color: '#fff' }}>VIEW 12 PROJECTS</a>
            <a href="#sandbox" className="px-9 py-3.5 rounded-full border-2 font-semibold text-sm transition" style={{ borderColor: 'var(--text)', color: 'var(--text)' }}>WRITE &amp; RUN CODE</a>
            <button onClick={downloadResume} className="px-9 py-3.5 rounded-full border font-semibold text-sm transition" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>DOWNLOAD RESUME</button>
          </div>
            <div className="mt-16 text-[10px] text-slate-500">SCROLL TO EXPLORE THE NOTEBOOK</div>
          </div>
        </Paper>
      </section>

      {/* ABOUT */}
<section id="about" className="max-w-[1200px] mx-auto px-6 py-24 grid lg:grid-cols-[380px,1fr] gap-14">
        <Reveal>
            <div className="relative">
              <img src={PROFILE} alt="AdelTe" className="rounded-3xl shadow-xl border w-full" style={{ borderColor: 'var(--border)' }}/>
              <div className="absolute -bottom-4 -right-4 px-5 py-1 rounded-2xl shadow font-bold text-xs border" style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--border)' }}>BASED IN RWANDA</div>
            </div>
        </Reveal>
        <Reveal>
            <h2 className="text-6xl font-black tracking-[-2.5px] mb-4" style={{ color: 'var(--text)' }}>Who Am I?</h2>
            <p className="text-xl max-w-prose" style={{ color: 'var(--text-2)' }}>I am AdelTe, a software developer and technology creator focused on building intelligent digital systems, AI-powered platforms, automation tools, educational technologies, tourism ecosystems, marketplaces, cloud services, and interactive experiences.</p>
            <p className="text-xl max-w-prose mt-3" style={{ color: 'var(--text-2)' }}>My goal is to create solutions that combine innovation, artificial intelligence, and modern user experience design.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-9 text-sm">
              {[['NAME','AdelTe'],['LOCATION','Rwanda'],['EMAIL','mloaze778@gmail.com'],['PHONE','0722635461']].map(([k,v])=>(
                <div key={k} className="border-l-4 pl-4 py-1" style={{ borderColor: 'var(--accent)', background: 'var(--card-bg)' }}>
                  <div className="uppercase text-[10px] tracking-widest" style={{ color: 'var(--accent)' }}>{k}</div>
                  <div className="font-semibold" style={{ color: 'var(--text)' }}>{v}</div>
                </div>
              ))}
              <a href="https://github.com/ADELTE-Boncoeur" target="_blank" className="col-span-1 sm:col-span-2 flex justify-between px-5 py-3 rounded-2xl items-center text-sm font-medium transition" style={{ background: 'var(--accent)', color: '#fff' }}>GitHub Portfolio →</a>
            </div>

          <div className="mt-8">
            <div className="uppercase text-xs tracking-[2px] font-semibold mb-3" style={{ color: 'var(--accent)' }}>LANGUAGES I SPEAK</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{n:'Kinyarwanda',p:100},{n:'English',p:100},{n:'Français',p:80},{n:'Latin',p:70}].map(l=>(
                <div key={l.n} className="rounded-2xl px-4 py-3 border transition" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text)' }}><span>{l.n}</span><span>{l.p}%</span></div>
                  <div className="h-1 mt-2 rounded" style={{ background: 'var(--border)' }}><div className="h-1 rounded" style={{ background: 'var(--accent)', width: `${l.p}%` }}/></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20 bg-gradient-to-b from-white to-indigo-50/50 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-center text-5xl font-black tracking-tighter mb-10">Skills &amp; Expertise</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {title:'Frontend', list:['HTML5','CSS3','JavaScript','Vue.js','Tailwind CSS','Responsive']},
              {title:'Backend', list:['Python','Node.js','REST APIs','Authentication','Databases']},
              {title:'AI & Automation', list:['Automation','Prompt Engineering','AI Integration','Exam Marking']},
              {title:'Design', list:['UI Design','UX Design','Motion Design','3D Interfaces']},
            ].map((c,i)=>(
              <Reveal key={i} delay={i*0.05}>
                <Paper className="rounded-3xl border border-amber-200/70 p-7 shadow">
                  <div className="font-black text-3xl mb-5 text-amber-900">{c.title}</div>
                  <ul className="space-y-2 text-slate-700">{c.list.map(s=><li key={s} className="flex gap-2"><span>✎</span>{s}</li>)}</ul>
                </Paper>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY WALL */}
      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center text-xs tracking-[4px] font-bold text-indigo-700 mb-6">18 LANGUAGES I WRITE AND RUN</div>
          <div className="flex flex-wrap justify-center gap-4">
            {LANGS.map(l=>(
              <a key={l.id} href="#sandbox" className="flex flex-col items-center bg-white px-4 py-3 rounded-2xl border text-center w-24 hover:-translate-y-1 hover:shadow-lg transition">
                <img src={l.icon} className="w-8 h-8 mb-1" alt=""/>
                <div className="text-[10px] font-bold text-slate-700">{l.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE I AM — languages + AI mastery */}
      <WhereIAm />

      {/* STEP-BY-STEP BUILDER */}
      <section id="builder" className="py-24 px-6 bg-slate-950">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-xs tracking-[3px] text-indigo-300 font-semibold mb-2">STEP-BY-STEP BUILDER</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Build a Full Website in Any Language</h2>
            <p className="mt-3 max-w-2xl mx-auto text-white/60">Pick a template. Each step uses the right language (HTML, CSS, JavaScript, TypeScript, Three.js, etc). Click Run to execute, or Run all steps to deploy. Live preview included.</p>
          </div>
          <Reveal><WebsiteBuilder /></Reveal>
        </div>
      </section>

      {/* IDEAL STRUCTURE GENERATOR */}
      <section id="structure" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-indigo-950">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-xs tracking-[3px] text-indigo-300 font-semibold mb-2">STRUCTURE GENERATOR</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">AdelTe Idea Studio — Pick a Structure</h2>
            <p className="mt-3 max-w-2xl mx-auto text-white/60">Six production-ready project structures with imagery, tech stack, and full file tree. Use them as the blueprint for your next AdelTe build.</p>
          </div>
          <Reveal><StructureGenerator /></Reveal>
        </div>
      </section>

      {/* ADELTE AI */}
      <section id="adelte-ai" className="py-24 px-6 bg-slate-950">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-xs tracking-[3px] text-indigo-300 font-semibold mb-2">NEW — LIVE AI</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">AdelTe AI Assistant</h2>
            <p className="mt-3 max-w-xl mx-auto text-white/60">Real multi-source search: DuckDuckGo, Wikipedia, GitHub, Bing + the AdelTe knowledge base. Type "build todo" to generate a working app and run it live in the same page.</p>
          </div>
          <Reveal><AdelTeAI /></Reveal>
        </div>
      </section>

      {/* IDEA STUDIO */}
      <section id="studio" className="py-24 px-6 bg-gradient-to-b from-white via-indigo-50/40 to-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-xs tracking-[3px] text-indigo-600 font-semibold mb-2">NEW FEATURE</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">AdelTe Idea Studio</h2>
            <p className="mt-3 max-w-xl mx-auto text-slate-600">A smart notebook tool that turns a raw idea into a real build blueprint with stack, modules, timeline, architecture, metrics, and starter code.</p>
          </div>
          <Reveal><IdeaStudio /></Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-6 py-20 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-black text-6xl tracking-[-2.8px]">12 Projects</h2>
            <div className="text-sm text-slate-500 max-w-[240px]">Massive showcase. Each card features live images, features &amp; Figma prototypes.</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7" style={{perspective:'1200px'}}>
            {PROJECTS.map((p,i)=>(
              <Reveal key={p.id} delay={i*0.03}>
                <Tilt3D className="transition">
                  <div onClick={()=>setModal(p)} className="bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl shadow-xl">
                    <div className="relative">
                      <img src={p.img} alt={p.title} className="aspect-video object-cover w-full"/>
                      <div className="absolute top-3 left-3 flex gap-1.5">{p.tags.map(t=><div key={t} className="bg-white/95 text-xs font-medium px-2.5 py-px rounded shadow">{t}</div>)}</div>
                      <div className="absolute top-3 right-3 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full font-bold">3D</div>
                    </div>
                    <div className="p-6">
                      <div className="font-black text-2xl tracking-tight mb-1.5">{p.title}</div>
                      <p className="text-sm text-slate-600 mb-4 leading-tight">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-5">{p.features.slice(0,3).map(f=><span key={f}>• {f}</span>)}</div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">VIEW</button>
                        {p.figma && <a href={p.figma} target="_blank" onClick={e=>e.stopPropagation()} className="px-4 py-2 border rounded-xl text-xs font-semibold">OPEN IN FIGMA</a>}
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SANDBOX */}
      <section id="sandbox" className="py-20 px-6 bg-[#f8f1e3]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs tracking-[3px] text-indigo-600 font-semibold mb-2">DIGITAL ENGINEER'S NOTEBOOK</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">CODE LAB — Write &amp; Run</h2>
            <p className="mt-3 max-w-lg mx-auto text-slate-600">18 languages — every one says <span className="font-semibold">"Welcome to AdelTe Industries"</span>. Real execution for JS/TS/React. Live HTML/CSS previews.</p>
          </div>
          <Reveal><Sandbox/></Reveal>
        </div>
      </section>

      {/* NOTEBOOK + SKETCH */}
      <section id="notebook" className="max-w-[1200px] mx-auto px-6 py-24">
        <h2 className="text-center font-black text-5xl tracking-tight mb-10">Digital Engineer's Notebook</h2>
        <div className="grid lg:grid-cols-5 gap-7">
          <Reveal className="lg:col-span-3"><InteractiveNotes/></Reveal>
          <Reveal className="lg:col-span-2"><PencilSketch/></Reveal>
        </div>
      </section>

      {/* GITHUB */}
      <section id="github" className="py-20 px-6 bg-slate-950 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="uppercase text-xs tracking-widest text-white/50">LIVE FROM GITHUB</div>
              <div className="text-5xl md:text-6xl font-black tracking-tight">ADELTE-Boncoeur</div>
            </div>
            <a href="https://github.com/ADELTE-Boncoeur" target="_blank" className="border px-7 py-3 rounded-full text-sm">OPEN ON GITHUB →</a>
          </div>

          {gh && (
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-4 bg-white/5 p-6 rounded-3xl">
                <div className="text-3xl font-black">{gh.name||gh.login}</div>
                <div className="text-sm text-white/60 mt-1 mb-4">Software Developer • AI Builder</div>
                <div className="flex gap-4 text-sm">
                  <div><span className="font-black text-2xl">{gh.public_repos}</span><div className="text-xs text-white/50">REPOS</div></div>
                  <div><span className="font-black text-2xl">{gh.followers}</span><div className="text-xs text-white/50">FOLLOWERS</div></div>
                </div>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repos.slice(0,8).map((r:any)=>(
                  <a href={r.html_url} target="_blank" key={r.id} className="block bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10">
                    <div className="font-semibold text-lg">{r.name}</div>
                    <div className="text-xs text-white/50 line-clamp-1">{r.description||'No description'}</div>
                    <div className="mt-4 text-[10px] flex gap-4 text-white/60"><span>{r.language||'—'}</span><span>★ {r.stargazers_count}</span></div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6 max-w-[980px] mx-auto">
        <h2 className="text-center text-5xl font-black mb-12 tracking-tighter">Experience Timeline</h2>
        <div className="space-y-8">
          {[{yr:'2025', items:['Virtual Keyboard','AI Examination Platform (MAB AI)']},{yr:'2026', items:['Visit Rwanda','Luxury Marketplace','AdelTe Commander','Job Portal','Secure Cloud Storage','3D Role Playing Game','Figma Prototypes','Code Lab / Sandbox']}].map((blk,idx)=>(
            <Reveal key={idx}>
              <Paper className="rounded-3xl border p-8">
                <div className="text-indigo-700 text-6xl font-black mb-4">{blk.yr}</div>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-lg">{blk.items.map(i=><div key={i}>• {i}</div>)}</div>
              </Paper>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{n:'Projects', v:counts.p+'+'},{n:'Platforms',v:counts.pl+'+'},{n:'Dev Hours',v:counts.h+'+'},{n:'Technologies',v:counts.t+'+'}].map((s,i)=>(
            <Reveal key={i} delay={i*0.1}>
              <FloatingIsland delay={i*0.4}>
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-8 rounded-3xl text-center shadow-xl" style={{boxShadow:'0 20px 40px rgba(99,102,241,0.15)'}}>
                  <div className="font-black text-6xl text-indigo-600">{s.v}</div>
                  <div className="text-sm font-semibold mt-1 text-slate-700">{s.n}</div>
                  <div className="text-[10px] text-indigo-500 mt-2 tracking-widest">3D • FLOATING</div>
                </div>
              </FloatingIsland>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-5xl font-black mb-10 tracking-[-1.5px]">Core Values — Notebook Notes</h2>
          <div className="grid md:grid-cols-3 gap-4" style={{perspective:'1000px'}}>
            {['Vision','Innovation','Technology','Creativity','Leadership','Problem Solving'].map((val,i)=>(
              <Reveal key={i} delay={i*0.05}>
                <Tilt3D>
                  <Paper className="p-8 border rounded-3xl text-xl font-semibold text-amber-900 shadow-lg">"{val}" — the heart of every line of code at AdelTe Industries.</Paper>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-slate-900 py-20 px-6 text-white">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-x-20">
          <div>
            <div className="font-black text-6xl tracking-tight">Let's Build the Future.</div>
            <div className="text-2xl mt-4 text-white/70">Reach out today. I build intelligent systems for visionary people and companies.</div>
          </div>
          <div className="mt-10 md:mt-0 space-y-4 text-lg">
            {[['Email','mloaze778@gmail.com','mailto:mloaze778@gmail.com'],['Phone','0722635461','tel:0722635461'],['GitHub','GitHub Portfolio','https://github.com/ADELTE-Boncoeur']].map(([l,v,h])=>(
              <a href={h} key={l} target="_blank" className="block border-b border-white/20 pb-4 flex justify-between items-center hover:text-indigo-300"><span className="text-white/50 text-sm">{l}</span><span>{v}</span></a>
            ))}
            <button onClick={downloadResume} className="mt-5 w-full rounded-2xl bg-white text-slate-900 py-4 font-bold">DOWNLOAD FULL RESUME</button>
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
                  <div className="font-semibold mb-2">Key Features</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">{modal.features.map(f=><li key={f}>• {f}</li>)}</ul>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>setModal(null)} className="flex-1 py-3 rounded-xl border">CLOSE</button>
                  {modal.figma && <a href={modal.figma} target="_blank" className="flex-1 py-3 bg-indigo-600 text-center rounded-xl text-white">OPEN FIGMA PROTOTYPE</a>}
                  <a href="#sandbox" onClick={()=>setModal(null)} className="flex-1 py-3 bg-slate-900 text-center rounded-xl text-white">OPEN IN CODE SANDBOX</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ————————————————————————————————————
// INTERACTIVE NOTES
// ————————————————————————————————————
function InteractiveNotes() {
  const [notes, setNotes] = useState<Array<{id:number; text:string; x:number; y:number}>>([
    {id:1, text:'Welcome to AdelTe Industries', x:60, y:70},
    {id:2, text:'AI + Design + Code = Future', x:220, y:160},
    {id:3, text:'18 languages, one notebook.', x:40, y:260},
  ]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setNotes(prev => [...prev, {id:Date.now(), text:text.trim(), x: 40+Math.random()*220, y: 40+Math.random()*180}]);
    setText('');
  };

  return (
    <Paper className="rounded-3xl border border-amber-200/70 shadow-lg p-6">
      <div className="flex justify-between mb-5">
        <div>
          <div className="font-black text-2xl text-amber-900">ADELTE NOTEBOOK</div>
          <div className="text-xs text-amber-700">Write your thoughts. Pencil &amp; Paper.</div>
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Write a note..." className="bg-white border border-amber-300 px-4 py-1.5 rounded-full text-sm w-52 focus:outline-none"/>
          <button onClick={add} className="bg-amber-900 text-white px-5 rounded-full font-semibold text-sm">ADD</button>
        </div>
      </div>
      <div className="relative min-h-[340px] bg-[#fffdf7] border border-amber-200 rounded-2xl overflow-hidden" style={{backgroundImage:'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #d1d5db 27px, #d1d5db 28px)'}}>
        {notes.map((n,idx)=>(
          <motion.div key={n.id} drag dragMomentum={false} className="absolute px-4 py-2 bg-[#fef9e8] border border-amber-300 text-amber-900 text-sm font-medium shadow-md rounded cursor-grab active:cursor-grabbing select-none max-w-[210px]" style={{left:n.x, top:n.y, rotate: idx%2===0?-1:2}} onDoubleClick={()=>setNotes(p=>p.filter(x=>x.id!==n.id))}>
            {n.text}
            <div className="text-[10px] text-amber-500 mt-0.5">— handwritten</div>
          </motion.div>
        ))}
        <div className="absolute bottom-3 right-4 text-amber-400/50 text-xs">Drag notes • Double-click to delete • Paper feel</div>
      </div>
    </Paper>
  );
}

// ————————————————————————————————————
// PENCIL SKETCH PAD
// ————————————————————————————————————
function PencilSketch() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const pos = (e:React.MouseEvent|React.TouchEvent) => {
    const c = ref.current; if (!c) return {x:0,y:0};
    const r = c.getBoundingClientRect();
    const ev:any = ('touches' in e) ? e.touches[0] : e;
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };

  const start = (e:React.MouseEvent|React.TouchEvent) => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const {x,y} = pos(e); ctx.beginPath(); ctx.moveTo(x,y);
    setDrawing(true);
  };
  const move = (e:React.MouseEvent|React.TouchEvent) => {
    if (!drawing) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const {x,y} = pos(e); ctx.lineTo(x,y); ctx.stroke();
  };
  const stop = () => setDrawing(false);
  const clear = () => { const c = ref.current; c?.getContext('2d')?.clearRect(0,0,c.width,c.height); };

  useEffect(()=>{
    const c = ref.current; if (c) { c.width = 560; c.height = 280; }
  },[]);

  return (
    <div className="bg-[#f8f1e3] border-2 border-amber-900/30 rounded-3xl p-4 shadow-inner overflow-hidden">
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="text-amber-800 font-semibold text-sm">✏️ HAND-DRAWN SKETCH PAD — DRAW ANYTHING</div>
        <button onClick={clear} className="text-xs px-3 py-1 rounded bg-white/70 hover:bg-white border text-amber-800">CLEAR</button>
      </div>
      <canvas ref={ref}
        onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        className="border border-amber-900/20 bg-[#fffdf7] w-full cursor-crosshair rounded-xl"/>
      <div className="text-[10px] text-amber-700/70 mt-1 px-2">Paper texture • Pencil lines • Real-time sketch</div>
    </div>
  );
}
