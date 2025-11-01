# Eco-Stay Connect

A sustainable hostels network platform built with React, TypeScript, and Supabase. This application connects eco-friendly hostels across the Arab world, enabling them to track sustainability efforts, share best practices, and engage with eco-conscious travelers.

## Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Hostel Listings**: Browse sustainable hostels with interactive map
- **Sustainability Scoring**: Track eco-points, travel quality, and educational impact
- **Traveler Wishes**: Submit and adopt sustainability ideas
- **Dashboard**: Hostel managers can log activities and track progress
- **Coin System**: Earn eco-coins for sustainable activities
- **Real-time Data**: Powered by Supabase database

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Database & Authentication)
- Leaflet (Interactive Maps)
- Lucide React (Icons)

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. The database migrations have already been applied via the MCP tools
3. Get your Supabase URL and anon key from your project settings

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles (travelers and hostel managers)
- **hostels**: Hostel information and sustainability scores
- **hostel_activities**: Logged sustainability activities
- **wishes**: Traveler sustainability wishes
- **badges**: Achievement badges
- **coin_transactions**: Eco-coin transaction history
- **favorites**: User favorite hostels

All tables have Row Level Security (RLS) enabled for data protection.

## Usage

### For Travelers

1. Create an account as a traveler
2. Browse sustainable hostels on the interactive map
3. Submit sustainability wishes
4. Add hostels to favorites

### For Hostel Managers

1. Create an account as a hostel manager
2. Create your hostel profile
3. Access the dashboard to:
   - Log sustainability activities
   - Track eco-scores and coins
   - Adopt and complete traveler wishes
   - View analytics

## Key Components

- **AuthContext**: Manages authentication state
- **Navigation**: Top navigation bar
- **Hero**: Landing page hero section
- **HostelsList**: Displays hostels with map
- **WishesSection**: Traveler wishes interface
- **Dashboard**: Hostel manager dashboard

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access and modify their own data
- Hostel managers can only edit their own hostels
- Public read access for hostel and wish listings

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
