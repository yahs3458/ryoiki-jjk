import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { CSSProperties } from "react";
import DomainButton from "./DomainButton";
import SoundToggle from "./SoundToggle";

const TICKER = ["領域展開", "DOMAIN EXPANSION", "無量空処", "UNLIMITED VOID", "伏魔御厨子", "MALEVOLENT SHRINE", "天与呪縛", "HEAVENLY RESTRICTION"];

// fixed (not random) so the server render is stable
const SLASHES = [
  [8, 20, 60, -24, 0], [30, 62, 55, 18, 0.4], [-5, 44, 70, -8, 0.9], [40, 12, 45, 32, 1.3],
  [12, 80, 50, -30, 1.7], [50, 35, 50, 12, 2.1], [20, 52, 65, -14, 0.6], [55, 75, 40, -38, 1.5],
];

const FIGHTS = [
  {
    title: "Gojo vs Toji",
    arc: "Hidden Inventory arc · anime season 2",
    spoiler:
      "Toji’s Inverted Spear of Heaven breaks through Infinity and he takes Gojo down — until Gojo masters Reverse Cursed Technique, awakens, and ends the rematch with Hollow Purple.",
    accent: "text-toji",
  },
  {
    title: "Sukuna vs Mahoraga",
    arc: "Shibuya Incident · anime season 2",
    spoiler:
      "Sukuna faces the adapting shikigami Megumi summoned — and settles it by unleashing Malevolent Shrine across Shibuya.",
    accent: "text-sukuna",
  },
  {
    title: "Gojo vs Sukuna",
    arc: "Shinjuku Showdown · manga",
    spoiler:
      "The strongest of today against the strongest in history. Domains clash, collapse and return — and the result reshapes the entire story.",
    accent: "text-purple",
  },
];

const chapterTitle = "font-display text-[clamp(4rem,13vw,11rem)] leading-[0.82] tracking-[-0.01em] uppercase";

// Mood photos (Unsplash licence — free to use): the *world* of each character, never the copyrighted character art.
// To swap in licensed art or fan art you have permission for, drop gojo / sukuna / toji (.webp/.jpg/.png)
// into public/chars/ and put the artist's name in CREDITS.
const MOOD: Record<string, string> = {
  gojo: "photo-1677357623576-7c8aab08da22",
  sukuna: "photo-1565200678343-8f2d20dc95d9",
  toji: "photo-1583684977172-528983104c31",
};
const CREDITS: Record<string, string> = { gojo: "", sukuna: "", toji: "" };
const unsplash = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

function art(name: string) {
  const file = ["webp", "jpg", "png"].map((ext) => `${name}.${ext}`).find((f) => existsSync(join(process.cwd(), "public", "chars", f)));
  return file ? { src: `/chars/${file}`, credit: CREDITS[name] && `Art: ${CREDITS[name]}` } : { src: unsplash(MOOD[name]), credit: "Photo: Unsplash" };
}

function Portrait({ name, kanji, color }: { name: string; kanji: string; color: string }) {
  const { src, credit } = art(name);
  return (
    <figure className="reveal relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] border" style={{ borderColor: `var(--color-${color})` }}>
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="drift object-cover object-top" />
      <div className="absolute inset-0 bg-linear-to-t from-void via-transparent to-transparent" />
      <div className="absolute inset-0 mix-blend-color opacity-25" style={{ background: `var(--color-${color})` }} />
      <p className="absolute top-5 right-4 font-kanji text-4xl [writing-mode:vertical-rl] drop-shadow-[0_2px_12px_black]" style={{ color: `var(--color-${color})` }}>
        {kanji}
      </p>
      {credit && <figcaption className="absolute bottom-4 left-5 font-mono text-[0.65rem] text-muted">{credit}</figcaption>}
    </figure>
  );
}

