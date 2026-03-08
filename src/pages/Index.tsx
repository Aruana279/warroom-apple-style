import { useState, useCallback } from "react";
import type { WarRoomState, VoteValue, TranscriptEntry, Agent } from "@/types/warroom";
import { StatusBar } from "@/components/warroom/StatusBar";
import { AgentCard } from "@/components/warroom/AgentCard";
import { TranscriptPanel } from "@/components/warroom/TranscriptPanel";
import { VoiceControls } from "@/components/warroom/VoiceControls";
import { DocumentPanel } from "@/components/warroom/DocumentPanel";
import { VotePanel } from "@/components/warroom/VotePanel";
import { MissionCard } from "@/components/warroom/MissionCard";

const DEMO_AGENTS: Agent[] = [
  { id: "chair-1", name: "Director", role: "chairperson", avatar: "", speakingState: "idle", isHandRaised: false },
  { id: "analyst-1", name: "Cipher", role: "analyst", avatar: "", speakingState: "idle", isHandRaised: false },
  { id: "advocate-1", name: "Shield", role: "advocate", avatar: "", speakingState: "idle", isHandRaised: false },
  { id: "critic-1", name: "Probe", role: "critic", avatar: "", speakingState: "idle", isHandRaised: false },
  { id: "sec-1", name: "Scribe", role: "secretary", avatar: "", speakingState: "idle", isHandRaised: false },
];

const DEMO_TRANSCRIPT: TranscriptEntry[] = [
  { id: "1", agentId: "chair-1", agentName: "Director", role: "chairperson", text: "Opening this session. The matter before us: evaluate the proposed acquisition of NovaTech for strategic AI capabilities.", timestamp: Date.now() - 120000 },
  { id: "2", agentId: "analyst-1", agentName: "Cipher", role: "analyst", text: "Initial analysis shows NovaTech holds 3 key patents in multimodal reasoning. Market valuation appears 15% above comparable deals.", timestamp: Date.now() - 90000 },
  { id: "3", agentId: "critic-1", agentName: "Probe", role: "critic", text: "The integration risk is substantial. Their tech stack diverges significantly from ours. I'd flag a 6-month minimum integration timeline.", timestamp: Date.now() - 60000 },
  { id: "4", agentId: "advocate-1", agentName: "Shield", role: "advocate", text: "The patent portfolio alone justifies the premium. Without these capabilities, we lose 18 months of R&D runway.", timestamp: Date.now() - 30000 },
];

export default function WarRoom() {
  const [state, setState] = useState<WarRoomState>({
    sessionStatus: "idle",
    agents: DEMO_AGENTS,
    transcript: DEMO_TRANSCRIPT,
    currentVote: null,
    documents: [],
    isMicActive: false,
    isSpeakerActive: true,
  });
  const [userVote, setUserVote] = useState<VoteValue | undefined>();
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleStartSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sessionStatus: "active",
      agents: prev.agents.map((a, i) =>
        i === 0 ? { ...a, speakingState: "speaking" as const } : a
      ),
    }));
    const id = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    setIntervalId(id);

    // Simulate agent speaking rotation
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        agents: prev.agents.map((a) =>
          a.id === "chair-1" ? { ...a, speakingState: "idle" } :
          a.id === "analyst-1" ? { ...a, speakingState: "speaking" } : a
        ),
      }));
    }, 4000);

    // Simulate a vote after delay
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentVote: {
          id: "vote-1",
          motion: "Proceed with NovaTech acquisition at the proposed valuation of $2.4B",
          votes: { "chair-1": "yes", "analyst-1": "yes" },
          status: "open",
        },
        agents: prev.agents.map((a) => ({ ...a, speakingState: "idle" })),
        transcript: [
          ...prev.transcript,
          {
            id: String(prev.transcript.length + 1),
            agentId: "chair-1",
            agentName: "Director",
            role: "chairperson" as const,
            text: "I'm calling for a vote on the acquisition. All board members, please cast your votes.",
            timestamp: Date.now(),
          },
        ],
      }));
    }, 8000);
  }, []);

  const handleEndSession = useCallback(() => {
    setState((prev) => ({ ...prev, sessionStatus: "ended", agents: prev.agents.map((a) => ({ ...a, speakingState: "idle" })) }));
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  const handleCastVote = useCallback((value: VoteValue) => {
    setUserVote(value);
    setState((prev) => ({
      ...prev,
      currentVote: prev.currentVote ? {
        ...prev.currentVote,
        votes: { ...prev.currentVote.votes, user: value },
      } : null,
    }));
  }, []);

  const handleUpload = useCallback((file: File) => {
    const docId = `doc-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, { id: docId, name: file.name, status: "uploading" }],
    }));
    // Simulate processing
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, status: "processing" } : d
        ),
      }));
    }, 1000);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, status: "analyzed", summary: `Analysis of ${file.name}: Key findings extracted and summarized for board review.` } : d
        ),
      }));
    }, 3000);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background grid-bg overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm font-mono">Q</span>
          </div>
          <div>
            <h1 className="text-sm font-bold font-display text-foreground tracking-tight">QUORUM</h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">VIRTUAL WAR ROOM</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          v0.1.0 • HACKATHON BUILD
        </div>
      </div>

      <StatusBar
        status={state.sessionStatus}
        agentCount={state.agents.length}
        sessionTime={formatTime(sessionSeconds)}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Agents + Mission + Documents */}
        <div className="w-72 border-r border-border flex flex-col bg-card/30 shrink-0">
          {/* Mission */}
          <div className="p-3">
            <MissionCard
              title="NovaTech Acquisition Review"
              description="Evaluate the strategic acquisition of NovaTech ($2.4B). Assess IP portfolio, integration risks, and market impact."
            />
          </div>

          {/* Agents */}
          <div className="px-3 pb-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest font-mono text-muted-foreground mb-2 px-1">
              Board Members
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {state.agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="flex-1 border-t border-border min-h-0">
            <DocumentPanel documents={state.documents} onUpload={handleUpload} />
          </div>
        </div>

        {/* Center - Transcript */}
        <div className="flex-1 flex flex-col min-w-0">
          <TranscriptPanel entries={state.transcript} />
          <VoiceControls
            isMicActive={state.isMicActive}
            isSpeakerActive={state.isSpeakerActive}
            isHandRaised={isHandRaised}
            sessionActive={state.sessionStatus === "active"}
            onToggleMic={() => setState((p) => ({ ...p, isMicActive: !p.isMicActive }))}
            onToggleSpeaker={() => setState((p) => ({ ...p, isSpeakerActive: !p.isSpeakerActive }))}
            onRaiseHand={() => setIsHandRaised((h) => !h)}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
          />
        </div>

        {/* Right sidebar - Vote */}
        <div className="w-64 border-l border-border bg-card/30 shrink-0">
          <VotePanel vote={state.currentVote} onCastVote={handleCastVote} userVote={userVote} />
        </div>
      </div>
    </div>
  );
}
