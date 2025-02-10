import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboard/switch')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/onboard/switch"!</div>
}
