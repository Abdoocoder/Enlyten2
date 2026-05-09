import 'package:flutter/material.dart';
import 'package:enlyten2_flutter_app/styles/theme.dart';
import 'package:enlyten2_flutter_app/screens/booking_screen.dart';
import 'package:enlyten2_flutter_app/widgets/app_button.dart'; // Placeholder for a reusable widget

// --- Mock Data Source (Replaces API calls for now) ---
class Service {
  final String id;
  final String title;
  final String description;
  final String price;
  final String imageUrl;
  final Color accentColor;
  final String category;

  Service({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.accentColor,
    required this.category,
  });
}

class MockServiceData {
  static List<Service> getServices() {
    return [
      // Facial Treatments Category
      Service(
          id: 'svc001',
          title: 'Deep Pore Extraction',
          description: 'Deep cleaning to remove impurities and boost skin clarity.',
          price: '450 SAR',
          imageUrl: 'assets/img/pore.jpg',
          accentColor: AppColors.secondaryPurple,
          category: 'Facial'),
      Service(
          id: 'svc002',
          title: 'HydraFacial Boost',
          description: 'Multi-step hydration treatment for radiant, even skin.',
          price: '600 SAR',
          imageUrl: 'assets/img/hydra.jpg',
          accentColor: AppColors.primaryPink,
          category: 'Facial'),
      // Body Contouring Category
      Service(
          id: 'svc003',
          title: 'Laser Hair Reduction',
          description: 'Long-lasting reduction for stubborn body hair.',
          price: 'Varies',
          imageUrl: 'assets/img/hair.jpg',
          accentColor: AppColors.accentOrange,
          category: 'Body'),
      Service(
          id: 'svc004',
          title: 'Tattoo Removal',
          description: 'Gradual, safe removal of unwanted pigmented tattoos.',
          price: 'From 800 SAR',
          imageUrl: 'assets/img/tattoo.jpg',
          accentColor: AppColors.secondaryPurple,
          category: 'Body'),
      // Maintenance Category
      Service(
          id: 'svc005',
          title: 'Skin Consultation',
          description: 'Personalized skin analysis and care plan. Mandatory first step.',
          price: '300 SAR',
          imageUrl: 'assets/img/consult.jpg',
          accentColor: AppColors.accentOrange,
          category: 'Consultation'),
    ];
  }
}


class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Group services by category for better UI flow
    final Map<String, List<Service>> categorizedServices = _groupByCategory(MockServiceData.getServices());

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Our Signature Treatments', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 30),
            
            // Loop through categories and display them
            ...categorizedServices.entries.map((entry) {
              final categoryName = entry.key;
              final services = entry.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 30.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Header
                    Padding(
                      padding: const EdgeInsets.only(bottom: 15.0),
                      child: Text(
                        '${categoryName} Treatments',
                        style: Theme.of(context).textTheme.titleLarge!.copyWith(color: AppColors.primaryPink),
                      ),
                    ),
                    // List of Services in this Category
                    ...services.map((service) => Padding(
                      padding: const EdgeInsets.only(bottom: 15.0),
                      child: _ServiceCard(service: service),
                    )).toList(),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  // Helper function to group services by their category
  Map<String, List<Service>> _groupByCategory(List<Service> services) {
    Map<String, List<Service>> map = {};
    for (var service in services) {
      if (!map.containsKey(service.category)) {
        map[service.category] = <Service>[];
      }
      map[service.category]!.add(service);
    }
    return map;
  }
}


// Reusable Card Widget for a single service item
class _ServiceCard extends StatelessWidget {
  final Service service;
  const _ServiceCard({required this.service});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade800)..width = 1,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Image Placeholder
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.grey[850],
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(child: Icon(Icons.photo_library, color: Colors.white30)),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(service.title, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 5),
                Text(service.description, style: Theme.of(context).textTheme.bodyMedium),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(service.price, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: service.accentColor)),
              const SizedBox(height: 10),
              // MODIFIED: Navigates to the BookingScreen, passing the service ID.
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => BookingScreen(initialServiceId: service.id)),
                  );
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(120, 55),
                  backgroundColor: AppColors.primaryPink,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text('Book Now'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}