import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ThreadRow = any;
type PostRow = any;

export function Forum() {
  const { user, profile } = useAuth();
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadRow | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCountry, setNewThreadCountry] = useState(profile?.country || 'all');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('forum_threads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setThreads(data || []);
    } catch (err) {
      console.error('Error loading threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (thread: ThreadRow) => {
    setSelectedThread(thread);
    try {
      const { data, error } = await supabase.from('forum_posts').select('*').eq('thread_id', thread.id).order('created_at', { ascending: true });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const createThread = async () => {
    if (!user || !newThreadTitle) {
      alert('Please sign in and provide a title');
      return;
    }
    try {
      const { error } = await supabase.from('forum_threads').insert({ title: newThreadTitle, creator_id: user.id, country: newThreadCountry || null });
      if (error) throw error;
      setNewThreadTitle('');
      await loadThreads();
    } catch (err) {
      console.error('Error creating thread:', err);
      alert('Failed to create thread');
    }
  };

  const createPost = async () => {
    if (!user || !selectedThread || !newPostContent) {
      alert('Please sign in and add some content');
      return;
    }
    try {
      const { error } = await supabase.from('forum_posts').insert({ thread_id: selectedThread.id, author_id: user.id, content: newPostContent });
      if (error) throw error;
      setNewPostContent('');
      // reload posts
      openThread(selectedThread);
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }
  };

  if (loading) return <div className="py-12 text-center">Loading forum...</div>;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Regional Forum</h2>
          <p className="mt-2 text-lg text-gray-600">Join the conversation on sustainable tourism across the Arab world. Share your experiences, ask questions, and connect with fellow eco-conscious travelers.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Start a New Discussion</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="thread-title" className="block text-sm font-medium text-gray-700">Thread Title</label>
                  <input 
                    id="thread-title"
                    value={newThreadTitle} 
                    onChange={(e) => setNewThreadTitle(e.target.value)} 
                    placeholder="What would you like to discuss?" 
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" 
                  />
                </div>
                <div>
                  <label htmlFor="thread-region" className="block text-sm font-medium text-gray-700">Region</label>
                  <select 
                    id="thread-region"
                    value={newThreadCountry} 
                    onChange={(e) => setNewThreadCountry(e.target.value)} 
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">All Regions</option>
                    <option value="tunisia">Tunisia</option>
                    <option value="morocco">Morocco</option>
                    <option value="egypt">Egypt</option>
                    <option value="jordan">Jordan</option>
                    <option value="uae">UAE</option>
                  </select>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={createThread} 
                    className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create Thread
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discussion Threads</h3>
              <ul className="divide-y divide-gray-200">
                {threads.length === 0 ? (
                  <li className="py-4 text-center text-gray-500">No threads yet. Start the first discussion!</li>
                ) : (
                  threads.map(t => (
                    <li key={t.id}>
                      <button 
                        onClick={() => openThread(t)} 
                        className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 group-hover:text-green-600">{t.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {t.country === 'all' ? 'All Regions' : t.country}
                              <span className="mx-2">•</span>
                              {new Date(t.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-green-500 opacity-0 group-hover:opacity-100">
                            View →
                          </div>
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              {selectedThread ? (
                <div>
                  <div className="pb-4 mb-6 border-b">
                    <h3 className="text-xl font-medium text-gray-900">{selectedThread.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedThread.country === 'all' ? 'All Regions' : selectedThread.country}
                      <span className="mx-2">•</span>
                      Started {new Date(selectedThread.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {posts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        No replies yet. Be the first to respond!
                      </div>
                    ) : (
                      posts.map(p => (
                        <div key={p.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="prose max-w-none text-gray-800">{p.content}</div>
                          <div className="mt-2 text-sm text-gray-500">
                            Posted on {new Date(p.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}

                    <div className="pt-6 mt-6 border-t">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Add Your Reply</h4>
                      <div className="space-y-4">
                        <textarea 
                          value={newPostContent} 
                          onChange={(e) => setNewPostContent(e.target.value)} 
                          rows={4} 
                          placeholder="Share your thoughts..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" 
                        />
                        <div className="flex justify-end">
                          <button 
                            onClick={createPost} 
                            className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">Select a thread from the list to view the discussion</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Forum;
