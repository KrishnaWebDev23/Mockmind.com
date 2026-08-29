import { useRef, useState } from "react";
import { transcribeAudio } from "../../../services/groq";

type UseVoiceRecordingProps = {
  onTranscript: (transcript: string) => void;
  showToast: (message: string, type: "error") => void;
};

export const useVoiceRecording = ({
  onTranscript,
  showToast,
}: UseVoiceRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, {
          type: "audio/webm",
        });

        setIsTranscribing(true);

        try {
          const text = await transcribeAudio(audioBlob);

          if (text) {
            onTranscript(text);
          }
        } catch (error) {
          console.error("Failed to transcribe audio:", error);

          showToast("Failed to transcribe audio", "error");
        } finally {
          setIsTranscribing(false);

          stream.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start();

      mediaRecorderRef.current = recorder;

      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);

      showToast("Microphone access denied", "error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    mediaRecorderRef.current = null;

    setIsRecording(false);
  };

 const toggleRecording = () => {
  if (isTranscribing) return;

  if (isRecording) {
    stopRecording();
    return;
  }

  startRecording();
};

  return {
  isRecording,
  isTranscribing,
  toggleRecording,
  startRecording,
  stopRecording,
};
};
