import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Lightbulb } from 'lucide-react';

interface Wish {
  id: string;
  title: string;
  description: string;
  country: string | null;
  votes: number;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export function WishesSection() {
  const { user, profile } = useAuth();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('status', 'open')
        .order('votes', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('Error loading wishes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to submit a wish');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('wishes').insert({
        traveler_id: user.id,
        title: formData.title,
        description: formData.description,
        country: formData.country || null,
      });

      if (error) throw error;

      setFormData({ title: '', description: '', country: '' });
      loadWishes();
      alert('Wish submitted successfully!');
    } catch (error) {
      console.error('Error submitting wish:', error);
      alert('Failed to submit wish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="wishes" className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Traveler Sustainability Wishes
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
            See what eco-conscious travelers want from sustainable hostels
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="mb-4 text-xl font-bold text-green-800">Popular Wishes</h3>
            <div className="space-y-4">
              {wishes.length === 0 ? (
                <p className="text-gray-500">No wishes yet. Be the first to submit one!</p>
              ) : (
                wishes.map(wish => (
                  <div key={wish.id} className="p-4 transition duration-300 bg-white rounded-lg shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900">{wish.title}</h4>
                      <span className="px-2.5 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded">
                        {wish.votes} votes
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{wish.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        Suggested by {wish.profiles?.full_name || 'Anonymous Traveler'}
                      </span>
                      {profile?.role === 'hostel_manager' && (
                        <button className="text-sm font-medium text-green-600 hover:text-green-800">
                          Adopt this Wish
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 bg-white border border-green-200 rounded-lg">
            <h3 className="mb-4 text-xl font-bold text-green-800">Submit Your Wish</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="wish-title" className="block text-sm font-medium text-gray-700">
                  Wish Title
                </label>
                <input
                  type="text"
                  id="wish-title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="wish-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="wish-description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="wish-country" className="block text-sm font-medium text-gray-700">
                  Country (Optional)
                </label>
                <select
                  id="wish-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Any country</option>
                  <option value="tunisia">Tunisia</option>
                  <option value="morocco">Morocco</option>
                  <option value="egypt">Egypt</option>
                  <option value="jordan">Jordan</option>
                  <option value="uae">UAE</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !user}
                className="w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {!user ? 'Sign in to Submit' : loading ? 'Submitting...' : 'Submit Wish'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
