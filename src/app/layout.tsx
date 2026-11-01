import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest, Sofia_Sans_Extra_Condensed } from "next/font/google"; // taste-skill-ignore: mono is for real code only
import { LangProvider } from "@/lib/lang";
import "./globals.css";

const display = Sofia_Sans_Extra_Condensed({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

const text = Onest({
  variable: "--font-text",
  subsets: ["latin", "cyrillic"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Leon Kazaryan, full-stack and mobile developer",
  description:
    "An incoming call from Leon Kazaryan: full-stack and mobile developer, HackNU 2026 and Business Cup 2026 winner, front-end and mobile developer at Salesautomators.",
};

export const viewport: Viewport = {
  themeColor: "#05070a",
};

// Runs before first paint so language, motion and the loader never flash.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');
if(matchMedia('(prefers-reduced-motion: no-preference)').matches)d.classList.add('motion');
try{if(sessionStorage.getItem('booted'))d.classList.add('booted')}catch(e){}
try{var l=localStorage.getItem('lang');if(!l&&(navigator.language||'').slice(0,2)==='ru')l='ru';
if(l==='ru'){d.dataset.lang='ru';d.lang='ru';d.classList.add('wait');setTimeout(function(){d.classList.remove('wait')},1500)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${code.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
