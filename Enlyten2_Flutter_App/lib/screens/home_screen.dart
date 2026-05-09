import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner Placeholder (Luxurious look)
            Container(
              height: 250,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
                gradient: LinearGradient(
                  colors: [primaryPink.withOpacity(0.7), secondaryPurple.withOpacity(0.7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: const Center(
                child: Text(
                  'The Art of Radiance. Experience Luxury Skincare.',
                  style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 30),
            // Featured Services CTA
            Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  // Navigation to Services Screen
                },
                icon: const Icon(Icons.spa),
                label: Text('Explore Services'),
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(250, 55),
                  backgroundColor: primaryPink,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
              ),
            ),
            const SizedBox(height: 40),
            // Testimonials Placeholder
            const Text('Client Testimonials', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.grey, // Placeholder color
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text('⭐️⭐️⭐️⭐️⭐️ "Amazing results and a truly luxurious experience!" - Happy Client'),
            ),
          ],
        ),
      ),
    );
  }
}