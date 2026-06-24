import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockUsers,
  mockComplaints,
  mockFeedPosts,
  mockLeaderboard,
  mockVolunteerGroups,
  mockRewards,
  mockNotifications,
  mockAdminStats,
  mockWardsAqi
} from '../data/mockData';

const CivicDataContext = createContext();

export const CivicDataProvider = ({ children }) => {
  // Global Active Session State
  const [currentUser, setCurrentUser] = useState(mockUsers.citizen);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [feedPosts, setFeedPosts] = useState(mockFeedPosts);
  const [volunteerGroups, setVolunteerGroups] = useState(mockVolunteerGroups);
  const [userRewards, setUserRewards] = useState(mockRewards);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [adminStats, setAdminStats] = useState(mockAdminStats);
  const [wardsAqi, setWardsAqi] = useState(mockWardsAqi);
  const [myRedeemedCodes, setMyRedeemedCodes] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Theme & Preferences State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ns_theme') || 'light';
  });
  
  const [pushNotifications, setPushNotifications] = useState(() => {
    return localStorage.getItem('ns_push') === 'true';
  });

  // Apply Theme to Document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ns_theme', theme);
  }, [theme]);

  // Persist Push Notifications
  useEffect(() => {
    localStorage.setItem('ns_push', pushNotifications);
  }, [pushNotifications]);

  // Toggle Push Notifications
  const togglePushNotifications = () => {
    setPushNotifications(prev => !prev);
    showToast(`Push Notifications turned ${!pushNotifications ? 'ON' : 'OFF'}`, 'info');
  };

  // Toggle Theme
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} Mode Activated`, 'success');
  };


  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Toggle user role simulation
  const switchUserRole = (role) => {
    if (role === 'citizen') {
      setCurrentUser(mockUsers.citizen);
      showToast("Switched to Citizen Profile: Aarav Sharma", "info");
    } else if (role === 'volunteer') {
      setCurrentUser(mockUsers.volunteer);
      showToast("Switched to Volunteer Profile: Rahul Verma", "info");
    } else if (role === 'admin') {
      setCurrentUser(mockUsers.admin);
      showToast("Switched to Admin Portal Dashboard", "info");
    }
  };

  // Add new complaint
  const addComplaint = (newComp) => {
    const freshComplaint = {
      id: `NS-COMP-${100 + complaints.length + 1}`,
      title: newComp.title,
      description: newComp.description,
      category: newComp.category || "Waste Management",
      priority: newComp.priority || "Medium",
      status: "Submitted",
      latitude: newComp.latitude || 28.6139,
      longitude: newComp.longitude || 77.2090,
      locationName: newComp.locationName || "New Delhi Ward Area",
      citizenName: currentUser.name,
      assignedVolunteer: "Unassigned",
      xpReward: newComp.priority === 'High' ? 250 : newComp.priority === 'Critical' ? 350 : 150,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      qrCode: `QR-NS-${100 + complaints.length + 1}-PENDING`,
      photoUrl: newComp.photoUrl || "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80",
      aiMetrics: newComp.aiMetrics || {
        categoryConfidence: "95.0%",
        isLegit: "High Confidence",
        duplicateCheck: "Unique Issue",
        recommendedPriority: newComp.priority || "Medium"
      },
      updates: [
        { status: "Submitted", time: "Just now", description: "Issue submitted by " + currentUser.name }
      ]
    };

    setComplaints((prev) => [freshComplaint, ...prev]);

    // Reward XP for citizen report
    if (currentUser.role === 'citizen') {
      setCurrentUser((prev) => {
        const nextXp = prev.xp + 100;
        const levelUp = nextXp >= prev.xpToNextLevel;
        return {
          ...prev,
          xp: levelUp ? nextXp - prev.xpToNextLevel : nextXp,
          level: levelUp ? prev.level + 1 : prev.level,
          solvedCount: prev.solvedCount + 1,
          streak: prev.streak + 1
        };
      });
      showToast("Complaint Filed! +100 Reporting XP Awarded!", "success");
    } else {
      showToast("Complaint Filed Successfully!", "success");
    }

    // Add Notification
    const newNotif = {
      id: `n-${Date.now()}`,
      type: "status",
      title: "Complaint Lodged",
      message: `Your report '${newComp.title.substring(0, 30)}...' has been created. AI Scanner processing...`,
      time: "Just now",
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return freshComplaint;
  };

  // Like complaint
  const likeComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
    showToast("Supported Complaint! Upvoted successfully.", "success");
  };

  // Add Comment to feed post or complaint
  const addFeedComment = (postId, commentText) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            name: currentUser.name,
            avatar: currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            text: commentText,
            time: "Just now"
          };
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
    showToast("Comment posted!", "success");
  };

  // Interact with feed post (like/salute)
  const reactToFeedPost = (postId, reactionType) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          if (reactionType === 'like') {
            return { ...p, likes: p.likes + 1 };
          }
          if (reactionType === 'salute') {
            return { ...p, salutes: p.salutes + 1 };
          }
        }
        return p;
      })
    );
    showToast(`Reacted with ${reactionType === 'like' ? '👍 Like' : '🎉 Salute'}!`, "success");
  };

  // Join Volunteer Circle
  const toggleJoinGroup = (groupId, groupName) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups((prev) => prev.filter((id) => id !== groupId));
      setVolunteerGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, members: g.members - 1 } : g))
      );
      showToast(`Left ${groupName} Circle.`, "info");
    } else {
      setJoinedGroups((prev) => [...prev, groupId]);
      setVolunteerGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, members: g.members + 1 } : g))
      );
      showToast(`Successfully joined the ${groupName}! +50 Community XP`, "success");
      
      setCurrentUser((prev) => ({
        ...prev,
        xp: prev.xp + 50
      }));
    }
  };

  // Redeem rewards
  const claimReward = (rewardId, cost, rewardTitle) => {
    if (currentUser.xp < cost) {
      showToast("Insufficient XP! Complete more green drives or file reports.", "error");
      return false;
    }

    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp - cost
    }));

    const rewardCode = `NS-REWARD-${rewardId}-${Math.floor(1000 + Math.random() * 9000)}`;
    setMyRedeemedCodes((prev) => [...prev, { id: rewardId, title: rewardTitle, code: rewardCode }]);
    showToast(`Redeemed ${rewardTitle}! Code generated.`, "success");
    return true;
  };

  // Admin Actions (Approve / Mark fake / Update Status)
  const updateComplaintStatus = (compId, newStatus, detailText = "") => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === compId) {
          const freshUpdate = {
            status: newStatus,
            time: "Just now",
            description: detailText || `Status changed to ${newStatus}`
          };
          return {
            ...c,
            status: newStatus,
            updates: [...c.updates, freshUpdate]
          };
        }
        return c;
      })
    );

    // If status is resolved, reward full XP to the reporter
    if (newStatus === 'Resolved') {
      showToast(`Complaint ${compId} marked as RESOLVED! Assigned volunteers and reporter rewarded!`, "success");
      
      // Update stats
      setAdminStats((prev) => ({
        ...prev,
        resolvedComplaints: prev.resolvedComplaints + 1,
        activeComplaints: prev.activeComplaints - 1
      }));
    } else {
      showToast(`Complaint status updated to ${newStatus}.`, "info");
    }
  };

  // Notification Clearer
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("Notifications cleared", "info");
  };

  return (
    <CivicDataContext.Provider
      value={{
        currentUser,
        complaints,
        feedPosts,
        volunteerGroups,
        userRewards,
        notifications,
        adminStats,
        wardsAqi,
        setWardsAqi,
        myRedeemedCodes,
        joinedGroups,
        toasts,
        theme,
        toggleTheme,
        pushNotifications,
        togglePushNotifications,
        switchUserRole,
        addComplaint,
        likeComplaint,
        addFeedComment,
        reactToFeedPost,
        toggleJoinGroup,
        claimReward,
        updateComplaintStatus,
        markAllNotificationsRead,
        showToast
      }}
    >
      {children}
    </CivicDataContext.Provider>
  );
};

export const useCivicData = () => {
  const context = useContext(CivicDataContext);
  if (!context) {
    throw new Error('useCivicData must be used within a CivicDataProvider');
  }
  return context;
};
