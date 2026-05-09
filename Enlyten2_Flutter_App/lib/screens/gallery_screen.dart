import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:enlyten2_flutter_app/styles/theme.dart';

// --- Placeholder Image Data ---
// In a real app, these would come from the API/Supabase Storage
final List<Map<String, String>> mockGalleryData = [
  {'before': 'assets/img/before_01.jpg', 'after': 'assets/img/after_01.jpg', 'category': 'Skin Brightening'},
  {'before': 'assets/img/before_02.jpg', 'after': 'assets/img/after_02.jpg', 'category': 'Laser Tattoo'},
  {'before': 'assets/img/before_03.jpg', 'after': 'assets/img/after_03.jpg', 'category': 'Body Contouring'},
  {'before': 'assets/img/before_04.jpg', 'after': 'assets/img/after_04.jpg', 'category': 'Skin Brightening'},
  {'before': 'assets/img/before_05.jpg', 'after': 'assets/img/after_05.jpg', 'category': 'Facial'},
  {'before': 'assets/img/before_06.jpg', 'after': 'assets/img/after_06.jpg', 'category': 'Body Contouring'},
];


class GalleryScreen extends StatelessWidget {
  const GalleryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Before & After Gallery', style: TextStyle(color: Colors.white)),
        backgroundColor: AppColors.surfaceDark,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('See the Transformation', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 20),
            // Grid View for quick browsing
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12.0,
                  mainAxisSpacing: 12.0,
                  childAspectRatio: 0.85, // Slightly taller than square
                ),
                itemCount: mockGalleryData.length,
                itemBuilder: (context, index) {
                  final item = mockGalleryData[index];
                  return GestureDetector(
                    onTap: () {
                      // TODO: Implement full-screen modal view with before/after comparison slider
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey[850],
                        borderRadius: BorderRadius.circular(12),
                        image: DecorationImage(
                          image: AssetImage(item['before']!),
                          fit: BoxFit.cover,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 5,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          Align(
                            alignment: Alignment.bottomCenter,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                    colors: [Colors.transparent, Colors.black.withOpacity(0.9)],
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter
                                ),
                                borderRadius: const BorderRadius.vertical(bottom: Radius.circular(12)),
                              ),
                              child: Text('Category: ${mockGalleryData[index]['category']}', style: TextStyle(color: Colors.white, fontSize: 14)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}