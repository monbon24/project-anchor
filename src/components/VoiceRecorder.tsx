'use client';

import { useState, useRef, useEffect } from 'react';
import { Microphone, Stop, Waveform, SpinnerGap } from '@phosphor-icons/react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

export default function VoiceRecorder({ onTranscript, isProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(20).fill(0.1));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Audio analysis for visualizer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start visualizer
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const levels = Array.from(dataArray.slice(0, 20)).map(v => Math.max(0.1, v / 255));
        setAudioLevel(levels);
        animationRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // Media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setAudioLevel(Array(20).fill(0.1));

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // For now, simulate transcription (real implementation would call Whisper API)
        // In production: send audioBlob to /api/transcribe
        simulateTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow microphone access to use voice capture.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const simulateTranscription = async (audioBlob: Blob) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo: return sample transcription
    const sampleTranscripts = [
      "I need to clean the kitchen but it feels overwhelming. Also have to call mom and finish that report for work.",
      "Feeling scattered today. Should probably drink more water and take a walk. Also need to respond to emails.",
      "I keep forgetting to do laundry. And I need to schedule that dentist appointment I've been putting off.",
    ];
    const transcript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
    onTranscript(transcript);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-bg-card rounded-2xl p-6 border border-bg-elevated">
      {/* Visualizer */}
      <div className="h-24 flex items-center justify-center gap-1 mb-6">
        {audioLevel.map((level, i) => (
          <div
            key={i}
            className={`w-2 rounded-full transition-all duration-75 ${
              isRecording ? 'bg-danger' : 'bg-bg-elevated'
            }`}
            style={{
              height: `${Math.max(8, level * 80)}px`,
              opacity: isRecording ? 0.5 + level * 0.5 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Timer */}
      {isRecording && (
        <div className="text-center mb-4">
          <span className="text-2xl font-mono font-bold text-danger">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Record Button */}
      <div className="flex justify-center">
        {isProcessing ? (
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <SpinnerGap size={40} className="text-primary animate-spin" />
          </div>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-danger flex items-center justify-center animate-pulse hover:bg-danger/80 transition-colors"
          >
            <Stop size={32} weight="fill" className="text-white" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="interactive w-20 h-20 rounded-full bg-gradient-to-br from-primary to-xp flex items-center justify-center glow-primary hover:scale-105 transition-transform"
          >
            <Microphone size={36} weight="fill" className="text-white" />
          </button>
        )}
      </div>

      <p className="text-center text-sm text-text-muted mt-4">
        {isProcessing 
          ? 'Processing your thoughts...' 
          : isRecording 
            ? 'Tap to stop recording' 
            : 'Tap to start brain dump'}
      </p>
    </div>
  );
}
