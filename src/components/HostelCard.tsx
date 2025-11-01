import { Star, Heart, Leaf, Briefcase, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Hostel {
  id: string;
  name: string;
  location: string;
  description: string;
  eco_score: number;
  travel_score: number;
  education_score: number;
  rating: number;
  image_url: string | null;
}

interface HostelCardProps {
  hostel: Hostel;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onViewDetails?: () => void;
}

export function HostelCard({ hostel, isFavorite = false, onFavoriteToggle, onViewDetails }: HostelCardProps) {
  const { user } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />);
    }

    const remaining = 5 - fullStars;
    for (let i = 0; i < remaining; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('hostel_id', hostel.id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, hostel_id: hostel.id });
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="overflow-hidden transition duration-300 ease-in-out transform bg-white rounded-lg shadow hover:-translate-y-1 hover:shadow-xl">
      {hostel.image_url && (
        <img
          src={hostel.image_url}
          alt={hostel.name}
          className="object-cover w-full h-48"
        />
      )}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 bg-green-500 rounded-md">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 w-0 ml-5">
            <h3 className="text-lg font-medium text-gray-900">{hostel.name}</h3>
            <p className="text-sm text-gray-500">{hostel.location}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <div className="flex mr-1">{renderStars(hostel.rating)}</div>
            <span className="ml-1 text-sm text-gray-500">{hostel.rating}</span>
          </div>
          <p className="text-sm text-gray-600">{hostel.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
              <Leaf className="w-3 h-3 mr-1" />
              Eco Score: {hostel.eco_score}
            </span>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
              <Briefcase className="w-3 h-3 mr-1" />
              Travel Quality: {hostel.travel_score}
            </span>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-violet-800 bg-violet-100">
              <GraduationCap className="w-3 h-3 mr-1" />
              Educational Gain: {hostel.education_score}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-green-500 rounded-md hover:bg-green-600">
            View Details
          </button>
          <button
            onClick={() => onViewDetails?.()}
            className="px-4 py-2 ml-2 text-sm font-medium text-green-500 transition duration-150 ease-in-out border border-green-500 rounded-md hover:bg-green-50"
          >
            Open Profile
          </button>
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className="px-4 py-2 text-sm font-medium text-green-500 transition duration-150 ease-in-out border border-green-500 rounded-md hover:bg-green-50 disabled:opacity-50"
          >
            <Heart className={`w-4 h-4 inline mr-1 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
}
