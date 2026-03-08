import type { Agent } from "@/types/warroom";
import { Hand } from "lucide-react";

const roleColors: Record<string, string> = {
  chairperson: "border-accent text-accent",
  analyst: "border-glow-info text-glow-info",
  advocate: "border-primary text-primary",
  critic: "border-destructive text-destructive",
  secretary: "border-muted-foreground text-muted-foreground",
};

const roleEmoji: Record<string, string> = {
  chairperson: "👑",
  analyst: "🔬",
  advocate: "⚖️",
  critic: "🎯",
  secretary: "📝",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const color = roleColors[agent.role] || "border-border text-foreground";
  const isSpeaking = agent.speakingState === "speaking";
  const isThinking = agent.speakingState === "thinking";

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
        isSpeaking
          ? "border-primary bg-primary/5 glow-primary"
          : "border-border bg-card/50 hover:border-border/80"
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${color} bg-secondary/50`}
        >
          {roleEmoji[agent.role] || "🤖"}
        </div>
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-ring" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary animate-pulse" />
          </>
        )}
        {isThinking && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent animate-pulse" />
        )}
      </div>

      {/* Name & role */}
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground truncate max-w-[80px]">{agent.name}</p>
        <p className={`text-[10px] uppercase tracking-wider font-mono ${color}`}>{agent.role}</p>
      </div>

      {/* Hand raised */}
      {agent.isHandRaised && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <Hand className="w-3 h-3 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}
