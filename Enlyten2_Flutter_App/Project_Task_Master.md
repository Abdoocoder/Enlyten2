
### 🟢 Phase 1: Polish & Connectivity (Must Do Next)
*   **Task 1.1: Implement Routing/Navigation:** Integrate a proper navigation library (e.g., `go_router`) into `main.dart` to handle tab switching and screen transitions reliably. (Refactors `MainScaffold`).
*   **Task 1.2: Wiring Services & Booking:** Update `ServicesScreen` and `BookingScreen` to use each other's state. The selected service from `ServicesScreen` must feed into `BookingProvider`.
*   **Task 1.3: Finalize Booking Widget:** Replace all placeholder UI elements in `BookingScreen` with functional Flutter widgets (e.g., actual `DatePicker`, `TimePicker`).
*   **Task 1.4: Implement State-Driven UI:** Ensure that when a state changes (e.g., language change in `main.dart`), *all* necessary widgets react correctly.
*   **Task 1.5: Sync Architecture:** Use the GitHub repository structure (especially the file and component breakdown) to validate all components and ensure the Flutter state management maps correctly to the proposed React structure (e.g., confirming what *should* be in `ServicesScreen` vs. what is in `Services.jsx`).

### 🟡 Phase 2: Data & Backend Integration (Medium Term)
*   **Task 2.1: Data Loading:** Create a repository/service layer to fetch service data from a real source (e.g., a local JSON file in `assets/data/services.json`) instead of using `MockServiceData`.
*   **Task 2.2: API Integration:** Update `BookingProvider.attemptBook` to make a real network call to the backend endpoint for appointment confirmation.
*   **Task 2.3: Local State Management:** Implement local data persistence (e.g., saving the user's preferred language or last viewed service on device startup).
