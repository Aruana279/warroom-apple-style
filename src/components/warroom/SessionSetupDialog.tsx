import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Swords, Shield, FileSearch, Scale, Loader2, Check } from "lucide-react";

interface AgentOption {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const AVAILABLE_AGENTS: AgentOption[] = [
  { id: "pa1", name: "Strategist", role: "analyst", description: "Deep market & data analysis", icon: <Brain className="w-4 h-4" /> },
  { id: "pa2", name: "Devil's Advocate", role: "critic", description: "Challenges assumptions", icon: <Swords className="w-4 h-4" /> },
  { id: "pa3", name: "Compliance Officer", role: "advocate", description: "Legal & regulatory review", icon: <Shield className="w-4 h-4" /> },
  { id: "pa4", name: "Researcher", role: "secretary", description: "Document & fact retrieval", icon: <FileSearch className="w-4 h-4" /> },
  { id: "pa5", name: "Mediator", role: "chairperson", description: "Conflict resolution & consensus", icon: <Scale className="w-4 h-4" /> },
];

export interface SessionConfig {
  agenda: string;
  selectedAgentIds: string[];
}

interface SessionSetupDialogProps {
  open: boolean;
  onStart: (config: SessionConfig) => void;
  onCancel: () => void;
}

export function SessionSetupDialog({ open, onStart, onCancel }: SessionSetupDialogProps) {
  const [step, setStep] = useState<"setup" | "loading">("setup");
  const [agenda, setAgenda] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set(["pa1", "pa2", "pa5"]));

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStart = () => {
    setStep("loading");
    // Simulate backend setup (image generation, agent initialization)
    setTimeout(() => {
      onStart({ agenda, selectedAgentIds: Array.from(selectedAgents) });
      setStep("setup");
      setAgenda("");
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && step !== "loading" && onCancel()}>
      <DialogContent className="sm:max-w-md">
        {step === "setup" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">New Session</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Set your agenda and choose who joins the room.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Agenda */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Agenda</label>
                <textarea
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="What should the board discuss today?"
                  className="w-full h-20 rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Agent selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Agents</label>
                <div className="space-y-1.5">
                  {AVAILABLE_AGENTS.map((agent) => {
                    const selected = selectedAgents.has(agent.id);
                    return (
                      <button
                        key={agent.id}
                        onClick={() => toggleAgent(agent.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                          selected ? "bg-primary/8 border border-primary/20" : "hover:bg-accent border border-transparent"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selected ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                        }`}>
                          {agent.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{agent.name}</p>
                          <p className="text-[11px] text-muted-foreground">{agent.description}</p>
                        </div>
                        {selected && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
              <Button
                onClick={handleStart}
                disabled={!agenda.trim() || selectedAgents.size === 0}
                className="flex-1"
              >
                Start Session
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">Setting up your war room</p>
              <p className="text-xs text-muted-foreground">Preparing agents and generating visuals…</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
