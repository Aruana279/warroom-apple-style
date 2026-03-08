import { useState } from "react";
import {
  Menu,
  X,
  MessageSquare,
  Users,
  BarChart3,
  Plus,
  Clock,
  ChevronRight,
  Zap,
  Crown,
  Search,
  Shield,
  Brain,
  Swords,
  FileSearch,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/types/warroom";

interface PastSession {
  id: string;
  title: string;
  date: string;
  agentCount: number;
  status: "completed" | "aborted";
}

interface PredefinedAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const PAST_SESSIONS: PastSession[] = [
  { id: "s1", title: "Q4 Budget Allocation", date: "Mar 6, 2026", agentCount: 4, status: "completed" },
  { id: "s2", title: "Market Entry Strategy", date: "Mar 4, 2026", agentCount: 5, status: "completed" },
  { id: "s3", title: "Crisis Response Drill", date: "Mar 1, 2026", agentCount: 3, status: "aborted" },
  { id: "s4", title: "Product Launch Review", date: "Feb 27, 2026", agentCount: 5, status: "completed" },
];

const PREDEFINED_AGENTS: PredefinedAgent[] = [
  { id: "pa1", name: "Strategist", role: "analyst", description: "Deep market & data analysis", icon: <Brain className="w-4 h-4" /> },
  { id: "pa2", name: "Devil's Advocate", role: "critic", description: "Challenges assumptions", icon: <Swords className="w-4 h-4" /> },
  { id: "pa3", name: "Compliance Officer", role: "advocate", description: "Legal & regulatory review", icon: <Shield className="w-4 h-4" /> },
  { id: "pa4", name: "Researcher", role: "secretary", description: "Document & fact retrieval", icon: <FileSearch className="w-4 h-4" /> },
  { id: "pa5", name: "Mediator", role: "chairperson", description: "Conflict resolution & consensus", icon: <Scale className="w-4 h-4" /> },
];

interface LeftSidebarProps {
  currentAgents: Agent[];
  onAddAgent?: (agent: PredefinedAgent) => void;
}

type Tab = "sessions" | "agents" | "stats";

export function LeftSidebar({ currentAgents, onAddAgent }: LeftSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sessions");

  return (
    <>
      {/* Burger trigger - always visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 left-3 z-50 w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:bg-primary/10 transition-colors group"
      >
        <Menu className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-xs font-mono">Q</span>
            </div>
            <span className="text-sm font-bold font-display text-foreground tracking-tight">QUORUM</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {([
            { key: "sessions" as Tab, icon: MessageSquare, label: "Sessions" },
            { key: "agents" as Tab, icon: Users, label: "Agents" },
            { key: "stats" as Tab, icon: BarChart3, label: "Stats" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "sessions" && (
            <div className="p-3 space-y-2">
              <Button variant="tactical" size="sm" className="w-full gap-1.5 mb-3">
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">NEW SESSION</span>
              </Button>
              {PAST_SESSIONS.map((session) => (
                <button
                  key={session.id}
                  className="w-full text-left p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {session.title}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.date}
                    </span>
                    <span>{session.agentCount} agents</span>
                    <span className={session.status === "completed" ? "text-primary" : "text-destructive"}>
                      {session.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "agents" && (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 px-1 mb-3">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
                />
              </div>

              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1 mb-2">
                Available Agents
              </p>

              {PREDEFINED_AGENTS.map((agent) => {
                const isActive = currentAgents.some((a) => a.role === agent.role);
                return (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full border border-border bg-secondary flex items-center justify-center text-muted-foreground">
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">{agent.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">{agent.description}</p>
                    </div>
                    <Button
                      variant={isActive ? "ghost" : "tactical"}
                      size="sm"
                      className="h-7 px-2 text-[10px]"
                      disabled={isActive}
                      onClick={() => onAddAgent?.(agent)}
                    >
                      {isActive ? "Active" : <><Plus className="w-3 h-3" /> Add</>}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Sessions", value: "12", icon: MessageSquare, delta: "+3 this week" },
                  { label: "Decisions", value: "34", icon: Zap, delta: "89% consensus" },
                  { label: "Agents Used", value: "8", icon: Users, delta: "5 unique roles" },
                  { label: "Docs Analyzed", value: "47", icon: FileSearch, delta: "12.4k pages" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center gap-1.5 mb-2">
                      <stat.icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold text-foreground font-display">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{stat.delta}</p>
                  </div>
                ))}
              </div>

              {/* Streak */}
              <div className="p-3 rounded-lg border border-accent/30 bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-accent">Decision Streak</span>
                </div>
                <div className="flex gap-1">
                  {[1, 1, 1, 0, 1, 1, 1].map((active, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${active ? "bg-accent" : "bg-secondary"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono mt-1.5">5 day streak • Best: 8 days</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
