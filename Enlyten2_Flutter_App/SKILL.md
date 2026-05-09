---
name: flutter-dev
description: >
  Complete, refactor, and improve Flutter/Dart mobile applications.
  Use this skill whenever the user wants to implement Flutter features,
  fix bugs, integrate navigation (go_router), add state management
  (Provider/Riverpod/Bloc), connect APIs, build UI widgets, or continue
  development on an existing Flutter project. Trigger on any Flutter,
  Dart, mobile app, or Android/iOS development task.
---

# Flutter Developer Skill

You are an expert Flutter developer. Your job is to read the project,
understand its current state, and implement the requested tasks precisely.

## Workflow

### Step 1: Read the Project
Before doing anything, read the project structure:
```
exec sh -c 'find <project_path> -type f -name "*.dart" | head -40'
exec sh -c 'cat <project_path>/pubspec.yaml'
```

### Step 2: Understand Current State
Read the key files:
- `lib/main.dart` — entry point, routing, providers
- `lib/screens/` — all screens
- `lib/providers/` or `lib/state/` — state management
- `lib/services/` — API/data services
- `lib/models/` — data models

### Step 3: Implement Tasks

Follow this priority order from the project plan:

#### Phase 1 — Navigation & Wiring (do first)

**Task 1.1 — go_router Navigation**
1. Add to pubspec.yaml: `go_router: ^13.0.0`
2. Create `lib/router/app_router.dart`:
```dart
import 'package:go_router/go_router.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainScaffold(child: child),
      routes: [
        GoRoute(path: '/', builder: (c, s) => HomeScreen()),
        GoRoute(path: '/services', builder: (c, s) => ServicesScreen()),
        GoRoute(path: '/booking', builder: (c, s) => BookingScreen()),
      ],
    ),
  ],
);
```
3. Update `main.dart` to use `MaterialApp.router(routerConfig: appRouter)`

**Task 1.2 — Wire Services → Booking**
- Read `ServicesScreen` to find selected service state
- Pass selected service to `BookingProvider` via:
```dart
context.read<BookingProvider>().setService(selectedService);
context.go('/booking');
```

**Task 1.3 — Functional Booking Widgets**
Replace placeholders with:
```dart
// Date picker
ListTile(
  title: Text(selectedDate == null ? 'Select Date' : formatter.format(selectedDate!)),
  trailing: Icon(Icons.calendar_today),
  onTap: () async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 90)),
    );
    if (date != null) provider.setDate(date);
  },
),
// Time picker — similar pattern with showTimePicker
```

**Task 1.4 — State-Driven UI**
Wrap language-sensitive widgets with `Consumer<LanguageProvider>` or
use `context.watch<LanguageProvider>()` at the top of build().

**Task 1.5 — Validate Architecture**
Compare Flutter providers/screens with React components:
- `ServicesProvider` ↔ `Services.jsx` state
- `BookingProvider` ↔ `BookingContext`
- Each screen should have one Provider wrapping it

#### Phase 2 — Data & Backend (do after Phase 1)

**Task 2.1 — Repository Layer**
Create `lib/services/service_repository.dart`:
```dart
class ServiceRepository {
  Future<List<ServiceModel>> getServices() async {
    final json = await rootBundle.loadString('assets/data/services.json');
    final list = jsonDecode(json) as List;
    return list.map((e) => ServiceModel.fromJson(e)).toList();
  }
}
```
Add to pubspec.yaml assets:
```yaml
assets:
  - assets/data/services.json
```

**Task 2.2 — Real API Booking**
Update `BookingProvider.attemptBook`:
```dart
Future<void> attemptBook() async {
  state = BookingState.loading;
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(booking.toJson()),
    );
    if (response.statusCode == 201) {
      state = BookingState.success;
    } else {
      state = BookingState.error;
    }
  } catch (e) {
    state = BookingState.error;
  }
}
```

**Task 2.3 — Local Persistence**
Add `shared_preferences` to pubspec.yaml then:
```dart
// Save language
final prefs = await SharedPreferences.getInstance();
await prefs.setString('language', languageCode);

// Load on startup in main()
final savedLang = prefs.getString('language') ?? 'ar';
```

## Rules

- Always run `flutter analyze` after changes
- Never break existing working features
- Keep Arabic RTL support intact
- Use `const` constructors wherever possible
- Keep Provider pattern consistent — don't mix with other state solutions
- After each task, confirm it compiles before moving to the next

## After Completing Tasks

Run:
```
exec sh -c 'cd <project_path> && flutter analyze 2>&1 | tail -20'
```

Report: which tasks are done, any warnings, and what to do next.
