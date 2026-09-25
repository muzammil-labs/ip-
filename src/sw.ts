/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> };

/**
 * UI-5.2: the app's PWA service worker. Precaches the app shell, fonts and icons via
 * Workbox (injected manifest below) so the app works after a first load with no
 * network. importScripts pulls in MSW's own generated worker (public/mockServiceWorker.js)
 * into this SAME worker instance rather than registering a second service worker at the
 * same scope: only one worker can control a scope, so a second `register()` call would
 * silently replace this one (or vice versa) on the next navigation, breaking whichever
 * layer lost. Combining them here means one worker, one registration, both jobs.
 */
precacheAndRoute(self.__WB_MANIFEST);

// eslint-disable-next-line no-undef -- imported for its side effects (installs MSW's own listeners in this worker).
importScripts("./mockServiceWorker.js");

self.skipWaiting();
