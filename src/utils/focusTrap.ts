// Focus management helpers for modal dialogs. Stable function identities so
// they can be passed as `ref={...}` / `onKeyDown={...}` without causing the
// callback to detach-reattach on every render of the parent.

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Callback ref that focuses the first focusable element inside the container
// once, on mount. Stable identity (module-scoped function) so React only
// invokes it on attach/detach, not on every render.
export const focusFirstElementOnMount = (el: HTMLElement | null) => {
  if (!el) return;
  el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
};

// Tab/Shift+Tab handler that wraps focus inside a dialog panel. Pair with
// `role="dialog"` + `aria-modal="true"` and a callback ref that focuses on
// mount.
export const handleDialogTabKey = (event: React.KeyboardEvent<HTMLElement>) => {
  if (event.key !== "Tab") return;
  const focusables = event.currentTarget.querySelectorAll<HTMLElement>(
    FOCUSABLE_SELECTOR,
  );
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};
