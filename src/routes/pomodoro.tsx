import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
// const FULL_DASH_ARRAY = 283
const WORK_COLOR = "#4ade80";
const BREAK_COLOR = "#f87171";

export const Route = createFileRoute("/pomodoro")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(WORK_TIME);
  const [isWork, setIsWork] = useState(true);
  const [task, setTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    const oscillator = audioRef.current.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioRef.current.currentTime); // 440 Hz = A4 note
    oscillator.connect(audioRef.current.destination);
    oscillator.start();
    oscillator.stop(audioRef.current.currentTime + 0.5); // Sound duration: 0.5 seconds
  };

  const startTimer = () => {
    if (task) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            playSound();
            if (isWork) {
              setIsWork(false);
              return BREAK_TIME;
            } else {
              setIsWork(true);
              return WORK_TIME;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setShowModal(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setTime(WORK_TIME);
    setIsWork(true);
    setTask("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="min-h-auto flex items-center justify-center bg-background">
      <Card className="w-96 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pomodoro Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-64 h-64 mx-auto">
            <CircularProgressbar
              value={
                isWork
                  ? ((WORK_TIME - time) / WORK_TIME) * 100
                  : ((BREAK_TIME - time) / BREAK_TIME) * 100
              }
              text={formatTime(time)}
              strokeWidth={5}
              styles={buildStyles({
                textSize: "16px",
                pathColor: isWork ? WORK_COLOR : BREAK_COLOR,
                trailColor: "#d1d5db",
              })}
            />
          </div>
          <div className="text-center font-semibold">
            {isWork ? "Work Time" : "Break Time"}
          </div>
          {task && <div className="text-center">Current Task: {task}</div>}
          <div className="flex justify-center space-x-2">
            <Button onClick={isRunning ? stopTimer : startTimer}>
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What are you working on?</DialogTitle>
            <DialogDescription>
              Enter the task you'll be focusing on during this Pomodoro session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowModal(false);
                if (task) startTimer();
              }}
            >
              Start Pomodoro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
