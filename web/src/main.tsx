import { StrictMode, Component, type ReactNode, type ErrorInfo } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";

// Catch unhandled promise rejections
window.addEventListener("unhandledrejection", (e) => {
  document.title = "REJECT: " + e.reason;
  console.error("Unhandled rejection:", e.reason);
});

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("React error boundary:", error, info);
  }
  render() {
    if (this.state.error) {
      return <pre style={{color: '#f88', padding: 20, whiteSpace: 'pre-wrap', background: '#200'}}>
        {this.state.error.message}{'\n'}{this.state.error.stack}
      </pre>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
