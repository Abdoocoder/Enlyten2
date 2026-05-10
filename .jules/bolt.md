## 2025-01-24 - Component Stabilization in High-Frequency Hook Environments
**Learning:** In applications using scroll-linked animation hooks (like `useReveal`), parent components re-render frequently as the user scrolls. If common UI primitives (Button, Card) are not memoized, and data structures (stats arrays) are recreated on every render, the reconciliation overhead can lead to "jank" and increased CPU usage.
**Action:** Always memoize shared UI components (`React.memo`) and stable data objects (`useMemo`) when they are used inside components that re-render based on scroll or resize events.

## 2025-01-24 - Negating Memoization with Inline Props
**Learning:** `React.memo` relies on shallow prop comparison. Passing inline objects (e.g., `style={{ delay: 0 }}`) or new JSX children on every render negates the benefits of `memo()` because the references change every time, triggering a re-render anyway.
**Action:** Pull static objects out of the render loop or wrap dynamic content in `useMemo` to ensure stable references when passing props to memoized child components.
