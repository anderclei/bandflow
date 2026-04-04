"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, VolumeX } from "lucide-react";

interface StageMetronomeProps {
    bpm: number | null;
}

export function StageMetronome({ bpm }: StageMetronomeProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [tick, setTick] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextNoteTimeRef = useRef<number>(0);
    const timerIDRef = useRef<number | null>(null);

    const playClick = (time: number) => {
        if (!audioContextRef.current || isMuted) return;

        const osc = audioContextRef.current.createOscillator();
        const envelope = audioContextRef.current.createGain();

        osc.frequency.value = 800; // High pitch for click
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(envelope);
        envelope.connect(audioContextRef.current.destination);

        osc.start(time);
        osc.stop(time + 0.1);
    };

    const scheduler = () => {
        if (!audioContextRef.current || !bpm) return;

        while (nextNoteTimeRef.current < audioContextRef.current.currentTime + 0.1) {
            playClick(nextNoteTimeRef.current);

            // Visual tick
            setTick(true);
            setTimeout(() => setTick(false), 100);

            nextNoteTimeRef.current += 60.0 / bpm;
        }
        timerIDRef.current = window.setTimeout(scheduler, 25.0);
    };

    useEffect(() => {
        if (!bpm) return;

        if (isPlaying) {
            if (!audioContextRef.current) {
                // @ts-ignore
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
            }
            nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
            scheduler();
        } else {
            if (timerIDRef.current !== null) {
                window.clearTimeout(timerIDRef.current);
            }
        }

        return () => {
            if (timerIDRef.current !== null) {
                window.clearTimeout(timerIDRef.current);
            }
        };
    }, [isPlaying, bpm]);


    if (!bpm) return null;

    return (
        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center justify-center p-3 rounded-xl transition-all ${isPlaying ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                    }`}
            >
                {isPlaying ? <Square className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </button>

            <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-2xl font-black text-white">{bpm}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">BPM</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>

                {/* Visual Indicator */}
                <div className="flex gap-1 ml-2">
                    <div className={`h-8 w-8 rounded-full border-2 transition-all duration-75 ${tick && isPlaying ? "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110" : "border-zinc-700 bg-zinc-800"
                        }`} />
                </div>
            </div>
        </div>
    );
}
