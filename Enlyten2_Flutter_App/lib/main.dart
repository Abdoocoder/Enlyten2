import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/foundation.dart'; // For ChangeNotifier

// Placeholder screens - ensure these files exist in your lib/screens/ folder
// If they don't exist, create empty files named home_screen.dart, services_screen.dart, contact_screen.dart
import 'screens/home_screen.dart';
import 'screens/services_screen.dart';
import 'screens/contact_screen.dart';

// --- Language Provider ---
class LanguageProvider extends ChangeNotifier {
  String _currentLocale = 'en';

  String get currentLocale => _currentLocale;

  void setLocale(String newLocale) {
    _currentLocale = newLocale;
    notifyListeners();
  }
}

// --- GoRouter Configuration ---
final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const MainScaffold(),
    ),
    GoRoute(
      path: '/services',
      builder: (context, state) => const ServicesScreen(),
    ),
    GoRoute(
      path: '/contact',
      builder: (context, state) => const ContactScreen(),
    ),
  ],
  errorBuilder: (context, state) => const ErrorScreen(), // Handle unknown routes
);

void main() {
  WidgetsFlutterBinding.ensureInit ialized(); // Ensure Flutter services are initialized
  runApp(
    ChangeNotifierProvider(
      create: (context) => LanguageProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Enlyten2 Laser Center',
      theme: ThemeData(
        primarySwatch: Colors.pink,
        scaffoldBackgroundColor: Colors.black,
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Colors.white),
        ),
      ),
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
      // Add localization delegates if you have them in your project
      // localizationsDelegates: [ ... ],
      // supportedLocales: const [ Locale('en'), Locale('ar') ],
    );
  }
}

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  // Placeholder pages - replace with your actual screen widgets
  final List<Widget> _pages = [
    const HomeScreen(),
    const ServicesScreen(),
    const ContactScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(co ntext);
    final isRtl = languageProvider.currentLocale == 'ar';

    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        body: _pages[_currentIndex], // Display current page from list
        bottomNavigationBar: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.spa), label: 'Services'),
            BottomNavigationBarItem(icon: Icon(Icons.location_on), label: 'Contact'),
          ],
          currentIndex: _currentIndex,
          selectedItemColor: Colors.pink,
          unselectedItemColor: Colors.grey,
          onTap: (index) {
            setState(() {
              _currentIndex = index; // Update the state for the body content
            });
            // Navigate using GoRouter
            switch (index) {
              case 0: context.go('/'); break;
              case 1: context.go('/services'); break;
              case 2: context.go('/contact'); break;
            }
          },
        ),
      ),
    );
  }
}

// --- Placeholder Widgets/Screens ---
// Ensure these are present or replace with your actual components.

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Error')),
      body: const Center(child: Text('Page not found', style: TextStyle(color: Colors.white))),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(co ntext);
    return Center(
      child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
      Text(
      ⁧            languageProvider.currentLocale == 'ar' ? 'المرحباً' : 'Hello',⁩
          style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.pink),
    ),
    const SizedBox(height: 20),
    Text(
    ⁧            languageProvider.currentLocale == 'ar' ? 'مرحباً بكم في عالم الجمال.' : 'Welcome to the World of Beauty.',⁩                                                                                               ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    style: const TextStyle(fontSize: 20, color: Colors.white70),
    ),
    const SizedBox(height: 40),
    ElevatedButton.icon(
    onPressed: () {
    final provider = Provider.of<LanguageProvider>(co ntext, listen: false);
    final newLocale = languageProvider.currentLocale == 'en' ? 'ar' : 'en';
    provider.setLocale(newLocale);
    },
    icon: const Icon(Icons.language),
    ⁧            label: Text(languageProvider.currentLoc ale == 'en' ? 'العربية' : 'English'),⁩                                                                                                                           ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    style: ElevatedButton.styleFrom(
    backgroundColor: Colors.purple,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    ),
    ),
    ],
    ),
    );
  }
}

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Services Screen', style: TextStyle(color: Colors.white))));
  }
}

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Contact Screen', style: TextStyle(color: Colors.white))));
  }
}