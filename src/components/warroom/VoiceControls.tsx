import { Mic, MicOff, Volume2, VolumeX, Hand, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlsProps {
  isMicActive: boolean;
  isSpeakerActive: boolean;
  isHandRaised: boolean;
  sessionActive: boolean;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onRaiseHand: () => void;
  onStartSession: () => void;
  onEndSession: () => void;
}

export function VoiceControls({
  isMicActive,
  isSpeakerActive,
  isHandRaised,
  sessionActive,
  onToggleMic,
  onToggleSpeaker,
  onRaiseHand,
  onStartSession,
  onEndSession,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2 p-3 border-t border-border bg-card/50">
      {/* Session toggle */}
      {!sessionActive ? (
        <Button variant="tactical" size="sm" onClick={onStartSession} className="gap-1.5">
          <Radio className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">START SESSION</span>
        </Button>
      ) : (
        <Button variant="danger" size="sm" onClick={onEndSession} className="gap-1.5">
          <Radio className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">END</span>
        </Button>
      )}

      <div className="flex-1" />

      {/* Raise hand */}
      <Button
        variant={isHandRaised ? "tactical" : "ghost"}
        size="icon"
        onClick={onRaiseHand}
        disabled={!sessionActive}
        title="Raise Hand"
      >
        <Hand className="w-4 h-4" />
      </Button>

      {/* Speaker */}
      <Button
        variant={isSpeakerActive ? "ghost" : "danger"}
        size="icon"
        onClick={onToggleSpeaker}
        disabled={!sessionActive}
        title={isSpeakerActive ? "Mute Speaker" : "Unmute Speaker"}
      >
        {isSpeakerActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>

      {/* Mic - big button */}
      <Button
        variant={isMicActive ? "tactical" : "ghost"}
        size="icon"
        onClick={onToggleMic}
        disabled={!sessionActive}
        className={`w-12 h-12 rounded-full ${isMicActive ? "glow-primary" : ""}`}
        title={isMicActive ? "Mute Mic" : "Unmute Mic"}
      >
        {isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </Button>
    </div>
  );
}
