import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    (async () => {
      const store = await load("settings.json", { autoSave: true });
      if (store) {
        const storeBreakTime = await store.get<{ value: number }>("breakTime");
        const storeWorkTime = await store.get<{ value: number }>("workTime");
        const time = await store.get<{ value: number }>("time");
        const isRunning = await store.get<{ value: boolean }>("isRunning");
        const task = await store.get<{ value: string }>("task");
        if (time) {
          setTime(time.value);
        } else {
          if (storeWorkTime) {
            setTime(storeWorkTime.value * SECONDS_IN_MINUTE);
          } else {
            setTime(25 * SECONDS_IN_MINUTE);
          }
        }
        setBreakTime(storeBreakTime?.value || 5);
        setWorkTime(storeWorkTime?.value || 25);
        if (isRunning?.value) {
          setTask(task?.value || "");
          startTimer();
        }
      }
      setLoading(false);
    })();
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
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    if (loading) return "Loading...";
    const mins = Math.floor(seconds / SECONDS_IN_MINUTE);
    const secs = seconds % SECONDS_IN_MINUTE;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const endTask = () => {
    stopTimer();
    setIsRunning(false);
    setTask("");
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
          <div>
            {!isRunning && (
              <Input
                id="task"
                placeholder="Enter task name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="col-span-3"
              />
            )}
            {isRunning && (
              <p>{task ? `Current Task: ${task}` : "No task name provided"}</p>
            )}
            <div className="flex justify-center space-x-2 w-full mt-2">
              <Button
                onClick={isRunning ? stopTimer : startTimer}
                className="w-full mt-1"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
            </div>
            {isRunning && (
              <Button
                variant="destructive"
                className="w-full mt-1"
                onClick={endTask}
              >
                End Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
