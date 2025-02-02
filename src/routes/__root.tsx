import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="flex justify-end p-4">
          <ModeToggle />
        </header>
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  ),
});