function Moves({ items, color }: { items: [string, string, string][]; color: string }) {
  return (
    <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {items.map(([kanji, name, body]) => (
        <li key={name} className="reveal bg-paper-2 p-6">
          <p className={`font-kanji text-2xl ${color}`}>{kanji}</p>
          <h4 className="mt-2 font-display text-2xl tracking-[0.04em] uppercase">{name}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}

function Quote({ text, by, color }: { text: string; by: string; color: string }) {
  return (
    <figure className="reveal mt-10 border-l-4 border-current pl-6" style={{ color: `var(--color-${color})` }}>
      <blockquote className="font-display text-[clamp(1.9rem,3.2vw+0.8rem,3.2rem)] leading-[1.02] uppercase text-ink">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 font-mono text-xs tracking-[0.2em] uppercase">— {by}</figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="grain">
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <a href="#" className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="font-kanji text-xl text-purple">領域</span>
            <span className="font-display text-xl tracking-[0.2em]">RYŌIKI</span>
          </a>
          <div className="flex items-center gap-5 font-display text-sm tracking-[0.14em] uppercase sm:gap-8">
            <a href="#gojo" className="hidden transition-colors hover:text-gojo sm:inline">Gojo</a>
            <a href="#sukuna" className="hidden transition-colors hover:text-sukuna sm:inline">Sukuna</a>
            <a href="#toji" className="hidden transition-colors hover:text-toji sm:inline">Toji</a>
            <SoundToggle />
          </div>
        </nav>
      </header>

      <main>
        {/* hero: three names, three colours, one button */}
        <section className="relative overflow-hidden">
          <p
            aria-hidden
            className="pointer-events-none absolute -top-6 right-[-4vw] font-kanji text-[32vw] leading-none text-transparent opacity-40 [-webkit-text-stroke:1px_var(--color-rule)] select-none"
          >
            呪術
          </p>
          <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-10 md:pt-24 md:pb-28">
            <p className="rise font-mono text-xs tracking-[0.3em] text-muted uppercase">A Jujutsu Kaisen fan archive</p>
            <h1 className="mt-6 font-display text-[clamp(3.4rem,11vw,9.5rem)] leading-[0.86] uppercase">
              <span className="rise block text-gojo" style={{ animationDelay: "80ms" }}>The strongest.</span>
              <span className="rise block text-sukuna" style={{ animationDelay: "180ms" }}>The King of Curses.</span>
              <span className="rise block text-toji" style={{ animationDelay: "280ms" }}>The Sorcerer Killer.</span>
            </h1>
            <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "380ms" }}>
              Three of the most talked-about fighters in Jujutsu Kaisen — their techniques, their
              domains, their fights. Spoilers stay hidden until you ask for them.
            </p>
            <div className="rise mt-10 flex flex-wrap items-center gap-5" style={{ animationDelay: "480ms" }}>
              <DomainButton domain="gojo" />
              <a href="#gojo" className="font-display tracking-[0.14em] whitespace-nowrap uppercase underline decoration-2 underline-offset-8 hover:text-gojo">
                Meet the three ↓
              </a>
            </div>
          </div>
        </section>

        <div className="-rotate-1 overflow-hidden border-y border-rule bg-purple py-3 text-ink" aria-hidden>
          <ul className="marquee flex w-max gap-8 font-display text-xl tracking-[0.12em] whitespace-nowrap">
            {[...TICKER, ...TICKER].map((t, i) => (
              <li key={i} className={/[A-Z]/.test(t) ? "" : "font-kanji"}>
                {t} <span className="opacity-50">✦</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── GOJO ── */}
        <section id="gojo" className="scroll-mt-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-10 md:py-32 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <p className="reveal font-kanji text-3xl text-gojo">五条悟</p>
              <h2 className={`reveal mt-2 text-gojo ${chapterTitle}`}>Satoru Gojo</h2>
              <p className="reveal mt-6 font-mono text-xs tracking-[0.2em] text-muted uppercase">The Strongest · Special Grade Sorcerer · Tokyo Jujutsu High teacher</p>
              <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">
                Born with both the <span className="text-ink">Six Eyes</span> and the{" "}
                <span className="text-ink">Limitless</span> — a combination no one had seen in
                centuries. The Six Eyes let him see cursed energy in perfect detail and use the
                Limitless with almost zero waste. He wears a blindfold because seeing everything,
                all the time, is exhausting.
              </p>
              <Quote color="gojo" text="Throughout heaven and earth, I alone am the honored one." by="Satoru Gojo · Hidden Inventory arc" />
              <Moves
                color="text-gojo"
                items={[
                  ["無下限", "Infinity", "An endless space between him and anything that approaches. Attacks slow forever and never land."],
                  ["蒼", "Blue (Lapse)", "Amplified Limitless: an attracting force that pulls everything toward a point."],
                  ["赫", "Red (Reversal)", "Inverted Limitless, powered by Reverse Cursed Technique: a blast of pure repulsion."],
                  ["茈", "Hollow Purple", "Blue and Red collide into an imaginary mass that erases whatever it passes through."],
                ]}
              />
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <Portrait name="gojo" kanji="五条悟" color="gojo" />
              <div className="reveal relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] border border-rule bg-[radial-gradient(circle_at_50%_50%,var(--color-paper-2),var(--color-void))]">
                <span className="orb-blue absolute size-[38%] rounded-full bg-gojo shadow-[0_0_60px_10px_var(--color-gojo)] mix-blend-screen" />
                <span className="orb-red absolute size-[38%] rounded-full bg-sukuna shadow-[0_0_60px_10px_var(--color-sukuna)] mix-blend-screen" />
                <span className="orb-purple absolute size-[52%] rounded-full bg-purple shadow-[0_0_90px_30px_var(--color-purple)]" />
                <p className="absolute bottom-5 left-0 w-full text-center font-mono text-xs tracking-[0.2em] text-muted uppercase">Blue + Red = Hollow Purple</p>
              </div>
              <div className="reveal mt-6 rounded-2xl border border-gojo/40 p-6">
                <p className="font-mono text-xs tracking-[0.2em] text-gojo uppercase">Domain</p>
                <p className="mt-2 font-display text-3xl uppercase">Unlimited Void <span className="font-kanji text-xl text-muted">無量空処</span></p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Traps the target inside the Limitless itself — a space-like void that floods the mind
                  with infinite information until it can&rsquo;t act at all.
                </p>
                <div className="mt-6">
                  <DomainButton domain="gojo" label="Expand" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUKUNA ── */}
        <section id="sukuna" className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,var(--color-paper),var(--color-blood)_60%,var(--color-paper))]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {SLASHES.map(([l, t, w, r, d], i) => (
              <span key={i} className="slash" style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, "--r": `${r}deg`, animationDelay: `${d}s` } as CSSProperties} />
            ))}
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-10 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Portrait name="sukuna" kanji="両面宿儺" color="sukuna" />
              <div className="reveal rounded-[2rem] border border-sukuna/50 bg-void/70 p-8 backdrop-blur">
                <p className="font-kanji text-[clamp(4rem,10vw,7rem)] leading-none text-sukuna">宿儺</p>
                <p className="mt-6 font-mono text-xs tracking-[0.2em] text-sukuna uppercase">Domain</p>
                <p className="mt-2 font-display text-3xl uppercase">Malevolent Shrine <span className="font-kanji text-xl text-muted">伏魔御厨子</span></p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The rare domain with no barrier at all. Instead of trapping you, it draws its effect
                  straight onto the world — and everything in range is cut, again and again.
                </p>
                <div className="mt-6">
                  <DomainButton domain="sukuna" label="Expand" />
                </div>
              </div>
            </div>
            <div>
              <p className="reveal font-kanji text-3xl text-sukuna">両面宿儺</p>
              <h2 className={`reveal mt-2 text-sukuna ${chapterTitle}`}>Ryomen Sukuna</h2>
              <p className="reveal mt-6 font-mono text-xs tracking-[0.2em] text-muted uppercase">King of Curses · Strongest sorcerer of the Heian era</p>
              <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">
                A four-armed, two-faced sorcerer from a thousand years ago, so feared that he became a
                curse himself. His remains survived as twenty cursed fingers — until Yuji Itadori
                swallowed one, and the King woke up inside him.
              </p>
              <Quote color="sukuna" text="Stand proud. You are strong." by="Ryomen Sukuna · to Jogo, Shibuya Incident" />
              <Moves
                color="text-sukuna"
                items={[
                  ["解", "Dismantle", "Invisible, ranged slashes. Inside his domain they rain down on everything without cursed energy."],
                  ["捌", "Cleave", "Adjusts itself to the target’s toughness and cursed energy, then cuts through in one stroke."],
                  ["開", "Open (Fuga)", "A flame arrow drawn from his hands. Rarely used — when it is, everything burns."],
                  ["反転", "Reverse Cursed Technique", "Heals almost any wound in an instant. One of the most refined in the series."],
                ]}
              />
            </div>
          </div>
        </section>

        {/* ── TOJI ── */}
        <section id="toji" className="scroll-mt-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-10 md:py-32 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <p className="reveal font-kanji text-3xl text-toji">伏黒甚爾</p>
              <h2 className={`reveal mt-2 text-toji ${chapterTitle}`}>Toji Fushiguro</h2>
              <p className="reveal mt-6 font-mono text-xs tracking-[0.2em] text-muted uppercase">The Sorcerer Killer · Megumi&rsquo;s father · Zenin clan outcast</p>
              <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted">
                Born with a <span className="text-ink">Heavenly Restriction</span> that took away
                every trace of cursed energy — and gave back a body beyond human limits. The jujutsu
                world treated him as worthless. He made a career out of proving them wrong, one
                sorcerer at a time.
              </p>
              <Quote color="toji" text="Not Zen'in, huh? Good for you." by="Toji Fushiguro · Shibuya Incident" />
              <Moves
                color="text-toji"
                items={[
                  ["天逆鉾", "Inverted Spear of Heaven", "A special-grade cursed tool that cancels any cursed technique it touches — even Infinity."],
                  ["游雲", "Playful Cloud", "A three-section staff with no technique of its own. Its power is the wielder’s raw strength."],
                  ["釈魂刀", "Split Soul Katana", "Ignores the body’s durability and cuts the soul directly."],
                  ["呪霊", "Storage curse", "A worm-like curse he keeps wrapped around his body to carry his arsenal unseen."],
                ]}
              />
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <Portrait name="toji" kanji="伏黒甚爾" color="toji" />
              <div className="reveal relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] border border-rule bg-paper-2">
                <svg viewBox="0 0 200 200" className="turn size-[70%] text-toji" aria-hidden>
                  <path d="M100 8 L108 70 L104 150 L100 192 L96 150 L92 70 Z" fill="currentColor" opacity="0.9" />
                  <path d="M92 70 Q70 60 66 40 Q84 52 100 52 Q116 52 134 40 Q130 60 108 70 Z" fill="currentColor" opacity="0.6" />
                  <rect x="88" y="150" width="24" height="8" rx="2" fill="currentColor" />
                </svg>
                <p className="absolute bottom-5 left-0 w-full text-center font-mono text-xs tracking-[0.2em] text-muted uppercase">Inverted Spear of Heaven</p>
              </div>
              <div className="reveal mt-6 rounded-2xl border border-toji/40 p-6">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-xs tracking-[0.2em] text-toji uppercase">Cursed energy</p>
                  <p className="font-display text-3xl">0%</p>
                </div>
                <svg viewBox="0 0 400 40" className="mt-4 w-full text-toji" aria-hidden>
                  <path className="flatline" d="M0 20 H400" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  No cursed energy means no domain of his own — and nothing for a domain&rsquo;s
                  sure-hit to lock on to. So what happens if Toji tries?
                </p>
                <div className="mt-6">
                  <DomainButton domain="toji" label="Try it" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* fights, spoilers behind a native <details> */}
        <section className="relative overflow-hidden border-t border-rule bg-paper-2">
          <Image src={unsplash("photo-1573456373835-579c408de263", 2000)} alt="" fill sizes="100vw" className="drift object-cover opacity-30" />
          <div className="absolute inset-0 bg-linear-to-b from-paper via-paper/70 to-paper" />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-10 md:py-32">
            <h2 className="reveal font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] uppercase">Iconic fights</h2>
            <p className="reveal mt-4 max-w-md text-muted">Spoilers are blurred. Tap a card when you&rsquo;re caught up.</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {FIGHTS.map((f) => (
                <details key={f.title} className="reveal group rounded-3xl border border-rule bg-paper p-7">
                  <summary className="cursor-pointer">
                    <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{f.arc}</p>
                    <h3 className={`mt-3 font-display text-4xl uppercase ${f.accent}`}>{f.title}</h3>
                    <p className="mt-6 text-sm leading-relaxed text-muted blur-sm select-none group-open:hidden" aria-hidden>
                      {f.spoiler}
                    </p>
                    <span className="mt-4 inline-block font-mono text-xs tracking-[0.14em] uppercase underline underline-offset-4 group-open:hidden">
                      Reveal spoiler
                    </span>
                  </summary>
                  <p className="mt-6 text-sm leading-relaxed">{f.spoiler}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-10">
          <p className="font-display text-[clamp(4rem,16vw,13rem)] leading-[0.8] uppercase">
            <span className="text-gojo">Ry</span>
            <span className="text-purple">ō</span>
            <span className="text-sukuna">i</span>
            <span className="text-toji">ki</span>
          </p>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
            Unofficial fan site made for fun. Not affiliated with or endorsed by the creators.
            Jujutsu Kaisen and its characters belong to Gege Akutami, Shueisha and MAPPA. All
            visuals here are original, built in code.
          </p>
        </div>
      </footer>
    </div>
  );
}
