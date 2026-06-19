import React, { useEffect, useRef, useState, useCallback } from "react";

/* ---------------------------------------------------------
   FOUNDRY STUDIO — "Where Ideas Become Brands."
   Single-file React + Tailwind site.
   Framer Motion is unavailable in this runtime, so all scroll
   reveals / hovers / parallax are done with a tiny custom
   IntersectionObserver hook + CSS transitions/keyframes.
--------------------------------------------------------- */

/* ---------- Reveal-on-scroll hook ---------- */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, shown] = useReveal(0.15);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 0.8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Parallax via scroll position ---------- */
function useParallax(speed = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${offset * -1}px, 0)`;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
}

/* ---------- Sparkle decoration ---------- */
function Sparkle({ top, left, size = 10, delay = 0, opacity = 0.9 }) {
  return (
    <svg
      className="sparkle"
      style={{ top, left, width: size, height: size, animationDelay: `${delay}s`, opacity }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z"
        fill="#ffec4e"
      />
    </svg>
  );
}

function SparkleField({ count = 6, area = "section" }) {
  const seeds = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {seeds.map((i) => (
        <Sparkle
          key={i}
          top={`${8 + ((i * 37) % 85)}%`}
          left={`${4 + ((i * 53) % 92)}%`}
          size={6 + (i % 3) * 5}
          delay={i * 0.6}
          opacity={0.55 + (i % 3) * 0.15}
        />
      ))}
    </div>
  );
}

/* ---------- FS Watermark ---------- */
function FSWatermark({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none font-display font-bold leading-none text-white/[0.06] ${className}`}
      style={{ fontSize: "clamp(8rem, 30vw, 26rem)" }}
    >
      FS
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "About", href: "#about" },
    { label: "What We Do", href: "#what-we-do" },
    { label: "Process", href: "#process" },
    { label: "Who We Help", href: "#who-we-help" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mt-4 flex items-center justify-between rounded-full border border-white/15 bg-[#c5aded]/70 backdrop-blur-xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <a href="#top" className="flex items-center gap-2 font-display font-bold text-white tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/25 text-sm">
              FS
            </span>
            <span className="hidden sm:inline text-sm tracking-[0.18em]">FOUNDRY STUDIO</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/80 hover:text-[#ffec4e] transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center rounded-full bg-[#ffec4e] px-5 py-2 text-sm font-semibold text-[#3a2a5e] hover:scale-105 hover:shadow-[0_0_24px_rgba(255,236,78,0.6)] transition-all duration-300"
          >
            Let's Talk
          </a>
          <button
            className="md:hidden text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        {open && (
          <div className="md:hidden mt-2 rounded-3xl border border-white/15 bg-[#c5aded]/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white/85 text-sm"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-[#ffec4e] px-5 py-2 text-sm font-semibold text-[#3a2a5e]"
            >
              Let's Talk
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const ringRef = useParallax(0.08);
  const monoRef = useParallax(0.04);
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-28 md:pt-48 md:pb-36">
      <SparkleField count={8} />
      <div
        ref={ringRef}
        className="pointer-events-none absolute -right-24 top-24 h-[520px] w-[520px] rounded-full border border-white/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 top-44 h-[360px] w-[360px] rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-center relative">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs tracking-[0.25em] text-white/75 mb-8">
              FOUNDER-FOCUSED BRAND STUDIO
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display font-bold text-white leading-[0.92] text-[clamp(3.2rem,9vw,7.5rem)] tracking-tight">
              FOUNDRY
              <br />
              STUDIO
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 text-2xl md:text-3xl text-[#ffec4e] font-display font-semibold">
              Where Ideas Become Brands.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mt-6 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
              We help founders transform ideas into brands through strategy, design,
              launch systems, and growth-focused execution.
            </p>
          </Reveal>
          <Reveal delay={0.34}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#ffec4e] px-7 py-3.5 text-sm font-semibold text-[#3a2a5e] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,236,78,0.55)] transition-all duration-300"
              >
                Let's Build
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:border-[#ffec4e] hover:text-[#ffec4e] transition-all duration-300"
              >
                Our Process
              </a>
            </div>
          </Reveal>
        </div>

        <div ref={monoRef} className="relative hidden md:flex items-center justify-center">
          <div className="relative font-display font-bold text-[clamp(8rem,16vw,13rem)] leading-none text-white/10 select-none">
            FS
            <div className="absolute -top-3 -right-3">
              <Sparkle size={28} opacity={1} />
            </div>
            <div className="absolute bottom-6 -left-6">
              <Sparkle size={18} delay={0.4} opacity={0.8} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- About / Who We Are ---------- */
function About() {
  const tags = ["Strategy", "Brand Identity", "Web Experiences", "Launch Systems", "Growth Support"];
  return (
    <section id="about" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.04] to-white/0" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-6 md:px-10 relative text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-white/60">ABOUT FOUNDRY</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display font-bold text-white text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.02]">
            Built for founders.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 space-y-5 text-white/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            <p>Foundry Studio exists to help ambitious founders bring ideas to life.</p>
            <p>
              We combine strategy, branding, digital experiences, and growth systems to
              create brands that people remember.
            </p>
            <p>
              Whether you're starting from scratch or looking to evolve an existing
              business, we help turn vision into reality.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {tags.map((t, i) => (
              <span
                key={t}
                className="group rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/85 hover:border-[#ffec4e]/70 hover:text-[#ffec4e] hover:bg-white/5 transition-all duration-300 cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- What We Do ---------- */
function WhatWeDo() {
  const cards = [
    {
      n: "01",
      title: "BUILD",
      desc: "We create the foundation of your brand through positioning, strategy, messaging, and identity design.",
    },
    {
      n: "02",
      title: "LAUNCH",
      desc: "We bring brands to market through websites, digital experiences, launch assets, and customer journeys.",
    },
    {
      n: "03",
      title: "GROW",
      desc: "We help brands scale through content systems, SEO foundations, performance improvements, and growth opportunities.",
    },
  ];
  return (
    <section id="what-we-do" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-white/60">WHAT WE DO</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display font-bold text-white text-[clamp(2.4rem,6vw,4.2rem)]">
              Build. Launch. Grow.
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <div className="group relative h-full rounded-3xl border border-white/15 bg-white/[0.04] p-9 overflow-hidden hover:-translate-y-2 hover:border-[#ffec4e]/50 transition-all duration-500">
                <div className="absolute -right-4 -top-6 font-display font-bold text-7xl text-white/[0.07] group-hover:text-[#ffec4e]/[0.12] transition-colors duration-500">
                  {c.n}
                </div>
                <h3 className="relative font-display font-bold text-2xl text-white tracking-wide">
                  {c.title}
                </h3>
                <p className="relative mt-4 text-white/75 leading-relaxed">{c.desc}</p>
                <div className="relative mt-8 h-px w-12 bg-white/20 group-hover:w-20 group-hover:bg-[#ffec4e] transition-all duration-500" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process timeline ---------- */
function Process() {
  const steps = [
    { n: "01", title: "DISCOVER", desc: "Understand the founder, vision, market, and audience." },
    { n: "02", title: "DEFINE", desc: "Create positioning, strategy, messaging, and direction." },
    { n: "03", title: "BUILD", desc: "Design the brand identity and digital presence." },
    { n: "04", title: "LAUNCH", desc: "Bring the brand into the market with confidence." },
    { n: "05", title: "GROW", desc: "Support long-term growth and evolution." },
  ];
  return (
    <section id="process" className="relative py-28 md:py-36 overflow-hidden">
      <FSWatermark className="absolute -left-10 top-0 -z-0" />
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
        <div className="text-center mb-20">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-white/60">OUR PROCESS</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display font-bold text-white text-[clamp(2.4rem,6vw,4.2rem)]">
              How ideas become brands.
            </h2>
          </Reveal>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative">
          <div className="absolute left-0 right-0 top-7 h-px bg-white/15" />
          <div className="grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative flex flex-col items-start">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#c5aded] text-white font-display font-semibold">
                    {s.n}
                  </div>
                  <h3 className="mt-6 font-display font-bold text-white tracking-wide">{s.title}</h3>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden relative pl-10">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-white/15" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative">
                  <div className="absolute -left-10 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#c5aded] text-white font-display font-semibold text-sm">
                    {s.n}
                  </div>
                  <h3 className="font-display font-bold text-white tracking-wide">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Foundry ---------- */
function WhyFoundry() {
  const typical = ["Sells campaigns", "Optimizes for clicks", "Short-term thinking", "One-size-fits-all"];
  const foundry = ["Builds brands", "Optimizes for connection", "Long-term partnership", "Built around your vision"];
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-white/60">WHY FOUNDRY</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display font-bold text-white text-[clamp(2.4rem,6vw,4.2rem)]">
              Not another agency.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-7 max-w-2xl mx-auto space-y-4 text-white/80 leading-relaxed">
              <p>Most agencies focus on campaigns. We focus on building brands.</p>
              <p>
                Our goal isn't simply to market businesses. Our goal is to help founders
                create brands that stand out, connect with people, and grow sustainably.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8">
              <p className="text-xs tracking-[0.25em] text-white/50">TYPICAL AGENCY</p>
              <ul className="mt-6 space-y-4">
                {typical.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-[#ffec4e]/40 bg-white/[0.06] p-8 relative overflow-hidden shadow-[0_0_40px_rgba(255,236,78,0.12)]">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#ffec4e]/20 blur-3xl" />
              <p className="text-xs tracking-[0.25em] text-[#ffec4e]">FOUNDRY STUDIO</p>
              <ul className="mt-6 space-y-4 relative">
                {foundry.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffec4e]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Who We Help ---------- */
function WhoWeHelp() {
  const cards = [
    { title: "Startups", desc: "Early-stage founders building something new." },
    { title: "D2C Brands", desc: "Consumer brands looking to launch and scale." },
    { title: "Personal Brands", desc: "Creators, experts, and entrepreneurs building authority." },
    { title: "Growing Businesses", desc: "Businesses looking to evolve and expand." },
  ];
  return (
    <section id="who-we-help" className="relative py-28 md:py-36">
      <SparkleField count={5} />
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-white/60">WHO WE HELP</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display font-bold text-white text-[clamp(2.4rem,6vw,4.2rem)]">
              Built for ambitious founders.
            </h2>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="group h-full rounded-3xl border border-white/15 bg-white/[0.04] p-7 hover:bg-white/[0.08] hover:border-[#ffec4e]/40 hover:-translate-y-1.5 transition-all duration-400">
                <div className="h-9 w-9 rounded-full border border-white/25 group-hover:border-[#ffec4e] group-hover:bg-[#ffec4e]/15 transition-colors duration-400" />
                <h3 className="mt-6 font-display font-bold text-white">{c.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact / Let's Build ---------- */
function Contact() {
  const channels = [
    { label: "Instagram", value: "@foundry.studio", href: "https://instagram.com/foundry.studio" },
    { label: "LinkedIn", value: "/foundry.studio", href: "https://linkedin.com/company/foundry.studio" },
    { label: "Email", value: "hello@foundrystudio.in", href: "mailto:hello@foundrystudio.in" },
  ];
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <FSWatermark className="absolute right-0 -bottom-10 -z-0" />
      <SparkleField count={7} />
      <div className="mx-auto max-w-5xl px-6 md:px-10 relative text-center">
        <Reveal>
          <h2 className="font-display font-bold text-white text-[clamp(2.6rem,7vw,5rem)] leading-[1.03]">
            Let's build
            <br />
            something great.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 max-w-xl mx-auto text-white/80 text-lg leading-relaxed">
            Whether you're starting with an idea or growing an existing business,
            Foundry Studio is ready to help.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 grid sm:grid-cols-3 gap-5">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-7 hover:border-[#ffec4e]/60 hover:bg-white/[0.07] transition-all duration-300"
              >
                <p className="text-xs tracking-[0.25em] text-white/50 group-hover:text-[#ffec4e] transition-colors">
                  {c.label.toUpperCase()}
                </p>
                <p className="mt-3 text-white font-medium">{c.value}</p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <a
            href="mailto:hello@foundrystudio.in"
            className="mt-14 inline-flex items-center gap-2 rounded-full bg-[#ffec4e] px-9 py-4 text-sm font-semibold text-[#3a2a5e] hover:scale-105 hover:shadow-[0_0_36px_rgba(255,236,78,0.55)] transition-all duration-300"
          >
            Let's Talk
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
        <p>© {new Date().getFullYear()} Foundry Studio. All rights reserved.</p>
        <p className="tracking-[0.2em] text-xs">WHERE IDEAS BECOME BRANDS</p>
      </div>
    </footer>
  );
}

/* ---------- Root ---------- */
export default function FoundryStudio() {
  return (
    <div className="relative min-h-screen w-full bg-[#c5aded] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }
        body, .root-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .sparkle {
          position: absolute;
          animation: floatSparkle 6s ease-in-out infinite;
          filter: drop-shadow(0 0 6px rgba(255,236,78,0.7));
        }
        @keyframes floatSparkle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-14px) rotate(20deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sparkle { animation: none !important; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 85% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(50% 40% at 10% 100%, rgba(255,236,78,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <Nav />
      <main className="font-sans">
        <Hero />
        <About />
        <WhatWeDo />
        <Process />
        <WhyFoundry />
        <WhoWeHelp />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
