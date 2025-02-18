/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as PomodoroImport } from './routes/pomodoro'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as OnboardSwitchImport } from './routes/onboard/switch'
import { Route as OnboardNewImport } from './routes/onboard/new'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const PomodoroRoute = PomodoroImport.update({
  id: '/pomodoro',
  path: '/pomodoro',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const OnboardSwitchRoute = OnboardSwitchImport.update({
  id: '/onboard/switch',
  path: '/onboard/switch',
  getParentRoute: () => rootRoute,
} as any)

const OnboardNewRoute = OnboardNewImport.update({
  id: '/onboard/new',
  path: '/onboard/new',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/pomodoro': {
      id: '/pomodoro'
      path: '/pomodoro'
      fullPath: '/pomodoro'
      preLoaderRoute: typeof PomodoroImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/onboard/new': {
      id: '/onboard/new'
      path: '/onboard/new'
      fullPath: '/onboard/new'
      preLoaderRoute: typeof OnboardNewImport
      parentRoute: typeof rootRoute
    }
    '/onboard/switch': {
      id: '/onboard/switch'
      path: '/onboard/switch'
      fullPath: '/onboard/switch'
      preLoaderRoute: typeof OnboardSwitchImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/pomodoro': typeof PomodoroRoute
  '/settings': typeof SettingsRoute
  '/onboard/new': typeof OnboardNewRoute
  '/onboard/switch': typeof OnboardSwitchRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/pomodoro': typeof PomodoroRoute
  '/settings': typeof SettingsRoute
  '/onboard/new': typeof OnboardNewRoute
  '/onboard/switch': typeof OnboardSwitchRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/pomodoro': typeof PomodoroRoute
  '/settings': typeof SettingsRoute
  '/onboard/new': typeof OnboardNewRoute
  '/onboard/switch': typeof OnboardSwitchRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/pomodoro'
    | '/settings'
    | '/onboard/new'
    | '/onboard/switch'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/pomodoro'
    | '/settings'
    | '/onboard/new'
    | '/onboard/switch'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/pomodoro'
    | '/settings'
    | '/onboard/new'
    | '/onboard/switch'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  PomodoroRoute: typeof PomodoroRoute
  SettingsRoute: typeof SettingsRoute
  OnboardNewRoute: typeof OnboardNewRoute
  OnboardSwitchRoute: typeof OnboardSwitchRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  PomodoroRoute: PomodoroRoute,
  SettingsRoute: SettingsRoute,
  OnboardNewRoute: OnboardNewRoute,
  OnboardSwitchRoute: OnboardSwitchRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/pomodoro",
        "/settings",
        "/onboard/new",
        "/onboard/switch"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/pomodoro": {
      "filePath": "pomodoro.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/onboard/new": {
      "filePath": "onboard/new.tsx"
    },
    "/onboard/switch": {
      "filePath": "onboard/switch.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
