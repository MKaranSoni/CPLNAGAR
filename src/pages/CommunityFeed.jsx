//import React, { useState } from 'react';
import { useEffect, useState } from "react";
import { getCommunityFeed } from "../services/adminService";
import { useCivicData } from '../hooks/useCivicData';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Award, 
  Sparkles,
  ArrowRight,
  Send,
  Hash
} from 'lucide-react';

export default function CommunityFeed() {
  //const { reactToFeedPost, addFeedComment } = useCivicData();
  const { feedPosts = [], reactToFeedPost, addFeedComment } = useCivicData();
//const [feedPosts, setFeedPosts] = useState([]);
useEffect(() => {
  loadFeed();

  const interval = setInterval(() => {
    loadFeed();
  }, 5000);

  return () => clearInterval(interval);
}, []);

const loadFeed = async () => {
  try {
    const res = await getCommunityFeed();
    setFeedPosts(res.data);
  } catch (err) {
    console.error("Feed load error:", err);
  }
};
  const [activeTag, setActiveTag] = useState('All');
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const tags = ['All','#GreenSector4', '#GoGreen', '#NagarSetuVolunteers', '#Afforestation'];

  const filteredPosts = activeTag === 'All' 
    ? feedPosts 
    : feedPosts.filter(p => p.tags.includes(activeTag));

  const handleSendComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    addFeedComment(postId, commentText);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleToggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-themeLight-textMain">Community Impact Feed</h2>
        <p className="text-xs text-themeLight-textSub mt-1">Review neighborhood environmental makeovers, salute local squads, and share green action updates.</p>
      </div>

      {/* Tags Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              activeTag === tag
                ? 'bg-gradient-to-r from-brand-violet to-brand-purple text-white border-brand-violet/40 shadow-glow-violet'
                : 'bg-white text-slate-500 border-purple-100 hover:text-slate-800 shadow-soft'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Feed Posts List */}
      <div className="max-w-2xl mx-auto space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-6 rounded-3xl glass-panel space-y-5 relative bg-white/70 shadow-soft">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border border-purple-100 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{post.author}</h4>
                  <p className="text-[10px] text-brand-violet font-mono font-bold leading-none mt-0.5">{post.role}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{post.time}</span>
            </div>

            {/* Post details */}
            <div className="space-y-2">
              <h3 className="text-base font-bold font-outfit text-slate-800 leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-650 leading-relaxed">{post.description}</p>
              
              {/* Post Hashtags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-brand-purple font-semibold cursor-pointer hover:underline">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Before / After comparative blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Before Card */}
              <div className="relative rounded-2xl overflow-hidden h-48 border border-purple-100 shadow-soft">
                <img
                  src={post.beforeImage}
                  alt="Before clean sweep"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold font-mono text-red-400 border border-red-500/20 rounded uppercase">
                  BEFORE DRIVE
                </div>
              </div>

              {/* After Card */}
              <div className="relative rounded-2xl overflow-hidden h-48 border border-purple-100 shadow-premium">
                <img
                  src={post.afterImage}
                  alt="After clean sweep"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[9px] font-bold font-mono text-emerald-400 border border-emerald-500/20 rounded uppercase">
                  AFTER DRIVE
                </div>
              </div>

            </div>

            {/* Reward Notification Pill */}
            {/* {post.xpRewarded && (
              <div className="p-3 rounded-xl bg-brand-violet/5 border border-brand-violet/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">Municipal Green Endorsement</span>
                <span className="text-xs font-bold text-brand-violet flex items-center gap-1">
                  🌱 +{post.xpRewarded} Ward XP Awarded
                </span>
              </div> */}
            

            {/* Action Bar (Likes, Salutes, Comments count) */}
            <div className="flex items-center justify-between border-t border-b border-purple-100 py-3.5 mt-4">
              
              <div className="flex items-center gap-6">
                {/* Like Button */}
                <button
                  onClick={() => reactToFeedPost(post.id, 'like')}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                  <span className="font-mono"> upvote {post.likes}</span>
                </button>

                {/* Salute Button */}
                {/* <button
                  onClick={() => reactToFeedPost(post.id, 'salute')}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors group"
                >
                  <Award className="w-4 h-4 text-brand-violet group-hover:scale-110 transition-transform" />
                  <span className="font-mono">Salute {post.salutes > 0 ? `(${post.salutes})` : ''}</span>
                </button> */}
              </div>

              {/* Comment trigger */}
              <button
                onClick={() => handleToggleComments(post.id)}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-brand-purple" />
                <span className="font-mono">{post.comments.length} Comments</span>
              </button>

            </div>

            {/* Comments Expanded Panel */}
            {expandedComments[post.id] && (
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  {(post.comments || []).map((cmt, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <img
                        src={cmt.avatar}
                        alt={cmt.name}
                        className="w-7 h-7 rounded-full object-cover border border-purple-100"
                      />
                      <div className="flex-1 bg-purple-50/40 border border-purple-100/50 p-3 rounded-2xl shadow-soft">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">{cmt.name}</span>
                          <span className="text-[9px] text-slate-400">{cmt.time}</span>
                        </div>
                        <p className="text-slate-650 leading-normal font-medium">{cmt.text}</p>
                      </div>
                    </div>
                  ))}
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
                    placeholder="Write a supportive comment..."
                    className="flex-1 bg-white border border-purple-100 text-slate-800 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-violet/50 shadow-soft"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-white border border-purple-100 hover:bg-purple-50 text-brand-violet hover:text-brand-purple transition-colors shadow-soft"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
