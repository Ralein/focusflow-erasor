"use client";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

interface SpeechToTextProps {
  onTextGenerated: (text: string) => void;
}

// 🔹 Declare SpeechRecognition globally for TypeScript compatibility
declare global {
  interface Window {
    SpeechRecognition: {
      new (): {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: (event: SpeechRecognitionEvent) => void;
        onerror: (event: SpeechRecognitionErrorEvent) => void;
        start: () => void;
        stop: () => void;
      };
    };
    webkitSpeechRecognition: typeof window.SpeechRecognition;
  }
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTextGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null); // ✅ Ensuring type safety

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              const transcript = result[0].transcript.trim();
              onTextGenerated(transcript);
            }
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null; // Best practice
    };
  }, [onTextGenerated]); // Updated dependency array

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  return (
    <Button
      className={`px-4 py-2 text-white rounded mr-2 ${isListening ? "bg-red-500" : "bg-blue-500"}`}
      onClick={toggleListening}
      size="sm"
    >
      {isListening ? <Square className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
      {isListening ? "Stop Listening" : "Start Speaking"}
    </Button>
  );
};


export default SpeechToText;