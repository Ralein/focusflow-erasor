"use client";
import { Button } from "@/components/ui/button";
import { Cog, Speaker, StopCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const TextToSpeech = ({ getText }: { getText: () => Promise<string> }) => {
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!availableVoices.length) {
        setTimeout(loadVoices, 100);
        return;
      }
      if (availableVoices.length) setSelectedVoice(availableVoices[0]);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Read text aloud
  const readTextAloud = async () => {
    const textToRead = await getText();
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    if (selectedVoice) utterance.voice = selectedVoice;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const selectedText = selection.toString();
      if (selectedText.trim()) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = selectedText;
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        if (selectedVoice) utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
      }
    };

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = document.createElement("div");
      container.appendChild(range.cloneContents());
      const selectedText = container.textContent || "";

      if (selectedText.trim()) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = selectedText;
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        if (selectedVoice) utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
      }
    };
    document.addEventListener("dblclick", handleSelection);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("dblclick", handleSelection);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [speechRate, speechPitch, selectedVoice]);

  return (
    <div>
      <Button size="sm" onClick={readTextAloud} className="pl-2 bg-gray-200 rounded mr-2">
        <Speaker className="h-4 w-4 mr-2" />Read Aloud
      </Button>
      <Button size="sm" onClick={stopReading} className="pl-2 bg-red-200 rounded mr-2 ml-2">
        <StopCircle className="h-4 w-4 mr-2" />Stop
      </Button>
      <Button
        size="sm"
        onClick={() => document.getElementById("speechSettings")?.classList.toggle("hidden")}
        className="p-2 bg-gray-200 rounded ml-2">
          
        <Cog className="h-4 w-4 mr-2" /> Settings
      </Button>
      

      <div id="speech-highlight-container" className="mt-2 text-lg" />

      {/* Speech Settings Panel */}
      <div id="speechSettings" className="hidden p-4 bg-gray-50 border rounded mt-2">
        <label>Speech Rate:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="w-full"
        />

        <label>Speech Pitch:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechPitch}
          onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
          className="w-full"
        />

        <label>Voice:</label>
        <select
          onChange={(e) =>
            setSelectedVoice(voices.find((v) => v.name === e.target.value) || null)
          }
          className="w-full p-1 border rounded"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TextToSpeech;