import { createUser } from "@/components/services/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { load } from "@tauri-apps/plugin-store";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboard/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });

  async function submitUser(e: FormEvent) {
    e.preventDefault();
    try {
      // create user
      const user = await createUser(userInfo);

      if (!user.lastInsertId) {
        throw new Error("Failed to create user");
      }
      console.log(user);
      // save user to store
      const store = await load("settings.json", { autoSave: true });
      await store?.set("userId", { value: user.lastInsertId });

      toast.success("User created");

      // redirect to pomodoro
      navigate({ to: "/pomodoro" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user");
      return;
    }
  }
  return (
    <div className="flex min-h-auto items-center justify-center">
      <form
        className="space-y-4 w-full max-w-md p-8"
        onSubmit={(e) => submitUser(e)}
      >
        <h1 className="text-2xl font-bold mb-6">Welcome to BillaBuddy</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <p className="text-sm text-secondary-foreground">
            All information will only be saved locally on your machine, we do
            not currently use a server for any app operations.
          </p>
        </div>
        <Button className="w-full" variant={"default"} type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
}
