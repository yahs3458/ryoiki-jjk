"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { playDomain } from "./sound";

type Domain = "gojo" | "sukuna" | "toji";

// long enough for the spoken lines to finish (see sound.ts)
const LENGTH: Record<Domain, number> = { gojo: 9000, sukuna: 7500, toji: 7500 };
const WORDS = ["∞", "INFINITY", "無量空処", "LIMITLESS", "六眼", "INFORMATION", "∞∞∞", "蒼", "赫", "茈", "PERCEIVE", "EVERYTHING", "FOREVER"];

type Particles = {
  stars: { l: number; t: number; s: number; d: number }[];
  rays: { r: number; d: number }[];
  cuts: { l: number; t: number; w: number; r: number; d: number }[];
  lines: string[];
};

// generated on click, never during render, so server and client markup always agree
function roll(): Particles {
  const R = Math.random;
  const pick = () => Array.from({ length: 6 }, () => WORDS[Math.floor(R() * WORDS.length)]).join("  ");
  return {
    stars: Array.from({ length: 140 }, () => ({ l: R() * 100, t: R() * 100, s: R() * 2.4 + 0.6, d: R() * 2.4 })),
    rays: Array.from({ length: 40 }, () => ({ r: R() * 360, d: R() * 1.6 })),
    cuts: Array.from({ length: 30 }, () => ({ l: R() * 90 - 10, t: R() * 100, w: R() * 45 + 20, r: R() * 140 - 70, d: R() * 1.1 })),
    lines: Array.from({ length: 40 }, pick),
  };
}

function Shrine() {
  return (
    <svg viewBox="0 0 400 260" className="absolute bottom-0 left-1/2 w-[min(90vw,720px)] -translate-x-1/2 fill-blood" aria-hidden>
      <path d="M40 250h320v10H40z" />
      <path d="M70 120h260l-30-34H100z" />
      <path d="M96 86h208l-26-30H122z" />
      <path d="M140 56h120l-20-26h-80z" />
      <path d="M150 30l-30-28 50 22zM250 30l30-28-50 22z" />
      <path d="M100 120h18v130h-18zM282 120h18v130h-18zM180 120h40v130h-40z" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={64 + i * 34} cy={238} r={11} />
      ))}
    </svg>
  );
}

