import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { load } from "@tauri-apps/plugin-store";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const store = await load("settings.json", { autoSave: true });
      if (store) {
        const userId = await store.get<{ value: string }>("userId");
        console.log(userId);
        if (!userId) {
          navigate({ to: "/onboard/new" });
        } else {
          navigate({ to: "/pomodoro" });
        }
      }
      setLoading(false);
    })();
  }, []);
  return (
    <div className="w-auto h-auto flex align-middle justify-center">
      {loading ? <Loader /> : "Redirecting..."}
    </div>
  );
}
