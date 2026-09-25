import { useSyncExternalStore } from "react";

// wouter's own wouter/use-hash-location keeps the entire "path?search" string as one
// location, so a Route like path="/ask" never matches "/ask?mode=kisan" and useSearch()
// (which reads the real browser location.search, before the #) never sees it either.
// This hook splits the hash into a route-matchable path and a separate search string,
// so `#/ask?mode=kisan` both matches Route path="/ask" and reports search "mode=kisan".

let listeners: (() => void)[] = [];
const onHashChange = () => listeners.forEach((cb) => cb());
function subscribe(callback: () => void) {
  if (listeners.push(callback) === 1) window.addEventListener("hashchange", onHashChange);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
    if (!listeners.length) window.removeEventListener("hashchange", onHashChange);
  };
}

const hashPrefix = /^#?\/?/;
const rawHash = () => location.hash.replace(hashPrefix, "");
const currentPath = () => "/" + rawHash().split("?")[0];
const currentSearch = () => rawHash().split("?")[1] ?? "";

export function navigate(to: string, { state = null, replace = false }: { state?: unknown; replace?: boolean } = {}) {
  const oldURL = location.href;
  const url = new URL(oldURL);
  url.hash = "/" + to.replace(hashPrefix, "");
  const newURL = url.href;
  history[replace ? "replaceState" : "pushState"](state, "", newURL);
  const event =
    typeof HashChangeEvent !== "undefined" ? new HashChangeEvent("hashchange", { oldURL, newURL }) : new Event("hashchange");
  window.dispatchEvent(event);
}

export function useHashLocation(): [string, typeof navigate] {
  const path = useSyncExternalStore(subscribe, currentPath, () => "/");
  return [path, navigate];
}

useHashLocation.hrefs = (href: string) => "#" + href;
useHashLocation.searchHook = () => useSyncExternalStore(subscribe, currentSearch, () => "");
