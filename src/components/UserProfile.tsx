
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Award, User as UserIcon } from 'lucide-react';

export function UserProfile() {
  const { user, profile, loading, updateProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', country: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [hostel, setHostel] = useState<any | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userCoinTx, setUserCoinTx] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || '', phone: profile.phone || '', country: profile.country || '', bio: profile.bio || '' });
    }
  }, [profile]);

  useEffect(() => {
    if (user) loadHostelAndCoins();
  }, [user]);

  const loadHostelAndCoins = async () => {
    try {
      const { data: hostelData, error: hostelErr } = await supabase
        .from('hostels')
        .select('*')
        .eq('manager_id', user!.id)
        .maybeSingle();
      if (hostelErr) throw hostelErr;
      setHostel(hostelData || null);

      if (hostelData) {
        const { data: coinsData, error: coinsErr } = await supabase
          .from('coin_transactions')
          .select('coins')
          .eq('hostel_id', hostelData.id);
        if (coinsErr) throw coinsErr;
        const total = coinsData?.reduce((s: number, r: any) => s + (r.coins || 0), 0) || 0;
        setCoins(total);
      } else {
        setCoins(null);
      }
    } catch (err) {
      console.error('Error loading hostel/coins:', err);
    }
    // load user-specific coin transactions
    try {
      const { data: uData, error: uErr } = await supabase
        .from('coin_transactions')
        .select('id, coins, activity_id, hostel_id, description, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (uErr) throw uErr;
      const totalUser = (uData || []).reduce((s: number, r: any) => s + (r.coins || 0), 0);
      setUserCoins(totalUser);
      setUserCoinTx(uData || []);
    } catch (err) {
      console.error('Error loading user coin transactions:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: form.full_name, phone: form.phone, country: form.country, bio: form.bio });
      alert('Profile updated');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading profile...</div>;
  if (!user) return <div className="py-12 text-center">Please sign in to view your profile.</div>;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-700 shadow">
              {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : <UserIcon className="w-10 h-10 text-green-400" />}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">{profile?.full_name || 'My Profile'}</h2>
              <p className="mt-1 text-sm text-gray-600">View and edit your account details.</p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">{profile?.role}</span>
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">{user.email}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">User ID: {user.id}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Edit Card */}
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500">
                  <option value="">Select a country</option>
                  <option value="tunisia">Tunisia</option>
                  <option value="morocco">Morocco</option>
                  <option value="egypt">Egypt</option>
                  <option value="jordan">Jordan</option>
                  <option value="uae">UAE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:ring-green-500 focus:border-green-500" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 font-semibold shadow">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Summary Card */}
          <div className="bg-white rounded-xl shadow p-8 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Account Summary</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Joined Hostel</div>
                <div className="mt-1 font-medium text-gray-900">{hostel ? hostel.name : 'None'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Hostel Coins</div>
                <div className="mt-1 font-medium text-gray-900">{coins !== null ? coins : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-200" />

        {/* Coins Section */}
        <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Coins</h3>
          <div className="flex flex-col items-center">
            <div className="p-6 rounded-lg bg-yellow-50 flex items-center w-full max-w-xs justify-center mb-6">
              <Award className="w-8 h-8 mr-4 text-yellow-600" />
              <div>
                <div className="text-3xl font-bold text-yellow-600">{userCoins}</div>
                <div className="text-sm text-gray-600">Eco Coins</div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Coin Transactions</h4>
            {userCoinTx.length === 0 ? (
              <div className="p-4 text-gray-500 bg-gray-50 rounded">No coin transactions yet.</div>
            ) : (
              <ul className="space-y-2">
                {userCoinTx.map(tx => (
                  <li key={tx.id} className="p-3 bg-gray-50 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-gray-700">{tx.description || `Activity ${tx.activity_id}`}</div>
                    <div className="flex items-center gap-4 mt-1 md:mt-0">
                      <div className="text-sm font-medium text-green-600">+{tx.coins}</div>
                      <div className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
