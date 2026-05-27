import { useEffect, useRef } from "react";
import "./EidScene.css";

// ─── Seeded random (reproducible layout) ───────────────────────────────────
function seeded(seed) {
  let s = (seed + 1) * 2654435761 + 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Static data (computed once) ──────────────────────────────────────────
const STARS = Array.from({ length: 185 }, (_, i) => {
  const r = seeded(i);
  return { id: i, x: r() * 100, y: r() * 72, sz: r() * 2.3 + 0.3, op: r() * 0.52 + 0.22, dur: r() * 4 + 2, del: r() * 12 };
});

const BG_COLORS = [
  "#FF6B6B","#FFD166","#06D6A0","#4CC9F0","#F72585","#FF9A3C",
  "#C77DFF","#43AA8B","#FF4D6D","#90E0EF","#FFB347","#CBFF8C","#E63946","#2EC4B6",
];
const BG_BALLOONS = Array.from({ length: 14 }, (_, i) => {
  const r = seeded(i * 31);
  return {
    id: i,
    x: 1.5 + i * (96 / 14) + r() * 3,
    color: BG_COLORS[i % BG_COLORS.length],
    sz: 26 + r() * 16,
    dur: 8 + r() * 8,
    del: r() * 7,
    sw: (18 + r() * 45) * (r() > 0.5 ? 1 : -1),
    bob: 1.5 + r() * 2,
    q: 3 + r() * 12,
  };
});

// ─── Hagia Sophia SVG (rendered once as a constant) ───────────────────────
function MosqueSVG() {
  const F = "#060312";
  return (
    <svg className="mosque" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMax meet">
      {/* Far-left minaret */}
      <rect x="72" y="80" width="22" height="300" fill={F} />
      <polygon points="72,80 83,38 94,80" fill={F} />
      <rect x="65" y="140" width="36" height="7" rx="3" fill={F} />
      <rect x="65" y="196" width="36" height="7" rx="3" fill={F} />
      <rect x="65" y="252" width="36" height="7" rx="3" fill={F} />
      {/* Near-left minaret */}
      <rect x="218" y="103" width="25" height="277" fill={F} />
      <polygon points="218,103 230.5,60 243,103" fill={F} />
      <rect x="211" y="166" width="38" height="7" rx="3" fill={F} />
      <rect x="211" y="224" width="38" height="7" rx="3" fill={F} />
      {/* Main platform */}
      <rect x="106" y="288" width="788" height="92" fill={F} />
      {/* Left side wall + rounded top */}
      <rect x="106" y="258" width="150" height="122" fill={F} />
      <ellipse cx="181" cy="258" rx="75" ry="24" fill={F} />
      {/* Right side wall + rounded top */}
      <rect x="744" y="258" width="150" height="122" fill={F} />
      <ellipse cx="819" cy="258" rx="75" ry="24" fill={F} />
      {/* Left exedra (half-dome) */}
      <ellipse cx="306" cy="288" rx="104" ry="70" fill={F} />
      <rect x="202" y="288" width="208" height="64" fill={F} />
      {/* Right exedra (half-dome) */}
      <ellipse cx="694" cy="288" rx="104" ry="70" fill={F} />
      <rect x="590" y="288" width="208" height="64" fill={F} />
      {/* Central drum */}
      <rect x="354" y="194" width="292" height="98" fill={F} />
      {/* Main dome */}
      <ellipse cx="500" cy="194" rx="162" ry="116" fill={F} />
      {/* Small dome decorations on drum */}
      <ellipse cx="383" cy="194" rx="20" ry="14" fill={F} />
      <ellipse cx="443" cy="191" rx="16" ry="11" fill={F} />
      <ellipse cx="557" cy="191" rx="16" ry="11" fill={F} />
      <ellipse cx="617" cy="194" rx="20" ry="14" fill={F} />
      {/* Near-right minaret */}
      <rect x="757" y="103" width="25" height="277" fill={F} />
      <polygon points="757,103 769.5,60 782,103" fill={F} />
      <rect x="751" y="166" width="38" height="7" rx="3" fill={F} />
      <rect x="751" y="224" width="38" height="7" rx="3" fill={F} />
      {/* Far-right minaret */}
      <rect x="906" y="80" width="22" height="300" fill={F} />
      <polygon points="906,80 917,38 928,80" fill={F} />
      <rect x="899" y="140" width="36" height="7" rx="3" fill={F} />
      <rect x="899" y="196" width="36" height="7" rx="3" fill={F} />
      <rect x="899" y="252" width="36" height="7" rx="3" fill={F} />
      {/* Ground strip */}
      <rect x="0" y="370" width="1000" height="10" fill="#020009" />
    </svg>
  );
}

// ─── A single balloon (reusable) ──────────────────────────────────────────
function Balloon({ color, width, height, className, style, bobDelay, children }) {
  return (
    <div className={className} style={style}>
      <div className="hero-bob" style={bobDelay ? { animationDelay: bobDelay } : undefined}>
        <div
          className="balloon-body"
          style={{
            width,
            height,
            background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.44) 0%, ${color} 52%, rgba(0,0,0,.16) 100%)`,
            boxShadow: `0 4px 28px ${color}60`,
          }}
        >
          <div className="balloon-shine" />
        </div>
      </div>
      <div className="balloon-knot" style={{ width: 8, height: 8, background: color }} />
      {children}
    </div>
  );
}

// ─── Wavy balloon string ───────────────────────────────────────────────────
function String({ width, height, cx, path }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto" }}>
      <path d={path} stroke="rgba(255,255,255,.28)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function EidScene() {
  const panelRef = useRef(null);

  // Remove the panel from the DOM after it's fully animated out
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onEnd = () => panel.remove();
    panel.addEventListener("animationend", onEnd);
    return () => panel.removeEventListener("animationend", onEnd);
  }, []);

  return (
    <div className="scene">
      {/* Stars */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.sz}px`, height: `${s.sz}px`,
            opacity: s.op,
            "--op": s.op,
            "--d": `${s.dur}s`,
            "--dl": `${s.del}s`,
          }}
        />
      ))}

      {/* Crescent moon in the sky — revealed by the zoom-out */}
      <div className="moon-wrap">
        <svg viewBox="-68 -68 136 136" width="136" height="136">
          <defs>
            <mask id="crescent-mask">
              <circle r="62" fill="white" />
              <circle cx="27" cy="-15" r="52" fill="black" />
            </mask>
          </defs>
          <circle r="62" fill="#FFE066" mask="url(#crescent-mask)" />
        </svg>
      </div>

      {/* Hagia Sophia silhouette */}
      <MosqueSVG />

      {/* Background balloons (looping, visible after panel reveals) */}
      {BG_BALLOONS.map((b) => (
        <div
          key={b.id}
          className="bg-balloon"
          style={{
            left: `${b.x}%`,
            "--du": `${b.dur}s`,
            "--de": `${b.del}s`,
            "--sw": `${b.sw}px`,
            "--bob": `${b.bob}s`,
          }}
        >
          <div className="bg-bob">
            <div
              style={{
                width: `${b.sz}px`, height: `${b.sz * 1.18}px`,
                borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
                background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.42) 0%, ${b.color} 52%, rgba(0,0,0,.16) 100%)`,
                boxShadow: `0 3px 10px ${b.color}50`,
                position: "relative",
              }}
            >
              <div className="balloon-shine" />
            </div>
          </div>
          <div className="balloon-knot" style={{ width: 5, height: 5, background: b.color }} />
          <svg width="14" height="38" viewBox="0 0 14 38" style={{ display: "block", margin: "0 auto" }}>
            <path d={`M7,0 Q${b.q / 2},19 7,38`} stroke="rgba(255,255,255,.26)" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
      ))}

      {/* Eid Mubarak text — fades in after reveal */}
      <div className="eid-text">
        <div className="arabic">عيد مبارك</div>
        <div className="latin">Eid Mubarak</div>
      </div>

      {/* Atmospheric fog */}
      <div className="fog" />

      {/* ── CLOSE-UP SNAPSHOT PANEL ────────────────────────────────────────
          Covers the full scene at the start. 
          Phase 1: 3 large balloons fill the frame (snapshot moment).
          Phase 2: Balloons drift away upward.
          Phase 3: Panel scales down → "camera zoom-out" reveals the scene.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="snapshot-panel" ref={panelRef}>
        <div className="vignette" />

        {/* LEFT balloon — coral red */}
        <Balloon
          className="hero-balloon"
          style={{ left: "1%", top: "6%", "--dx": "-38px", "--hbob": "2.1s" }}
          color="#FF6B6B"
          width="175px"
          height="207px"
        >
          <String width={30} height={430} path="M15,0 Q5,92 19,184 Q28,276 13,430" />
        </Balloon>

        {/* CENTER balloon — golden yellow (largest, closest) */}
        <Balloon
          className="hero-balloon"
          style={{ left: "30%", top: "-6%", "--dx": "14px", "--hbob": "2.7s" }}
          color="#FFD166"
          width="225px"
          height="266px"
        >
          <String width={38} height={410} path="M19,0 Q30,88 17,176 Q7,264 24,410" />
        </Balloon>

        {/* RIGHT balloon — sky blue */}
        <Balloon
          className="hero-balloon"
          style={{ left: "67%", top: "14%", "--dx": "30px", "--hbob": "1.95s" }}
          color="#4CC9F0"
          width="162px"
          height="191px"
          bobDelay="0.38s"
        >
          <String width={26} height={395} path="M13,0 Q21,82 11,164 Q3,246 17,395" />
        </Balloon>
      </div>
    </div>
  );
}
