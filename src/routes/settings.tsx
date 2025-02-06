import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { load } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [breakTime, setBreakTime] = useState(5);
  const [workTime, setWorkTime] = useState(25);

  function saveStore() {
    load("settings.json", { autoSave: true })
      .then(async (store) => {
        await store?.set("breakTime", { value: breakTime });
        await store?.set("workTime", { value: workTime });
      })
      .then(() => {
        toast.success("Settings saved");
      })
      .catch((e) => {
        toast.error("Failed to save settings");
        console.error(e);
      });
  }

  useEffect(() => {
    (async () => {
      const store = await load("settings.json", { autoSave: true });
      if (store) {
        const storeBreakTime = await store.get<{ value: number }>("breakTime");
        const storeWorkTime = await store.get<{ value: number }>("workTime");
        setBreakTime(storeBreakTime?.value || 5);
        setWorkTime(storeWorkTime?.value || 25);
      }
    })();
  }, []);

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-center">Settings</h1>
      <div>
        {/* settings allows for break time and work time adjustments */}
        <Label>Break time (Minutes)</Label>
        <Input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(parseInt(e.target.value))}
        />

        <Label>Work time (Minutes)</Label>
        <Input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(parseInt(e.target.value))}
        />
      </div>
      <div className="flex mt-4">
        <Button variant={"default"} onClick={saveStore}>
          Save
        </Button>
      </div>
    </div>
  );
}
