import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../styles/theme.dart';

// --- 🟢 BOOKING PROVIDER (State Management) ---
// Manages the state of the booking process (PRD: State Management/Business Logic)
class BookingProvider extends ChangeNotifier {
  String? selectedServiceId;
  DateTime? selectedDate;
  TimeOfDay? selectedTime;
  String bookingMessage = '';

  // Mock booking attempts (Simulates API call)
  Future<bool> attemptBook(String serviceId, DateTime date, TimeOfDay time) async {
    // SIMULATION: Check for conflicts (Placeholder for backend check)
    if (date.day < 10) {
      // Arbitrary conflict rule for demo purposes
      return false; // Conflict detected
    }
    
    // Simulate API latency
    await Future.delayed(const Duration(seconds: 1)); 
    
    // Success simulation
    return true;
  }

  // Public methods for state interaction
  void resetBooking() {
    selectedServiceId = null;
    selectedDate = null;
    selectedTime = null;
    bookingMessage = '';
    notifyListeners();
  }
}


// --- BOOKING SCREEN ---
class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _formKey = FormKey();

  @override
  void initState() {
    super.initState();
    // Logic to pre-select service if navigated from ServiceScreen
    // (In a full app, this would pass the Service ID via the route arguments)
  }

  void _confirmBooking() async {
    final form = Form.of(context);
    if (!form.currentState!.validate()) {
      return;
    }

    final bookingProvider = Provider.of<BookingProvider>(context, listen: false);

    // Step 1: Validate all inputs (Service ID, Date, Time)
    if (bookingProvider.selectedServiceId == null || bookingProvider.selectedDate == null || bookingProvider.selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a service, date, and time.')),
      );
      return;
    }
    
    // Step 2: Attempt booking via provider (API call simulation)
    isLoading(true);
    final success = await bookingProvider.attemptBook(
        bookingProvider.selectedServiceId!, 
        bookingProvider.selectedDate!, 
        bookingProvider.selectedTime!);
    isLoading(false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ Booking Confirmed! Confirmation sent.')),
      );
      // Clear state on success
      Provider.of<BookingProvider>(context, listen: false).resetBooking();
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ Booking failed. Time slot conflict detected. Please try another time.')),
      );
    }
  }

  void isLoading(bool loading) {
    // Simple way to show loading state across UI elements
    // (In a real app, we'd use a Provider/State to manage this globally)
  }

  @override
  Widget build(BuildContext context) {
    // For simplicity, we pass the provider directly to enable access in builders
    return ChangeNotifierProvider(
      create: (_) => BookingProvider(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Book Appointment', style: TextStyle(color: Colors.white)),
          backgroundColor: AppColors.surfaceDark,
          elevation: 0,
        ),
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Secure your next appointment with Enlyten2.', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 30),
              
              // 1. Service Selector (Dropdown/Picker)
              Text('1. Select Service', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 10),
              // Placeholder for DropdownBuilder
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primaryPink.withOpacity(0.5)),
                ),
                child: Text('Selected Service: Laser Hair Removal (Selected via Provider)', style: TextStyle(color: AppColors.primaryPink)),
              ),
              const SizedBox(height: 25),

              // 2. Date Picker
              Text('2. Select Date', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 10),
              // Placeholder for DatePickerWidget
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade700)..width = 0.5,
                ),
                child: const Text('Date: Tuesday, April 22, 2026'),
              ),
              const SizedBox(height: 25),

              // 3. Time Picker
              Text('3. Select Time', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primaryPink),
                ),
                child: const Text('Time: 10:00 AM'),
              ),
              const SizedBox(height: 40),

              // Confirmation Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _confirmBooking,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryPink,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('CONFIRM BOOKING', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}