import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function CreateHostel({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    location: '',
    country: 'tunisia',
    description: '',
    latitude: '',
    longitude: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be signed in to create a hostel');
      return;
    }

    if (!form.name || !form.location || !form.country || !form.latitude || !form.longitude || !form.description) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);

      const { error } = await supabase
        .from('hostels')
        .insert({
          manager_id: user.id,
          name: form.name,
          location: form.location,
          description: form.description,
          country: form.country,
          latitude,
          longitude,
          eco_score: 0,
          travel_score: 0,
          education_score: 0,
          rating: 0,
          image_url: form.image_url || null,
        })
  .select()
  .maybeSingle();

      if (error) throw error;

      setForm({ name: '', location: '', country: 'tunisia', description: '', latitude: '', longitude: '', image_url: '' });
      alert('Hostel created successfully');
      onCreated?.();
    } catch (err) {
      console.error('Error creating hostel:', err);
      alert('Failed to create hostel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl px-4 mx-auto bg-white rounded-lg shadow sm:px-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create Your Hostel</h3>
          <p className="mt-1 text-sm text-gray-500">Fill the details below to register your hostel on Eco-Stay Connect.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location (address/city)</label>
              <input name="location" value={form.location} onChange={handleChange} required className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="tunisia">Tunisia</option>
                  <option value="morocco">Morocco</option>
                  <option value="egypt">Egypt</option>
                  <option value="jordan">Jordan</option>
                  <option value="uae">UAE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                <input name="image_url" value={form.image_url} onChange={handleChange} className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input name="latitude" value={form.latitude} onChange={handleChange} required className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input name="longitude" value={form.longitude} onChange={handleChange} required className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Hostel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateHostel;
