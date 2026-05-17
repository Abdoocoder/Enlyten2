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

## 2026-05-16 - Extract table rows into memoized components for large lists
**Learning:** In dashboards like Admin with search/filter functionality, mapping over large data arrays and rendering JSX inline causes all rows to re-render on every keystroke, even if the data for most rows hasn't changed. This O(N) re-render behavior causes noticeable lag in the UI thread during filtering.
**Action:** Extract individual table rows into separate 'React.memo' components. Pass stable callbacks (using 'useCallback') to these components to ensure that only the rows affected by data changes or filter visibility actually re-render, reducing the overhead of search/filter operations to near-constant time for the visual update.

## 2026-05-17 - Optimize complex multi-step forms with memoized list items
**Learning:** In multi-step forms like Booking, rendering lists of options (treatments, time slots) with inline .map() calls causes every item in the list to re-render on every state change (selection, step navigation). This leads to O(N) work on every interaction.
**Action:** Extract list items into separate 'React.memo' components and use 'useCallback' for their selection handlers. This reduces re-rendering overhead to O(1) during selection and improves overall form responsiveness. Ensure dependency arrays for 'useCallback' match React Compiler's expectations (e.g., using the full 'user' object instead of 'user.id' if inferred) to prevent ESLint errors.
