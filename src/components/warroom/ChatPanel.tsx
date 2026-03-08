import { useRef, useEffect, useState } from "react";
import { Send, Bot, User } from "lucide-react";
import type { TranscriptEntry, VoteItem, VoteValue } from "@/types/warroom";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MinusCircle } from "lucide-react";

const roleColors: Record<string, string> = {
  chairperson: "bg-accent/10 border-accent/30",
  analyst: "bg-glow-info/10 border-glow-info/30",
  advocate: "bg-primary/10 border-primary/30",
  critic: "bg-destructive/10 border-destructive/30",
  secretary: "bg-muted/50 border-muted-foreground/30",
};

const roleTextColors: Record<string, string> = {
  chairperson: "text-accent",
  analyst: "text-glow-info",
  advocate: "text-primary",
  critic: "text-destructive",
  secretary: "text-muted-foreground",
};

interface ChatPanelProps {
  entries: TranscriptEntry[];
  vote: VoteItem | null;
  userVote?: VoteValue;
  onCastVote: (value: VoteValue) => void;
  onSendMessage?: (text: string) => void;
}

export function ChatPanel({ entries, vote, userVote, onCastVote, onSendMessage }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, vote]);

  const handleSend = () => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-widest font-mono text-muted-foreground">
          Session Feed
        </h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">
          {entries.length} messages
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 rounded-full border border-border bg-secondary/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-mono text-center">
              Awaiting session start...
            </p>
          </div>
        )}

        {entries.map((entry) => {
          const bubbleColor = roleColors[entry.role] || "bg-secondary/50 border-border";
          const nameColor = roleTextColors[entry.role] || "text-foreground";

          return (
            <div key={entry.id} className="animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className={`text-xs font-semibold ${nameColor}`}>{entry.agentName}</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className={`ml-7 rounded-lg border p-3 ${bubbleColor}`}>
                <p className="text-sm text-foreground/90 leading-relaxed">{entry.text}</p>
              </div>
            </div>
          );
        })}

        {/* Inline vote card */}
        {vote && vote.status === "open" && (
          <div className="animate-fade-in ml-7">
            <div className="rounded-lg border border-accent/40 bg-accent/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-accent font-mono uppercase">Motion to Vote</span>
              </div>
              <p className="text-sm font-medium text-foreground">{vote.motion}</p>
              <div className="flex gap-2">
                <Button
                  variant="vote"
                  size="sm"
                  className={`flex-1 gap-1.5 ${userVote === "yes" ? "border-primary bg-primary/10" : ""}`}
                  onClick={() => onCastVote("yes")}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono">YES</span>
                </Button>
                <Button
                  variant="vote"
                  size="sm"
                  className={`flex-1 gap-1.5 ${userVote === "no" ? "border-destructive bg-destructive/10" : ""}`}
                  onClick={() => onCastVote("no")}
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-[10px] font-mono">NO</span>
                </Button>
                <Button
                  variant="vote"
                  size="sm"
                  className={`flex-1 gap-1.5 ${userVote === "abstain" ? "border-muted-foreground bg-muted/50" : ""}`}
                  onClick={() => onCastVote("abstain")}
                >
                  <MinusCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-mono">ABSTAIN</span>
                </Button>
              </div>
              {/* Vote tally */}
              {Object.keys(vote.votes).length > 0 && (
                <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-secondary">
                  {Object.values(vote.votes).filter(v => v === "yes").length > 0 && (
                    <div className="bg-primary h-full" style={{ flex: Object.values(vote.votes).filter(v => v === "yes").length }} />
                  )}
                  {Object.values(vote.votes).filter(v => v === "no").length > 0 && (
                    <div className="bg-destructive h-full" style={{ flex: Object.values(vote.votes).filter(v => v === "no").length }} />
                  )}
                  {Object.values(vote.votes).filter(v => v === "abstain").length > 0 && (
                    <div className="bg-muted-foreground/50 h-full" style={{ flex: Object.values(vote.votes).filter(v => v === "abstain").length }} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Interject or ask a question..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Send className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
