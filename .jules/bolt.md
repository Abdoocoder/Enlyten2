## 2026-05-09 - Memoize AuthContext to prevent global re-renders
**Learning:** In a large React application where a central Context (like AuthContext) is consumed by almost every page and layout component, failing to memoize the context value leads to a massive amount of unnecessary re-renders across the entire component tree whenever the provider's parent re-renders or internal state updates during initialization.
**Action:** Always wrap Context Provider values in 'useMemo' and any functions passed into the value in 'useCallback' to ensure stable references and optimal rendering performance.

## 2025-05-15 - Memoize UI components used with scroll-reveal hooks
**Learning:** The 'useReveal' hook, used extensively for scroll animations, triggers frequent state updates and re-renders as elements enter the viewport. Without React.memo on base components like Button and Card, and useMemo for data arrays, these scroll events cause significant main-thread activity and potential jank.
**Action:** Always wrap shared UI components in 'React.memo' and memoize mapped lists or data objects in pages that utilize intersection-observer based animation hooks.
