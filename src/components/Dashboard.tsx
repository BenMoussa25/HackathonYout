import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CreateHostel } from './CreateHostel';
import { BarChart3, TrendingUp, Activity, Award } from 'lucide-react';

interface Hostel {
  id: string;
  name: string;
  eco_score: number;
  travel_score: number;
  education_score: number;
}

interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string;
  activity_date: string;
  points: number;
  coins: number;
  status: string;
}

export function Dashboard() {
  const { user, profile } = useAuth();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [activeSection, setActiveSection] = useState('sustainability');
  const [loading, setLoading] = useState(true);

  const [activityForm, setActivityForm] = useState({
    type: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (user && profile?.role === 'hostel_manager') {
      loadDashboardData();
    }
  }, [user, profile]);

  const loadDashboardData = async () => {
    try {
      const { data: hostelData, error: hostelError } = await supabase
        .from('hostels')
        .select('*')
        .eq('manager_id', user!.id)
        .maybeSingle();

      if (hostelError) throw hostelError;

      if (!hostelData) {
        setLoading(false);
        return;
      }

      setHostel(hostelData);

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('hostel_activities')
        .select('*')
        .eq('hostel_id', hostelData.id)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

      const { data: coinsData, error: coinsError } = await supabase
        .from('coin_transactions')
        .select('coins')
        .eq('hostel_id', hostelData.id);

      if (coinsError) throw coinsError;
      const total = coinsData?.reduce((sum, t) => sum + t.coins, 0) || 0;
      setTotalCoins(total);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hostel) {
      alert('Please create a hostel first');
      return;
    }

    const pointsMap: Record<string, number> = {
      energy: 50,
      water: 40,
      waste: 30,
      community: 20,
      education: 25,
      biodiversity: 35,
    };

    const points = pointsMap[activityForm.type] || 20;

    try {
      const { data: activityData, error: activityError } = await supabase
        .from('hostel_activities')
        .insert({
          hostel_id: hostel.id,
          type: activityForm.type,
          title: activityForm.title,
          description: activityForm.description,
          points,
          coins: points,
          status: 'pending',
        })
        .select()
        .single();

      if (activityError) throw activityError;

      const { error: coinError } = await supabase.from('coin_transactions').insert({
        hostel_id: hostel.id,
        activity_id: activityData.id,
        coins: points,
        description: activityForm.title,
      });

      if (coinError) throw coinError;

      setActivityForm({ type: '', title: '', description: '' });
      loadDashboardData();
      alert('Activity submitted for verification!');
    } catch (error) {
      console.error('Error submitting activity:', error);
      alert('Failed to submit activity');
    }
  };

  if (profile?.role !== 'hostel_manager') {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">This section is only available for hostel managers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <CreateHostel onCreated={loadDashboardData} />
        </div>
      </div>
    );
  }

  return (
    <section id="dashboard" className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Hostel Dashboard
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full md:w-1/4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{hostel.name}</h3>
                  <p className="text-sm text-gray-500">Member since 2024</p>
                </div>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('sustainability')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'sustainability'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Sustainability Score
                </button>
                <button
                  onClick={() => setActiveSection('activities')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'activities'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Activity className="w-5 h-5 mr-3" />
                  My Activities
                </button>
                <button
                  onClick={() => setActiveSection('analytics')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === 'analytics'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Analytics
                </button>
              </nav>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {activeSection === 'sustainability' && (
              <div>
                <div className="mb-6 overflow-hidden bg-white rounded-lg shadow">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Your Sustainability Score
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="p-4 text-center bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{hostel.eco_score}</div>
                        <div className="mt-1 text-sm text-gray-500">Eco Points</div>
                        <div className="mt-2 text-xs text-green-600">
                          Level {Math.floor(hostel.eco_score / 100) + 1}
                        </div>
                      </div>
                      <div className="p-4 text-center bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{hostel.travel_score}</div>
                        <div className="mt-1 text-sm text-gray-500">Travel Quality</div>
                        <div className="mt-2 text-xs text-blue-600">Excellent</div>
                      </div>
                      <div className="p-4 text-center rounded-lg bg-violet-50">
                        <div className="text-3xl font-bold text-violet-600">{hostel.education_score}</div>
                        <div className="mt-1 text-sm text-gray-500">Educational Gain</div>
                        <div className="mt-2 text-xs text-violet-600">Very Good</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                        <span>Next Level: {Math.floor(hostel.eco_score / 100) + 2} (300 points)</span>
                        <span>{300 - (hostel.eco_score % 100)} points needed</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full">
                        <div
                          className="h-2.5 bg-green-600 rounded-full"
                          style={{ width: `${(hostel.eco_score % 100) / 3}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-4 mt-6 rounded-lg bg-yellow-50">
                      <div className="flex items-center">
                        <Award className="w-6 h-6 mr-3 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{totalCoins}</div>
                          <div className="text-sm text-gray-600">Eco Coins</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'activities' && (
              <div>
                <div className="mb-6 overflow-hidden bg-white rounded-lg shadow">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Log New Activity
                    </h3>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleActivitySubmit} className="space-y-4">
                      <div>
                        <label htmlFor="activity-type" className="block text-sm font-medium text-gray-700">
                          Activity Type
                        </label>
                        <select
                          id="activity-type"
                          required
                          value={activityForm.type}
                          onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select an activity type</option>
                          <option value="energy">Energy Conservation</option>
                          <option value="water">Water Management</option>
                          <option value="waste">Waste Reduction</option>
                          <option value="community">Community Engagement</option>
                          <option value="education">Education & Awareness</option>
                          <option value="biodiversity">Biodiversity</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="activity-title" className="block text-sm font-medium text-gray-700">
                          Activity Title
                        </label>
                        <input
                          type="text"
                          id="activity-title"
                          required
                          value={activityForm.title}
                          onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="activity-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="activity-description"
                          rows={3}
                          required
                          value={activityForm.description}
                          onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600"
                      >
                        Submit Activity
                      </button>
                    </form>
                  </div>
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Recent Sustainability Activities
                    </h3>
                  </div>
                  <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                    <ul className="divide-y divide-gray-200">
                      {activities.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No activities yet</li>
                      ) : (
                        activities.map(activity => (
                          <li key={activity.id} className="p-4 transition duration-150 ease-in-out hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-full">
                                <Activity className="w-5 h-5 text-green-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                                <div className="text-sm text-gray-500">
                                  Completed: {new Date(activity.activity_date).toLocaleDateString()} • +{activity.points} points • +{activity.coins} coins
                                </div>
                              </div>
                              <div className="ml-auto">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    activity.status === 'verified'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {activity.status === 'verified' ? 'Verified' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="overflow-hidden bg-white rounded-lg shadow">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Sustainability Analytics
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="p-4 text-center bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{activities.length}</div>
                      <div className="text-sm text-gray-600">Total Activities</div>
                    </div>
                    <div className="p-4 text-center bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {activities.filter(a => a.status === 'verified').length}
                      </div>
                      <div className="text-sm text-gray-600">Verified Activities</div>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-violet-50">
                      <div className="text-2xl font-bold text-violet-600">{totalCoins}</div>
                      <div className="text-sm text-gray-600">Total Coins Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
