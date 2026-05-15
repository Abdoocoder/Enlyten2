## 2026-05-09 - Memoize AuthContext to prevent global re-renders
**Learning:** In a large React application where a central Context (like AuthContext) is consumed by almost every page and layout component, failing to memoize the context value leads to a massive amount of unnecessary re-renders across the entire component tree whenever the provider's parent re-renders or internal state updates during initialization.
**Action:** Always wrap Context Provider values in 'useMemo' and any functions passed into the value in 'useCallback' to ensure stable references and optimal rendering performance.

## 2025-05-15 - Memoize UI components used with scroll-reveal hooks
**Learning:** The 'useReveal' hook, used extensively for scroll animations, triggers frequent state updates and re-renders as elements enter the viewport. Without React.memo on base components like Button and Card, and useMemo for data arrays, these scroll events cause significant main-thread activity and potential jank.
**Action:** Always wrap shared UI components in 'React.memo' and memoize mapped lists or data objects in pages that utilize intersection-observer based animation hooks.

## 2026-05-13 - Stabilize form inputs to eliminate keystroke lag
**Learning:** In forms with multiple inputs (Profile, Auth), every keystroke triggers a state update in the parent component. Without `React.memo` on the `Input` component and `useCallback` on the change handler, *every* input field re-renders on *every* character typed. This increases main-thread work linearly with the number of fields.
**Action:** Memoize generic `Input` components and ensure `onChange` handlers use `useCallback` to prevent breaking memoization.

## 2025-05-16 - Memoize derived stats and sub-components in Admin & Dashboard
**Learning:** In dashboards with search/filter state, high-level stats calculations using .filter() and .reduce() on large arrays trigger on every keystroke if not memoized. Moving these hooks to the top level (above auth guards) requires defensive programming (optional chaining, default values) to prevent crashes during initial data load.
**Action:** Use 'useMemo' for all derived data transformations and 'React.memo' for leaf components like StatusBadge or KpiCard that receive stable props. Always provide default values for data dependencies in useMemo to handle loading states safely.

## 2026-05-18 - Extract and memoize table rows in Admin dashboard
**Learning:** In administrative dashboards with search and filtering, rendering a large table of bookings directly within the parent component causes the entire table to re-render on every keystroke. This happens even if the filter doesn't change which rows are visible, leading to significant input lag and high main-thread usage.
**Action:** Extract table rows into a separate 'React.memo' component and ensure that all action handlers passed to the rows are wrapped in 'useCallback' to maintain stable prop references.
