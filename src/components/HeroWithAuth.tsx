import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onAuthClick: (tab?: 'login' | 'signup') => void;
}

export function HeroWithAuth({ onAuthClick }: HeroProps) {
  const { user, loading } = useAuth();

  return (
    <section className="text-white bg-gradient-to-r from-green-500 to-green-700">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="items-center lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Connecting Sustainable Hostels Across the Arab World
            </h1>
            <p className="max-w-3xl text-xl text-green-100">
              Eco-Stay Connect unites youth hostels committed to sustainability.
              Share best practices, track your environmental impact, and inspire travelers to choose green.
            </p>
            {!loading && !user && (
              <div className="flex flex-col gap-4 mt-8 sm:flex-row">
                <button
                  onClick={() => onAuthClick('signup')}
                  className="px-6 py-3 text-lg font-medium text-green-600 transition duration-150 ease-in-out bg-white rounded-md hover:bg-gray-100"
                >
                  Join the Network
                </button>
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-6 py-3 text-lg font-medium text-white transition duration-150 ease-in-out border-2 border-white rounded-md hover:bg-green-600"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img
                src="/assets/djerba-hero.jpg"
                alt="Youth Hostel Houmet Souk, Djerba"
                loading="lazy"
                className="w-full h-64 sm:h-80 md:h-96 object-cover block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