export default function DomainButton({ domain, label = "Domain Expansion", className = "" }: { domain: Domain; label?: string; className?: string }) {
  const [state, setState] = useState<{ x: string; y: string; p: Particles } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  const close = () => {
    speechSynthesis?.cancel();
    setState(null);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!state) return;
    const end = () => {
      speechSynthesis?.cancel();
      setState(null);
      trigger.current?.focus();
    };
    closer.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && end();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(end, LENGTH[domain]);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [state, domain]);

  function open(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setState({
      x: `${(((r.left + r.width / 2) / innerWidth) * 100).toFixed(1)}%`,
      y: `${(((r.top + r.height / 2) / innerHeight) * 100).toFixed(1)}%`,
      p: roll(),
    });
    playDomain(domain);
  }

  const tone = { gojo: "bg-gojo text-void", sukuna: "bg-sukuna text-ink", toji: "bg-toji text-void" }[domain];

  return (
    <>
      <button
        ref={trigger}
        onClick={open}
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-display text-lg tracking-[0.12em] whitespace-nowrap uppercase transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 ${tone} ${className}`}
      >
        <span className="font-kanji text-base tracking-normal" aria-hidden>領域展開</span>
        {label}
      </button>

      {/* portal to <body>: a transformed ancestor (the hero's rise animation) would otherwise trap position:fixed */}
      {state && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={{ gojo: "Domain Expansion: Unlimited Void", sukuna: "Domain Expansion: Malevolent Shrine", toji: "Heavenly Restriction" }[domain]}
          onClick={close}
          className="fade-in fixed inset-0 z-50 cursor-pointer overflow-hidden bg-void/90"
          style={{ "--x": state.x, "--y": state.y } as CSSProperties}
        >
          {/* the chant, before the world changes */}
          <div className="chant pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-kanji text-[clamp(3rem,10vw,8rem)] leading-none">領域展開</p>
              <p className="mt-4 font-display text-xl tracking-[0.3em] text-muted">DOMAIN EXPANSION</p>
            </div>
          </div>

          {domain === "gojo" && (
            <div className="domain absolute inset-0 overflow-hidden bg-void">
              {state.p.stars.map((s, i) => (
                <span key={i} className="star" style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
              ))}
              {state.p.rays.map((r, i) => (
                <span key={i} className="warp" style={{ "--r": `${r.r}deg`, animationDelay: `${r.d}s` } as CSSProperties} />
              ))}
              <div className="info pointer-events-none absolute inset-x-0 top-0 font-mono text-xs leading-6 text-gojo/25 select-none">
                {[...state.p.lines, ...state.p.lines].map((l, i) => (
                  <p key={i} className={i % 2 ? "text-right" : ""}>{l}</p>
                ))}
              </div>
              <div className="absolute top-1/2 left-1/2 size-[42vmin] -translate-x-1/2 -translate-y-1/2">
                <div className="hole absolute inset-0 rounded-full" />
                <div className="absolute inset-[18%] rounded-full bg-void shadow-[0_0_80px_20px_var(--color-gojo)]" />
              </div>
              <div className="title-in absolute inset-x-0 bottom-[10%] text-center">
                <p className="font-kanji text-[clamp(3rem,9vw,7rem)] leading-none drop-shadow-[0_0_30px_var(--color-gojo)]">無量空処</p>
                <p className="mt-3 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-[0.2em]">UNLIMITED VOID</p>
                <p className="mt-2 text-sm text-muted">Muryōkūsho · infinite information, zero movement</p>
              </div>
            </div>
          )}

          {domain === "sukuna" && (
            <div className="domain absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_100%,var(--color-blood),var(--color-void)_70%)]">
              <div className="shake absolute inset-0">
                <Shrine />
                {state.p.cuts.map((c, i) => (
                  <span
                    key={i}
                    className="cut"
                    style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}vw`, "--r": `${c.r}deg`, animationDelay: `${1.6 + c.d}s` } as CSSProperties}
                  />
                ))}
                <div className="title-in absolute inset-x-0 top-[14%] text-center">
                  <p className="font-kanji text-[clamp(2.6rem,8vw,6.5rem)] leading-none text-sukuna drop-shadow-[0_0_30px_var(--color-sukuna)]">伏魔御厨子</p>
                  <p className="mt-3 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-[0.2em]">MALEVOLENT SHRINE</p>
                  <p className="mt-2 text-sm text-muted">Fukuma Mizushi · no barrier, only Dismantle and Cleave</p>
                </div>
              </div>
            </div>
          )}

          {domain === "toji" && (
            <div className="domain absolute inset-0 overflow-hidden bg-void">
              {["half-top", "half-bottom"].map((half) => (
                <div key={half} className={`${half} absolute inset-0 grid place-items-center bg-paper-2`}>
                  <div className="text-center">
                    <p className="glitch font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-[0.06em]">DOMAIN EXPANSION</p>
                    <p className="mt-4 font-mono text-sm text-sukuna">ERROR · TARGET CURSED ENERGY: 0%</p>
                  </div>
                </div>
              ))}
              <span className="blade" />
              <div className="title-in absolute inset-0 grid place-items-center text-center" style={{ animationDelay: "3000ms" }}>
                <div className="px-6">
                  <p className="font-kanji text-[clamp(2.6rem,8vw,6rem)] leading-none text-toji">天与呪縛</p>
                  <p className="mt-3 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-[0.2em]">HEAVENLY RESTRICTION</p>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    No cursed energy. No domain. And nothing for anyone else&rsquo;s domain to lock on to.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            ref={closer}
            onClick={close}
            className="absolute right-4 bottom-4 z-10 rounded-full border border-ink/30 bg-void/60 px-4 py-2 text-xs tracking-[0.14em] uppercase backdrop-blur hover:border-ink"
          >
            Release domain · Esc
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}
