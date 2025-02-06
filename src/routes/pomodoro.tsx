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
import { load } from "@tauri-apps/plugin-store";
import { BREAK_COLOR, SECONDS_IN_MINUTE, WORK_COLOR } from "@/lib/constants";
// const FULL_DASH_ARRAY = 283

export const Route = createFileRoute("/pomodoro")({
  component: RouteComponent,
});

function RouteComponent() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  const [loading, setLoading] = useState(true);

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(workTime * SECONDS_IN_MINUTE);
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
              return breakTime * SECONDS_IN_MINUTE;
            } else {
              setIsWork(true);
              return workTime * SECONDS_IN_MINUTE;
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
    setTime(workTime * SECONDS_IN_MINUTE);
    setIsWork(true);
    setTask("");
  };

  const formatTime = (seconds: number) => {
    if (loading) return "Loading...";
    const mins = Math.floor(seconds / SECONDS_IN_MINUTE);
    const secs = seconds % SECONDS_IN_MINUTE;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    (async () => {
      const store = await load("settings.json", { autoSave: true });
      if (store) {
        const storeBreakTime = await store.get<{ value: number }>("breakTime");
        const storeWorkTime = await store.get<{ value: number }>("workTime");
        setBreakTime(storeBreakTime?.value || 5);
        setWorkTime(storeWorkTime?.value || 25);
        setTime((storeWorkTime?.value || 25) * SECONDS_IN_MINUTE);
      }
      setLoading(false);
    })();
  }, []);

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
                  ? ((workTime - time / SECONDS_IN_MINUTE) / workTime) * 100
                  : ((breakTime - time / SECONDS_IN_MINUTE) / breakTime) * 100
              }
              text={formatTime(time)}
              strokeWidth={5}
              styles={buildStyles({
                textColor: isWork ? WORK_COLOR : BREAK_COLOR,
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
          <div>
            <div className="flex justify-center space-x-2 w-full">
              <Button
                onClick={isRunning ? stopTimer : startTimer}
                className="w-1/2"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline" className="w-1/2">
                Reset
              </Button>
            </div>
            <Button variant="destructive" className="w-full mt-1">
              End Task
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
