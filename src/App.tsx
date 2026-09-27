import { Router } from "wouter";
import { useHashLocation } from "./lib/hashLocation";
import Shell from "./app/Shell";
import AppRoutes from "./app/routes";

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <Shell>
        <AppRoutes />
      </Shell>
    </Router>
  );
}
