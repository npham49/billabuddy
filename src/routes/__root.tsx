import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ClockIcon, SettingsIcon } from "lucide-react";
export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="flex justify-end p-4">
          <div>
            <Link to="/pomodoro" className="mr-2">
              <Button variant="outline">
                <ClockIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
              </Button>
            </Link>
          </div>
          <div>
            <ModeToggle />
            <Link to="/settings" className="ml-2">
              <Button variant="outline" size="icon">
                <SettingsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
              </Button>
            </Link>
          </div>
        </header>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  ),
});
