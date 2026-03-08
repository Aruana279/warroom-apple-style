import { Wifi, WifiOff, Clock, Shield } from "lucide-react";
import type { SessionStatus } from "@/types/warroom";

interface StatusBarProps {
  status: SessionStatus;
  agentCount: number;
  sessionTime: string;
}

const statusConfig: Record<SessionStatus, { label: string; color: string }> = {
  idle: { label: "STANDBY", color: "text-muted-foreground" },
  connecting: { label: "CONNECTING", color: "text-accent" },
  active: { label: "LIVE", color: "text-primary" },
  error: { label: "ERROR", color: "text-destructive" },
  ended: { label: "SESSION ENDED", color: "text-muted-foreground" },
};

export function StatusBar({ status, agentCount, sessionTime }: StatusBarProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 font-mono text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {status === "active" ? (
            <Wifi className="w-3.5 h-3.5 text-primary" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span className={`font-semibold tracking-widest ${config.color}`}>
            {status === "active" && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
            )}
            {config.label}
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>{agentCount} AGENTS</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{sessionTime}</span>
      </div>
    </div>
  );
}
