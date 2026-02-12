import { Component, type ReactNode } from "react";
import { Heart } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error("ErrorBoundary:", error); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-accent/20 to-background text-center">
          <Heart size={64} className="text-primary/50 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Something went wrong 💔</h1>
          <p className="text-muted-foreground mb-6">Don't worry, love always finds a way.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
