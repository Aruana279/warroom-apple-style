import { useState, useCallback } from "react";
import type { WarRoomState, VoteValue, TranscriptEntry, Agent } from "@/types/warroom";
import { StatusBar } from "@/components/warroom/StatusBar";
import { VoiceControls } from "@/components/warroom/VoiceControls";
import { WarTable } from "@/components/warroom/WarTable";
import { ChatPanel } from "@/components/warroom/ChatPanel";
import { LeftSidebar } from "@/components/warroom/LeftSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SessionSetupDialog, type SessionConfig } from "@/components/warroom/SessionSetupDialog";

// Default agent avatar URLs — swap these from backend later
const DEFAULT_AVATARS: Record<string, string> = {
  chairperson: "",
  analyst: "",
  advocate: "",
  critic: "",
  secretary: "",
};

// Default background image URL — swap from backend later
export const DEFAULT_BG_IMAGE = "";

const ROLE_MAP: Record<string, { name: string; role: Agent["role"] }> = {
  pa1: { name: "Cipher", role: "analyst" },
  pa2: { name: "Probe", role: "critic" },
  pa3: { name: "Shield", role: "advocate" },
  pa4: { name: "Scribe", role: "secretary" },
  pa5: { name: "Director", role: "chairperson" },
};

export default function WarRoom() {
  const [state, setState] = useState<WarRoomState>({
    sessionStatus: "idle",
    agents: [],
    transcript: [],
    currentVote: null,
    documents: [],
    isMicActive: false,
    isSpeakerActive: true,
  });
  const [userVote, setUserVote] = useState<VoteValue | undefined>();
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [sessionAgenda, setSessionAgenda] = useState("");
  const [bgImage, setBgImage] = useState(DEFAULT_BG_IMAGE);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSessionConfig = useCallback((config: SessionConfig) => {
    setShowSetup(false);
    setSessionAgenda(config.agenda);

    // Build agents from selection
    const agents: Agent[] = config.selectedAgentIds.map((id) => {
      const info = ROLE_MAP[id] || { name: "Agent", role: "analyst" as const };
      return {
        id: `${info.role}-1`,
        name: info.name,
        role: info.role,
        avatar: DEFAULT_AVATARS[info.role] || "",
        speakingState: "idle" as const,
        isHandRaised: false,
      };
    });

    const openingEntry: TranscriptEntry = {
      id: "1",
      agentId: agents[0]?.id || "system",
      agentName: agents[0]?.name || "System",
      role: agents[0]?.role || "chairperson",
      text: `Opening this session. Agenda: ${config.agenda}`,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      sessionStatus: "active",
      agents,
      transcript: [openingEntry],
      currentVote: null,
    }));

    setSessionSeconds(0);
    const id = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    setIntervalId(id);

    // Simulate conversation
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        agents: prev.agents.map((a, i) =>
          i === 1 ? { ...a, speakingState: "speaking" } : { ...a, speakingState: "idle" }
        ),
        transcript: [
          ...prev.transcript,
          {
            id: String(prev.transcript.length + 1),
            agentId: prev.agents[1]?.id || "agent",
            agentName: prev.agents[1]?.name || "Agent",
            role: prev.agents[1]?.role || "analyst",
            text: "I've reviewed the context. Let me share my initial analysis on this matter.",
            timestamp: Date.now(),
          },
        ],
      }));
    }, 5000);

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        agents: prev.agents.map((a) => ({ ...a, speakingState: "idle" })),
        currentVote: {
          id: "vote-1",
          motion: `Proceed with the proposed action regarding: ${config.agenda}`,
          votes: {},
          status: "open",
        },
        transcript: [
          ...prev.transcript,
          {
            id: String(prev.transcript.length + 1),
            agentId: prev.agents[0]?.id || "chair",
            agentName: prev.agents[0]?.name || "Chair",
            role: prev.agents[0]?.role || "chairperson",
            text: "I'm calling for a preliminary vote. All members, please cast your votes.",
            timestamp: Date.now(),
          },
        ],
      }));
    }, 10000);
  }, []);

  const handleStartSession = useCallback(() => {
    setShowSetup(true);
  }, []);

  const handleEndSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sessionStatus: "ended",
      agents: prev.agents.map((a) => ({ ...a, speakingState: "idle" })),
    }));
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  const handleCastVote = useCallback((value: VoteValue) => {
    setUserVote(value);
    setState((prev) => ({
      ...prev,
      currentVote: prev.currentVote
        ? { ...prev.currentVote, votes: { ...prev.currentVote.votes, user: value } }
        : null,
    }));
  }, []);

  const handleUpload = useCallback((file: File) => {
    const docId = `doc-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, { id: docId, name: file.name, status: "uploading" }],
    }));
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
          d.id === docId ? { ...d, status: "analyzed", summary: `Key findings from ${file.name} extracted.` } : d
        ),
      }));
    }, 3000);
  }, []);

  const handleUserMessage = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      transcript: [
        ...prev.transcript,
        {
          id: `user-${Date.now()}`,
          agentId: "user",
          agentName: "You",
          role: "chairperson" as const,
          text,
          timestamp: Date.now(),
        },
      ],
    }));
  }, []);

  const handleToggleMic = useCallback(() => {
    setState((prev) => {
      const newMicState = !prev.isMicActive;
      // When mic turns on, add a visual indicator in transcript
      if (newMicState && prev.sessionStatus === "active") {
        return {
          ...prev,
          isMicActive: true,
          transcript: [
            ...prev.transcript,
            {
              id: `mic-${Date.now()}`,
              agentId: "user",
              agentName: "You",
              role: "chairperson" as const,
              text: "🎙️ Microphone activated — listening…",
              timestamp: Date.now(),
            },
          ],
        };
      }
      return { ...prev, isMicActive: newMicState };
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <LeftSidebar currentAgents={state.agents} />

      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3 ml-12">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-semibold text-sm">Q</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground tracking-tight">Quorum</h1>
            <p className="text-[11px] text-muted-foreground">Virtual War Room</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sessionAgenda && (
            <p className="hidden lg:block text-[12px] text-muted-foreground truncate max-w-xs">
              {sessionAgenda}
            </p>
          )}
          <ThemeToggle />
        </div>
      </div>

      <StatusBar
        status={state.sessionStatus}
        agentCount={state.agents.length}
        sessionTime={formatTime(sessionSeconds)}
      />

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <WarTable
            agents={state.agents}
            documents={state.documents}
            onUpload={handleUpload}
            sessionStatus={state.sessionStatus}
            bgImage={bgImage}
          />
          <VoiceControls
            isMicActive={state.isMicActive}
            isSpeakerActive={state.isSpeakerActive}
            isHandRaised={isHandRaised}
            sessionActive={state.sessionStatus === "active"}
            onToggleMic={handleToggleMic}
            onToggleSpeaker={() => setState((p) => ({ ...p, isSpeakerActive: !p.isSpeakerActive }))}
            onRaiseHand={() => setIsHandRaised((h) => !h)}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
          />
        </div>

        <div className="w-80 border-l border-border shrink-0">
          <ChatPanel
            entries={state.transcript}
            vote={state.currentVote}
            userVote={userVote}
            onCastVote={handleCastVote}
            onSendMessage={handleUserMessage}
          />
        </div>
      </div>

      <SessionSetupDialog
        open={showSetup}
        onStart={handleSessionConfig}
        onCancel={() => setShowSetup(false)}
      />
    </div>
  );
}
