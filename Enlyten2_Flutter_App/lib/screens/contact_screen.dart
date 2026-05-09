import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart'; // Assuming url_launcher is added to pubspec.yaml

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Contact Us', style: Theme.of(context).textTheme.headlineMedium),
          const SizedBox(height: 30),
          
          // 1. Location Details
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('📍 Clinic Location', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 10),
                  const Text('123 Royal Street, Beauty Towers, Doha, Qatar'),
                  const SizedBox(height: 15),
                  // Placeholder for Google Map Widget
                  Container(
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.grey[850],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Center(child: Text('Map Widget Placeholder')),
                  )
                ],
              ),
            ),
          ),
          const SizedBox(height: 30),

          // 2. Contact Buttons
          Text('Get in Touch', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 15),
          
          Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildContactButton(context, '📞 Call Us', '+974 1234 5678', Icons.phone),
                _buildContactButton(context, '💬 WhatsApp', 'https://wa.me/97412345678', Icons.whatsapp),
                _buildContactButton(context, '📧 Email', 'info@enlyten2.com', Icons.email),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactButton(BuildContext context, String text, String url, IconData icon) {
    return Column(
      children: [
        MaterialButton(
          onPressed: () async {
            final uri = Uri.parse(url);
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            } else {
              // Show user notification if the link fails
            }
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Theme.of(context).primaryColor),
              const SizedBox(width: 10),
              Text(text, style: TextStyle(fontSize: 16, color: Colors.white))
            ],
          ),
          materialTapDuration: const Duration(milliseconds: 100),
          child: Container(
            width: 120,
            height: 50,
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                   final uri = Uri.parse(url);
                   if (await canLaunchUrl(uri)) {
                     await launchUrl(uri, mode: LaunchMode.externalApplication);
                   } else {
                     // Show user notification if the link fails
                   }
                },
                borderRadius: BorderRadius.circular(10),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(icon, color: Theme.of(context).primaryColor),
                      const SizedBox(width: 10),
                      Text(text, style: TextStyle(fontSize: 16, color: Colors.white))
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}