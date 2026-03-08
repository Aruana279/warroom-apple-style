import type { Agent } from "@/types/warroom";
import { Hand } from "lucide-react";

const roleInitials: Record<string, string> = {
  chairperson: "CH",
  analyst: "AN",
  advocate: "AD",
  critic: "CR",
  secretary: "SC",
};

const roleColor: Record<string, string> = {
  chairperson: "bg-primary text-primary-foreground",
  analyst: "bg-success text-success-foreground",
  advocate: "bg-warning text-warning-foreground",
  critic: "bg-destructive text-destructive-foreground",
  secretary: "bg-muted-foreground text-background",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const isSpeaking = agent.speakingState === "speaking";
  const isThinking = agent.speakingState === "thinking";
  const color = roleColor[agent.role] || "bg-secondary text-foreground";

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
        isSpeaking
          ? "border-primary/30 bg-primary/5 shadow-sm"
          : "border-border bg-card hover:bg-accent"
      }`}
    >
      <div className="relative">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-semibold ${
            isSpeaking ? color : "bg-secondary text-foreground"
          }`}
        >
          {roleInitials[agent.role] || "??"}
        </div>
        {isSpeaking && (
          <div className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse-ring" />
        )}
        {isThinking && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-warning border-2 border-card animate-gentle-pulse" />
        )}
      </div>

      <div className="text-center">
        <p className="text-xs font-medium text-foreground truncate max-w-[80px]">{agent.name}</p>
        <p className="text-[10px] text-muted-foreground capitalize">{agent.role}</p>
      </div>

      {agent.isHandRaised && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
          <Hand className="w-3 h-3 text-warning-foreground" />
        </div>
      )}
    </div>
  );
}
