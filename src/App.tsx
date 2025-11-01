import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { HeroWithAuth as Hero } from './components/HeroWithAuth';
import { HostelsList } from './components/HostelsList';
import { ChatBot } from './components/ChatBot';
import { HostelProfile } from './components/HostelProfile';
import { Forum } from './components/Forum';
import { UserProfile } from './components/UserProfile';
import { WishesSection } from './components/WishesSection';
import { JoinOrActivitiesSection } from './components/JoinOrActivitiesSection';
import { Dashboard } from './components/Dashboard';
import { Sprout, MapPin, Lightbulb } from 'lucide-react';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);

  const handleAuthClick = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation onAuthClick={handleAuthClick} onNavigate={handleNavigate} />

        <main>
          {currentSection === 'home' && (
            <>
              <Hero onAuthClick={handleAuthClick} />

              <section className="py-16 bg-gradient-to-br from-green-50 to-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="mb-14 text-center">
                    <h2 className="text-4xl font-extrabold text-green-700 sm:text-5xl drop-shadow-sm">
                      Why Join Eco-Stay Connect?
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-xl text-green-900/80">
                      Our platform helps hostels showcase their sustainability efforts and learn from each other.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="relative group transition-transform hover:-translate-y-2">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg border-4 border-white">
                          <Sprout className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="pt-12 pb-8 px-8 bg-white rounded-2xl shadow-lg border border-green-100 flex flex-col items-center text-center min-h-[320px]">
                        <h3 className="mt-6 text-xl font-semibold text-green-800">Sustainability Scoring</h3>
                        <p className="mt-4 text-base text-gray-600">
                          Track and showcase your environmental initiatives with our point-based scoring system. Earn badges and recognition for your efforts.
                        </p>
                      </div>
                    </div>
                    <div className="relative group transition-transform hover:-translate-y-2">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg border-4 border-white">
                          <MapPin className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="pt-12 pb-8 px-8 bg-white rounded-2xl shadow-lg border border-green-100 flex flex-col items-center text-center min-h-[320px]">
                        <h3 className="mt-6 text-xl font-semibold text-green-800">Interactive Map</h3>
                        <p className="mt-4 text-base text-gray-600">
                          Be discovered by eco-conscious travelers through our interactive map that highlights sustainable hostels across the Arab region.
                        </p>
                      </div>
                    </div>
                    <div className="relative group transition-transform hover:-translate-y-2">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-br from-yellow-400 to-green-500 rounded-full shadow-lg border-4 border-white">
                          <Lightbulb className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="pt-12 pb-8 px-8 bg-white rounded-2xl shadow-lg border border-green-100 flex flex-col items-center text-center min-h-[320px]">
                        <h3 className="mt-6 text-xl font-semibold text-green-800">Traveler Wishes</h3>
                        <p className="mt-4 text-base text-gray-600">
                          Connect with travelers who suggest sustainability ideas. Implement their wishes and earn bonus points while creating memorable experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Show join section only if not logged in, else show recent activities */}
              <JoinOrActivitiesSection handleAuthClick={handleAuthClick} />
            </>
          )}

          {currentSection === 'hostels' && (
            <HostelsList onViewDetails={(id: string) => {
              setSelectedHostelId(id);
              setCurrentSection('hostel_profile');
            }} />
          )}
          {currentSection === 'hostel_profile' && selectedHostelId && (
            <HostelProfile hostelId={selectedHostelId} onBack={() => setCurrentSection('hostels')} />
          )}
          {currentSection === 'forum' && <Forum />}
          {currentSection === 'profile' && <UserProfile />}
          {currentSection === 'wishes' && <WishesSection />}
          {currentSection === 'dashboard' && <Dashboard />}
        </main>

        <footer className="bg-white">
          <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">About</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Our Mission</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Team</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Partners</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Sustainability Guide</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Help Center</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Case Studies</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Cookie Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Connect</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Instagram</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col justify-between pt-8 mt-8 border-t border-gray-200 md:flex-row">
              <p className="text-base text-gray-400">
                &copy; 2024 Eco-Stay Connect. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialTab={authModalTab}
        />
        <ChatBot />
      </div>
    </AuthProvider>
  );
}

export default App;
