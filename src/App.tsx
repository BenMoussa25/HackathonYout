import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { Hero } from './components/Hero';
import { HostelsList } from './components/HostelsList';
import { ChatBot } from './components/ChatBot';
import { HostelProfile } from './components/HostelProfile';
import { Forum } from './components/Forum';
import { UserProfile } from './components/UserProfile';
import { WishesSection } from './components/WishesSection';
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

              <section className="py-12 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="mb-12 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      Why Join Eco-Stay Connect?
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
                      Our platform helps hostels showcase their sustainability efforts and learn from each other.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="pt-6">
                      <div className="h-full px-6 pb-8 overflow-hidden bg-gray-50 rounded-lg">
                        <div className="-mt-6">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white bg-green-500 rounded-md">
                            <Sprout className="w-6 h-6" />
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-center text-gray-900">
                            Sustainability Scoring
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Track and showcase your environmental initiatives with our point-based scoring system. Earn badges and recognition for your efforts.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="h-full px-6 pb-8 overflow-hidden bg-gray-50 rounded-lg">
                        <div className="-mt-6">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white bg-green-500 rounded-md">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-center text-gray-900">
                            Interactive Map
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Be discovered by eco-conscious travelers through our interactive map that highlights sustainable hostels across the Arab region.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="h-full px-6 pb-8 overflow-hidden bg-gray-50 rounded-lg">
                        <div className="-mt-6">
                          <div className="flex items-center justify-center w-12 h-12 mx-auto text-white bg-green-500 rounded-md">
                            <Lightbulb className="w-6 h-6" />
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-center text-gray-900">
                            Traveler Wishes
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Connect with travelers who suggest sustainability ideas. Implement their wishes and earn bonus points while creating memorable experiences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
