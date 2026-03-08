export type AgentRole = "chairperson" | "analyst" | "advocate" | "critic" | "secretary";
export type VoteValue = "yes" | "no" | "abstain";
export type SessionStatus = "idle" | "connecting" | "active" | "error" | "ended";
export type SpeakingState = "idle" | "listening" | "speaking" | "thinking";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  speakingState: SpeakingState;
  isHandRaised: boolean;
}

export interface TranscriptEntry {
  id: string;
  agentId: string;
  agentName: string;
  role: AgentRole;
  text: string;
  timestamp: number;
}

export interface VoteItem {
  id: string;
  motion: string;
  votes: Record<string, VoteValue>;
  status: "open" | "closed";
}

export interface UploadedDocument {
  id: string;
  name: string;
  status: "uploading" | "processing" | "analyzed" | "error";
  summary?: string;
}

export interface WarRoomState {
  sessionStatus: SessionStatus;
  agents: Agent[];
  transcript: TranscriptEntry[];
  currentVote: VoteItem | null;
  documents: UploadedDocument[];
  isMicActive: boolean;
  isSpeakerActive: boolean;
}
