import React, { useState, useEffect } from 'react';
import { getComplaintsByCity, getComments, addComment, upvoteComplaint, removeUpvote } from "../services/complaintService";
import { useCivicData } from '../hooks/useCivicData';
import { 
  ArrowUp,
  MessageSquare, 
  Send,
  MapPin,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function CommunityFeed() {
  const { currentUser, showToast } = useCivicData();
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState('');
  const [error, setError] = useState(null);

  const [localUpvoted, setLocalUpvoted] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});

  useEffect(() => {
    fetchUserLocationAndFeed();
  }, []);

  const fetchUserLocationAndFeed = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            const extractedCity = data.address?.city || data.address?.state_district || data.address?.state || '';
            
            if (extractedCity) {
              setUserCity(extractedCity);
              loadCityFeed(extractedCity);
            } else {
              setError("Could not determine your city.");
              setLoading(false);
            }
          } catch (err) {
            setError("Location service error.");
            setLoading(false);
          }
        },
        (err) => {
          setError("Please enable location to see your city's feed.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  };

  const loadCityFeed = async (city) => {
    try {
      const res = await getComplaintsByCity(city, 0, 20); // First page, up to 20 posts
      setFeedPosts(res.data?.content || res.data || []);
    } catch (err) {
      console.error("Feed load error:", err);
      setError("Failed to load community feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      if (localUpvoted.has(postId)) {
        await removeUpvote(postId);
        setLocalUpvoted(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        setFeedPosts(prev => prev.map(c => 
          c.id === postId ? { ...c, upvoteCount: Math.max(0, (c.upvoteCount || 1) - 1) } : c
        ));
      } else {
        await upvoteComplaint(postId);
        setLocalUpvoted(prev => new Set(prev).add(postId));
        setFeedPosts(prev => prev.map(c => 
          c.id === postId ? { ...c, upvoteCount: (c.upvoteCount || 0) + 1 } : c
        ));
      }
    } catch (err) {
      console.error("Upvote action failed", err);
      const backendMsg = err.response?.data?.message || "Unable to register upvote. Please try again.";
      showToast(backendMsg, "error");
    }
  };

  const handleToggleComments = async (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!expandedComments[postId] && !postComments[postId]) {
      try {
        const res = await getComments(postId);
        setPostComments(prev => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    }
  };

  const handleSendComment = async (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    try {
      const res = await addComment(postId, commentText);
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const getStatusBadgeColors = (status) => {
    switch (status) {
      case 'SUBMITTED':
      case 'PENDING':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'AI_SCREENED':
        return 'bg-brand-violet/10 text-brand-violet border-brand-violet/15';
      case 'ASSIGNED':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/15';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/15';
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/15';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">Community Civic Feed</h2>
          <div className="text-xs text-themeLight-textSub mt-1 flex items-center gap-2">
            <span>Viewing reports from: <span className="text-brand-violet font-bold">{userCity || 'Detecting...'}</span></span>
            <button onClick={fetchUserLocationAndFeed} className="text-brand-violet hover:text-brand-purple transition-all p-1" title="Refresh Location">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="max-w-2xl mx-auto space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500 animate-pulse">Scanning neighborhood for civic reports...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">{error}</div>
        ) : feedPosts.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border border-purple-100 shadow-soft bg-white/70 dark:bg-slate-900/70">
            <p className="text-slate-500 font-medium">No community complaints found in your city.</p>
          </div>
        ) : (
          feedPosts.map((post) => (
            <div key={post.id} className="p-6 rounded-3xl glass-panel space-y-5 relative bg-white/70 dark:bg-slate-900/70 shadow-soft transition-all hover:shadow-md border border-purple-100">
              
              {/* Header info */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-violet to-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-soft">
                    {(post.user?.name || 'Citizen')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{post.user?.name || 'Anonymous'}</h4>
                    <p className="text-[10px] text-brand-violet font-mono font-bold leading-none mt-0.5">{post.user?.role || 'CITIZEN'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase border ${getStatusBadgeColors(post.status)}`}>
                    {post.status || 'SUBMITTED'}
                  </span>
                </div>
              </div>

              {/* Post details */}
              <div className="space-y-3">
                {post.category && (
                  <span className="text-[9px] px-2 py-0.5 rounded font-bold font-mono uppercase bg-purple-500/10 text-purple-600 border border-purple-500/15 inline-block">
                    {post.category}
                  </span>
                )}
                <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-100 leading-snug">{post.title}</h3>
                <p className="text-sm text-slate-650 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">{post.description}</p>
              </div>

              {/* Single Image Card */}
              {post.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden max-h-80 border border-purple-100 shadow-premium">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action Bar (Upvotes, Comments count) */}
              <div className="flex items-center justify-between border-t border-b border-purple-100 py-3.5 mt-4">
                
                <div className="flex items-center gap-6">
                  {/* Upvote Button */}
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors px-4 py-1.5 rounded-lg border shadow-soft ${
                      localUpvoted.has(post.id)
                        ? "bg-brand-violet text-white border-brand-violet dark:bg-brand-violet dark:text-white"
                        : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <ArrowUp className={`w-4 h-4 ${localUpvoted.has(post.id) ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{localUpvoted.has(post.id) ? 'Upvoted' : 'Upvote'} ({post.upvoteCount || 0})</span>
                  </button>
                </div>

                {/* Comment trigger */}
                <button
                  onClick={() => handleToggleComments(post.id)}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-purple transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-50"
                >
                  <MessageSquare className="w-4 h-4 text-brand-purple" />
                  <span className="font-bold font-mono">Comments</span>
                </button>

              </div>

              {/* Comments Expanded Panel */}
              {expandedComments[post.id] && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {(!postComments[post.id]) ? (
                      <div className="text-center text-xs text-slate-400 py-2">Loading comments...</div>
                    ) : postComments[post.id].length === 0 ? (
                      <div className="text-center text-xs text-slate-400 py-2">No comments yet. Be the first to add one!</div>
                    ) : (
                      postComments[post.id].map((cmt) => (
                        <div key={cmt.id} className="flex gap-3 text-xs">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-soft border border-purple-100">
                            {cmt.userName[0].toUpperCase()}
                          </div>
                          <div className="flex-1 bg-purple-50/40 border border-purple-100/50 p-3 rounded-2xl rounded-tl-sm shadow-soft">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-100">{cmt.userName}</span>
                              <span className="text-[9px] text-slate-400">{new Date(cmt.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-650 leading-relaxed">{cmt.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Typing commentary field */}
                  <form onSubmit={(e) => handleSendComment(post.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => {
                        const txt = e.target.value;
                        setCommentInputs(prev => ({ ...prev, [post.id]: txt }));
                      }}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white dark:bg-slate-900 border border-purple-100 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 shadow-soft"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-purple text-white hover:opacity-90 transition-opacity shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
