import { Component, type ReactNode } from "react";

export const RouteFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[60vh] flex items-center justify-center text-secondary"
  >
    Chargement…
  </div>
);

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Capture les échecs de chargement des chunks lazy (déploiement en cours,
// réseau coupé) pour éviter un écran blanc et proposer un rechargement.
class RouteBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Route load failed:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">
          Cette page n'a pas pu se charger.
        </h1>
        <p className="text-secondary">
          Une mise à jour est peut-être en cours. Recharger la page devrait
          résoudre le problème.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="px-4 py-2 rounded border border-secondary hover:bg-secondary/10"
        >
          Recharger
        </button>
      </div>
    );
  }
}

export default RouteBoundary;
