## 2026-05-09 - Memoize AuthContext to prevent global re-renders
**Learning:** In a large React application where a central Context (like AuthContext) is consumed by almost every page and layout component, failing to memoize the context value leads to a massive amount of unnecessary re-renders across the entire component tree whenever the provider's parent re-renders or internal state updates during initialization.
**Action:** Always wrap Context Provider values in 'useMemo' and any functions passed into the value in 'useCallback' to ensure stable references and optimal rendering performance.
