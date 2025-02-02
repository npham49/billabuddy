import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link to="/pomodoro">Pomodoro timer</Link>
    </div>
  );
}
