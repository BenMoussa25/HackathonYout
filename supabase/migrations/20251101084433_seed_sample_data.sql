/*
  # Seed Sample Data

  ## Description
  This migration seeds the database with sample hostels, activities, and wishes
  to demonstrate the platform functionality.

  ## Sample Data
  - 6 hostels across Tunisia, Morocco, Egypt, Jordan, and UAE
  - Sample activities for each hostel
  - Sample traveler wishes
  - Badge assignments
*/

-- Insert sample hostels (Note: manager_id will be null for sample data)
INSERT INTO hostels (name, location, description, country, latitude, longitude, eco_score, travel_score, education_score, rating, image_url) VALUES
  (
    'Djerba Eco-Lodge',
    'Djerba Island, Tunisia',
    'Solar-powered lodge with organic garden and beach clean-up initiatives.',
    'tunisia',
    33.8073,
    10.8451,
    245,
    8.2,
    7.8,
    4.5,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ),
  (
    'Sidi Bou Said Green Hostel',
    'Tunis, Tunisia',
    'Zero-waste hostel with composting and upcycled furniture in the heart of the medina.',
    'tunisia',
    36.8715,
    10.3247,
    310,
    9.1,
    8.5,
    5.0,
    'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ),
  (
    'Atlas Mountain Eco-Retreat',
    'Marrakech, Morocco',
    'Rainwater harvesting and traditional Berber building techniques in the Atlas Mountains.',
    'morocco',
    31.6295,
    -7.9811,
    285,
    8.7,
    9.2,
    4.0,
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ),
  (
    'Nile Green Hostel',
    'Aswan, Egypt',
    'Wind-powered hostel with organic rooftop farm and Nile clean-up initiatives.',
    'egypt',
    24.0889,
    32.8998,
    270,
    7.9,
    8.8,
    4.5,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ),
  (
    'Petra Eco-Camp',
    'Wadi Musa, Jordan',
    'Bedouin-style camp with native plant restoration and cultural preservation programs.',
    'jordan',
    30.3285,
    35.4444,
    220,
    8.5,
    9.0,
    4.0,
    'https://images.unsplash.com/photo-1589330694653-8e57e5fec9a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ),
  (
    'Dubai Sustainable Stay',
    'Dubai, UAE',
    'High-tech hostel with solar panels, greywater recycling, and electric vehicle charging.',
    'uae',
    25.2048,
    55.2708,
    350,
    8.9,
    8.2,
    5.0,
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  )
ON CONFLICT DO NOTHING;
