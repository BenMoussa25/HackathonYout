import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabase';
import { HostelCard } from './HostelCard';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Hostel {
  id: string;
  name: string;
  location: string;
  description: string;
  country: string;
  latitude: number;
  longitude: number;
  eco_score: number;
  travel_score: number;
  education_score: number;
  rating: number;
  image_url: string | null;
}

export function HostelsList({ onViewDetails }: { onViewDetails?: (id: string) => void }) {
  const { user } = useAuth();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostels();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadHostels = async () => {
    try {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .order('eco_score', { ascending: false });

      if (error) throw error;
      setHostels(data || []);
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('hostel_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(new Set(data?.map(f => f.hostel_id) || []));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const filteredHostels = filter === 'all'
    ? hostels
    : hostels.filter(h => h.country === filter);

  const countries = [
    { value: 'all', label: 'All' },
    { value: 'tunisia', label: 'Tunisia' },
    { value: 'morocco', label: 'Morocco' },
    { value: 'egypt', label: 'Egypt' },
    { value: 'jordan', label: 'Jordan' },
    { value: 'uae', label: 'UAE' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading hostels...</div>
      </div>
    );
  }

  return (
    <section id="hostels" className="py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Sustainable Hostels
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
            Discover hostels leading the way in sustainability across the Arab region
          </p>
        </div>

        <div className="mb-12">
          <div className="overflow-hidden rounded-lg" style={{ height: '400px' }}>
            <MapContainer
              center={[25, 45]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {hostels.map(hostel => (
                <Marker
                  key={hostel.id}
                  position={[hostel.latitude, hostel.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{hostel.name}</h3>
                      <p className="text-sm">{hostel.location}</p>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded">
                          Eco Score: {hostel.eco_score}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="flex pb-2 mb-8 overflow-x-auto">
          <div className="flex space-x-4">
            {countries.map(country => (
              <button
                key={country.value}
                onClick={() => setFilter(country.value)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  filter === country.value
                    ? 'border-b-3 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {country.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map(hostel => (
            <HostelCard
              key={hostel.id}
              hostel={hostel}
              isFavorite={favorites.has(hostel.id)}
              onFavoriteToggle={() => {
                loadFavorites();
              }}
              onViewDetails={() => onViewDetails?.(hostel.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
