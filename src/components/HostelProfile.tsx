import { useEffect, useState } from 'react';
import { supabase, type Database } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type HostelRow = Database['public']['Tables']['hostels']['Row'];
type ActivityRow = Database['public']['Tables']['hostel_activities']['Row'];

export function HostelProfile({ hostelId, onBack }: { hostelId: string; onBack?: () => void }) {
  const { user } = useAuth();
  const [hostel, setHostel] = useState<HostelRow | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [commentsByActivity, setCommentsByActivity] = useState<Record<string, any[]>>({});
  const [photosByActivity, setPhotosByActivity] = useState<Record<string, any[]>>({});
  const [videosByActivity, setVideosByActivity] = useState<Record<string, any[]>>({});
  const [ratingsByActivity, setRatingsByActivity] = useState<Record<string, { avg: number; count: number }>>({});
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [ratingInputs, setRatingInputs] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAll();
  }, [hostelId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: hostelData, error: hostelErr } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', hostelId)
        .maybeSingle();
      if (hostelErr) throw hostelErr;
      setHostel(hostelData || null);

      const { data: activitiesData, error: activitiesErr } = await supabase
        .from('hostel_activities')
        .select('*')
        .eq('hostel_id', hostelId)
        .order('created_at', { ascending: false });
      if (activitiesErr) throw activitiesErr;
      setActivities(activitiesData || []);

      const ids = (activitiesData || []).map((a: any) => a.id);

  if (ids.length > 0) {
        const { data: commentsData } = await supabase
          .from('event_comments')
          .select('*')
          .in('activity_id', ids);

        const commentsMap: Record<string, any[]> = {};
        (commentsData || []).forEach((c: any) => {
          commentsMap[c.activity_id] = commentsMap[c.activity_id] || [];
          commentsMap[c.activity_id].push(c);
        });
        setCommentsByActivity(commentsMap);

        const { data: photosData } = await supabase
          .from('event_photos')
          .select('*')
          .in('activity_id', ids);

        const photosMap: Record<string, any[]> = {};
        (photosData || []).forEach((p: any) => {
          photosMap[p.activity_id] = photosMap[p.activity_id] || [];
          photosMap[p.activity_id].push(p);
        });

        setPhotosByActivity(photosMap);

        // Load videos
        const { data: videosData } = await supabase
          .from('event_videos')
          .select('*')
          .in('activity_id', ids);
        const videosMap: Record<string, any[]> = {};
        (videosData || []).forEach((v: any) => {
          videosMap[v.activity_id] = videosMap[v.activity_id] || [];
          videosMap[v.activity_id].push(v);
        });
        setVideosByActivity(videosMap);

        const { data: ratingsData } = await supabase
          .from('event_ratings')
          .select('*')
          .in('activity_id', ids);

        const ratingsMap: Record<string, { sum: number; count: number }> = {};
        (ratingsData || []).forEach((r: any) => {
          const map = ratingsMap[r.activity_id] || { sum: 0, count: 0 };
          map.sum += r.rating;
          map.count += 1;
          ratingsMap[r.activity_id] = map;
        });

        const finalRatings: Record<string, { avg: number; count: number }> = {};
        Object.keys(ratingsMap).forEach(k => {
          const v = ratingsMap[k];
          finalRatings[k] = { avg: v.sum / v.count, count: v.count };
        });
        setRatingsByActivity(finalRatings);
      } else {
        setCommentsByActivity({});
  setPhotosByActivity({});
  setVideosByActivity({});
        setRatingsByActivity({});
      }
    } catch (err) {
      console.error('Error loading hostel profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (activityId: string) => {
    const content = commentInputs[activityId];
    if (!content || !user) return;
    try {
      const { error } = await supabase.from('event_comments').insert({
        activity_id: activityId,
        user_id: user.id,
        comment: content,
      });
      if (error) throw error;
      setCommentInputs(prev => ({ ...prev, [activityId]: '' }));
      await loadAll();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    }
  };

  const handleFileChange = async (activityId: string, file?: File, type: 'photo' | 'video' = 'photo') => {
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `activity_${activityId}/${Date.now()}.${fileExt}`;
    const bucket = type === 'photo' ? 'event-photos' : 'event-videos';
    try {
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      if (type === 'photo') {
        const { error: insertErr } = await supabase.from('event_photos').insert({
          activity_id: activityId,
          user_id: user.id,
          url: publicUrl,
        });
        if (insertErr) throw insertErr;
      } else {
        const { error: insertErr } = await supabase.from('event_videos').insert({
          activity_id: activityId,
          user_id: user.id,
          url: publicUrl,
        });
        if (insertErr) throw insertErr;
      }

      await loadAll();
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRate = async (activityId: string) => {
    if (!user) return;
    const rating = ratingInputs[activityId];
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    try {
      const payload = {
        activity_id: activityId,
        user_id: user.id,
        rating,
      };
      const { error } = await supabase.from('event_ratings').upsert([payload], { onConflict: 'activity_id,user_id' });
      if (error) throw error;
      setRatingInputs(prev => ({ ...prev, [activityId]: 0 }));
      await loadAll();
    } catch (err) {
      console.error('Error rating activity:', err);
      alert('Failed to rate activity');
    }
  };

  if (loading) return <div className="py-12 text-center">Loading hostel profile...</div>;

  if (!hostel) return <div className="py-12 text-center">Hostel not found</div>;

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{hostel.name}</h2>
            <p className="text-sm text-gray-600">{hostel.location} • {hostel.country}</p>
          </div>
          <div>
            <button onClick={() => onBack?.()} className="px-4 py-2 text-sm font-medium text-green-500 border border-green-500 rounded-md">Back</button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-700">{hostel.description}</p>
        </div>

        <div className="space-y-6">
          {activities.map(activity => (
            <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                  <div className="text-sm text-gray-500">{activity.type} • {new Date(activity.activity_date).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Points: {activity.points}</div>
                  <div>Coins: {activity.coins}</div>
                  <div>Status: {activity.status}</div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">{activity.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Photos</div>
                  <div className="flex flex-wrap mt-2 gap-2">
                    {(photosByActivity[activity.id] || []).map((p: any) => (
                      <img key={p.id} src={p.url} alt="event" className="object-cover w-24 h-24 rounded" />
                    ))}
                    <label className="inline-block px-3 py-2 mt-2 text-sm text-white bg-green-500 rounded cursor-pointer">
                      {uploading ? 'Uploading...' : 'Add Photo'}
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(activity.id, e.target.files?.[0], 'photo')} className="hidden" />
                    </label>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700">Videos</div>
                    <div className="flex flex-wrap mt-2 gap-2">
                      {(videosByActivity[activity.id] || []).map((v: any) => (
                        <video key={v.id} src={v.url} controls className="object-cover w-32 h-24 rounded" />
                      ))}
                      <label className="inline-block px-3 py-2 mt-2 text-sm text-white bg-blue-500 rounded cursor-pointer">
                        {uploading ? 'Uploading...' : 'Add Video'}
                        <input type="file" accept="video/*" onChange={(e) => handleFileChange(activity.id, e.target.files?.[0], 'video')} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Comments</div>
                  <div className="mt-2 space-y-2">
                    {(commentsByActivity[activity.id] || []).map((c: any) => (
                      <div key={c.id} className="p-2 bg-white rounded border">
                        <div className="text-sm text-gray-700">{c.comment}</div>
                        <div className="mt-1 text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                      </div>
                    ))}

                    <div className="mt-2">
                      <textarea value={commentInputs[activity.id] || ''} onChange={(e) => setCommentInputs(prev => ({ ...prev, [activity.id]: e.target.value }))} className="w-full px-3 py-2 border rounded" rows={2} />
                      <div className="flex justify-end mt-2">
                        <button onClick={() => handleAddComment(activity.id)} className="px-3 py-1 text-sm text-white bg-green-500 rounded">Add Comment</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Rate this Activity</div>
                  <div className="mt-2">
                    <select value={ratingInputs[activity.id] || 0} onChange={(e) => setRatingInputs(prev => ({ ...prev, [activity.id]: Number(e.target.value) }))} className="px-3 py-2 border rounded">
                      <option value={0}>Select rating</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <div className="mt-2">
                      <button onClick={() => handleRate(activity.id)} className="px-3 py-1 text-sm text-white bg-green-500 rounded">Submit Rating</button>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      Average: {ratingsByActivity[activity.id]?.avg ? ratingsByActivity[activity.id].avg.toFixed(1) : '—'} ({ratingsByActivity[activity.id]?.count || 0} ratings)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HostelProfile;
