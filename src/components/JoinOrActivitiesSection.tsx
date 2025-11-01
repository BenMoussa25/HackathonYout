import { useAuth } from '../contexts/AuthContext';
import { Activity, Award } from 'lucide-react';

interface Props {
  handleAuthClick: (tab: 'login' | 'signup') => void;
}

const fakeActivities = [
  {
    id: 1,
    hostel: 'Green Oasis Hostel',
    activity: 'Installed solar panels',
    coins: 120,
    date: '2025-10-28',
  },
  {
    id: 2,
    hostel: 'Eco Youth Inn',
    activity: 'Organized beach cleanup',
    coins: 80,
    date: '2025-10-25',
  },
  {
    id: 3,
    hostel: 'Atlas Eco Hostel',
    activity: 'Started composting program',
    coins: 60,
    date: '2025-10-22',
  },
  {
    id: 4,
    hostel: 'Sahara Stay',
    activity: 'Reduced water usage by 20%',
    coins: 100,
    date: '2025-10-20',
  },
  {
    id: 5,
    hostel: 'Palm Tree Hostel',
    activity: 'Planted 50 trees',
    coins: 90,
    date: '2025-10-18',
  },
];

export function JoinOrActivitiesSection({ handleAuthClick }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <section className="py-12 text-white bg-gradient-to-r from-green-500 to-green-700">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl">
            Ready to join our sustainable hostel network?
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-green-100">
            Whether you're a hostel looking to showcase your sustainability efforts or a traveler wanting to support eco-friendly stays, Eco-Stay Connect is your platform.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => handleAuthClick('signup')}
              className="px-6 py-3 text-lg font-medium text-green-600 transition duration-150 ease-in-out bg-white rounded-md hover:bg-gray-100"
            >
              Join Now
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="px-6 py-3 text-lg font-medium text-white transition duration-150 ease-in-out border-2 border-white rounded-md hover:bg-green-600"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show fake recent activities for logged-in users
  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-white">
      <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-green-700 sm:text-4xl drop-shadow-sm">
            Recent Hostel Activities
          </h2>
          <p className="max-w-2xl mx-auto mt-3 text-lg text-green-900/80">
            See what hostels in the network have been up to recently!
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fakeActivities.map(act => (
            <li key={act.id} className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border border-green-100">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <Award className="w-5 h-5 text-yellow-500" />
                <div className="text-xs text-yellow-600 font-bold mt-1">+{act.coins} coins</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-800">{act.hostel}</div>
                <div className="text-base text-gray-700 mt-1">{act.activity}</div>
                <div className="text-xs text-gray-400 mt-2">{new Date(act.date).toLocaleDateString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}