import { useEffect, useRef } from "react";
import type { Agent, UploadedDocument } from "@/types/warroom";
import { FileText, Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const roleEmoji: Record<string, string> = {
  chairperson: "👑",
  analyst: "🔬",
  advocate: "⚖️",
  critic: "🎯",
  secretary: "📝",
};

const roleGlow: Record<string, string> = {
  chairperson: "border-accent shadow-[0_0_12px_hsl(var(--glow-accent)/0.3)]",
  analyst: "border-glow-info shadow-[0_0_12px_hsl(var(--glow-info)/0.3)]",
  advocate: "border-primary shadow-[0_0_12px_hsl(var(--glow-primary)/0.3)]",
  critic: "border-destructive shadow-[0_0_12px_hsl(var(--glow-danger)/0.3)]",
  secretary: "border-muted-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  uploading: <Loader2 className="w-3 h-3 animate-spin text-accent" />,
  processing: <Loader2 className="w-3 h-3 animate-spin text-primary" />,
  analyzed: <CheckCircle className="w-3 h-3 text-primary" />,
  error: <AlertCircle className="w-3 h-3 text-destructive" />,
};

interface WarTableProps {
  agents: Agent[];
  documents: UploadedDocument[];
  onUpload: (file: File) => void;
  sessionStatus: string;
}

export function WarTable({ agents, documents, onUpload, sessionStatus }: WarTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draw animated radar/table effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let angle = 0;

    const draw = () => {
      const w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      const h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      const cx = cw / 2;
      const cy = ch / 2;
      const maxR = Math.min(cw, ch) * 0.38;

      ctx.clearRect(0, 0, cw, ch);

      // Concentric rings
      for (let i = 1; i <= 3; i++) {
        const r = maxR * (i / 3);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(160, 80%, 45%, ${0.08 + i * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cross lines
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.strokeStyle = "hsla(160, 80%, 45%, 0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radar sweep
      if (sessionStatus === "active") {
        angle += 0.01;
      // Radar sweep effect
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, angle, angle + 0.5);
        ctx.closePath();
        const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        sweepGrad.addColorStop(0, "hsla(160, 80%, 45%, 0.15)");
        sweepGrad.addColorStop(1, "hsla(160, 80%, 45%, 0)");
        ctx.fillStyle = sweepGrad;
        ctx.fill();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(160, 80%, 45%, 0.6)";
      ctx.fill();

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [sessionStatus]);

  // Position agents in a circle
  const agentPositions = agents.map((_, i) => {
    const angleStep = (Math.PI * 2) / agents.length;
    const a = angleStep * i - Math.PI / 2;
    const radiusPercent = 34;
    return {
      left: `${50 + radiusPercent * Math.cos(a)}%`,
      top: `${50 + radiusPercent * Math.sin(a)}%`,
    };
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* War table area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Canvas background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Agent circles positioned around the table */}
        {agents.map((agent, i) => {
          const isSpeaking = agent.speakingState === "speaking";
          const isThinking = agent.speakingState === "thinking";
          const glow = roleGlow[agent.role] || "border-border";

          return (
            <div
              key={agent.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10 transition-all duration-500"
              style={{ left: agentPositions[i].left, top: agentPositions[i].top }}
            >
              {/* Avatar ring */}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-2 bg-card/80 backdrop-blur-sm transition-all duration-300 ${glow} ${
                    isSpeaking ? "scale-110" : ""
                  }`}
                >
                  {roleEmoji[agent.role] || "🤖"}
                </div>
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-ring" />
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary animate-pulse border-2 border-card" />
                  </>
                )}
                {isThinking && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent animate-pulse border-2 border-card" />
                )}
              </div>

              {/* Name plate */}
              <div className="glass-panel rounded-md px-2.5 py-1 text-center">
                <p className="text-[11px] font-semibold text-foreground">{agent.name}</p>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{agent.role}</p>
              </div>

              {/* Speaking indicator waves */}
              {isSpeaking && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="w-0.5 bg-primary rounded-full"
                      style={{
                        height: `${6 + Math.random() * 8}px`,
                        animation: `typing-dot ${0.4 + j * 0.1}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Center mission badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="w-20 h-20 rounded-full border border-primary/10 bg-primary/5 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary/20 font-mono">Q</span>
          </div>
        </div>
      </div>

      {/* Bottom document tray */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Artifacts
          </span>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            {documents.length} files
          </span>
        </div>

        <div className="flex items-center gap-2 p-3 overflow-x-auto">
          {/* Upload card */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 w-24 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/40 bg-secondary/20 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary">UPLOAD</span>
          </button>

          {/* Document cards */}
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="shrink-0 w-36 h-20 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 p-2.5 flex flex-col justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-1.5">
                {statusIcons[doc.status]}
                <span className="text-[10px] font-medium text-foreground truncate flex-1">{doc.name}</span>
              </div>
              {doc.summary ? (
                <p className="text-[9px] text-muted-foreground line-clamp-2 mt-auto">{doc.summary}</p>
              ) : (
                <p className="text-[9px] text-muted-foreground font-mono capitalize mt-auto">{doc.status}...</p>
              )}
            </div>
          ))}

          {documents.length === 0 && (
            <p className="text-[10px] text-muted-foreground font-mono py-4">
              No artifacts yet. Upload documents or agents will generate them during the session.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
