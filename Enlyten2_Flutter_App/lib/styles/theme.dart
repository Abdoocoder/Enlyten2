import 'package:flutter/material.dart';

// 🎨 Luminous Canvas Design System Tokens
class AppColors {
  static const Color primaryPink = Color(0xFFF3A2B2); // Primary Accent
  static const Color accentOrange = Color(0xFFFFA07A); // Secondary Accent
  static const Color secondaryPurple = Color(0xFFB19CD9); // Tertiary Accent
  static const Color backgroundDark = Color(0xFF121212); // Main Background
  static const Color surfaceDark = Color(0xFF1E1E1E); // Card/Surface Background
  static const Color textLight = Colors.white70;
}

class AppTheme {
  static ThemeData getTheme() {
    return ThemeData(
      // Core Application Colors
      primaryColor: AppColors.primaryPink,
      colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primaryPink).copyWith(
        primary: AppColors.primaryPink,
        secondary: AppColors.accentOrange,
        onPrimary: Colors.black87,
        surface: AppColors.surfaceDark,
        onSurface: Colors.white,
      ),
      scaffoldBackgroundColor: AppColors.backgroundDark,
      cardColor: AppColors.surfaceDark,
      // Typography
      textTheme: const TextTheme(
        titleLarge: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
        headlineMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
        bodyMedium: TextStyle(color: Colors.white70),
      ),
      // Widgets Styling
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.surfaceDark,
        selectedItemTextColor: AppColors.primaryPink,
        unselectedItemTextColor: Colors.white30,
        selectedLabelStyle: TextStyle(fontWeight: FontWeight.bold),
      ),
      useMaterial3: true,
    );
  }
}