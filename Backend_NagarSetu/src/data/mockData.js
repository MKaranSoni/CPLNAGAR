// NagarSetu Mock Database

export const mockUsers = {
  citizen: {
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    role: "citizen",
    level: 4,
    xp: 2450,
    xpToNextLevel: 3000,
    streak: 8,
    badges: [
      { id: "b1", title: "Pothole Patrol", icon: "🛠️", desc: "Reported 5+ public road safety hazards." },
      { id: "b2", title: "Clean Ambassador", icon: "🌱", desc: "Participated in 3 consecutive cleanup drives." },
      { id: "b3", title: "Beacon of Truth", icon: "🛡️", desc: "Maintained a 100% complaint validation rating." },
      { id: "b4", title: "Eco-Warrior", icon: "🌿", desc: "Earned over 1000 Green XP." }
    ],
    solvedCount: 14,
    activeCount: 2,
    rank: 12
  },
  volunteer: {
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "volunteer",
    level: 7,
    xp: 6800,
    xpToNextLevel: 8000,
    streak: 15,
    badges: [
      { id: "v1", title: "Cleanup Master", icon: "🧹", desc: "Helped clean up 10+ major zones." },
      { id: "v2", title: "Ward Commander", icon: "👑", desc: "Assigned lead on 3 neighborhood cleanup projects." }
    ],
    solvedCount: 45,
    activeCount: 4,
    rank: 3
  },
  admin: {
    name: "Dr. Sandeep Goel",
    role: "admin",
    department: "Municipal Development & Sanitation Department",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  }
};

export const mockComplaints = [
  {
    id: "NS-COMP-101",
    title: "Overflowing Smart-Trash Dumpster near Sector 4 Market",
    description: "The garbage bin near Sector 4's main market has been overflowing for the last three days. It has started emitting a foul smell, and stray dogs are tearing open plastic bags, blocking half the pedestrian walkway.",
    category: "Waste Management",
    priority: "High",
    status: "In Progress",
    latitude: 28.6139,
    longitude: 77.2090,
    locationName: "Sector 4 Main Market, Near Mother Dairy, New Delhi",
    citizenName: "Aarav Sharma",
    assignedVolunteer: "Rahul Verma",
    xpReward: 250,
    likes: 42,
    commentsCount: 12,
    createdAt: "2026-05-22T08:30:00Z",
    qrCode: "QR-NS-101-VALIDATED",
    photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
    aiMetrics: {
      categoryConfidence: "98.4%",
      isLegit: "High Confidence",
      duplicateCheck: "Unique Issue",
      recommendedPriority: "High"
    },
    updates: [
      { status: "Submitted", time: "May 22, 14:00", description: "Issue submitted by Aarav Sharma." },
      { status: "AI Screened", time: "May 22, 14:02", description: "AI scanned photo and tags: Garbage verified with 98% accuracy. Fake index: <0.02." },
      { status: "Assigned", time: "May 22, 16:30", description: "Assigned to volunteer Rahul Verma and Municipal Zone 4." },
      { status: "In Progress", time: "May 23, 09:00", description: "Rahul Verma initiated a small community sweep in the area." }
    ]
  },
  {
    id: "NS-COMP-102",
    title: "Deep Pothole on Outer Ring Road Flyover",
    description: "A deep pothole has emerged right after the flyover exit. It's extremely dangerous for two-wheelers, especially at night when streetlights are dim. It caused a minor scooter accident last evening.",
    category: "Road & Infrastructure",
    priority: "Critical",
    status: "Assigned",
    latitude: 28.6250,
    longitude: 77.2150,
    locationName: "Outer Ring Road Exit, Near Metro Pillar 114, New Delhi",
    citizenName: "Priya Patel",
    assignedVolunteer: "Unassigned",
    xpReward: 350,
    likes: 114,
    commentsCount: 28,
    createdAt: "2026-05-23T11:15:00Z",
    qrCode: "QR-NS-102-PENDING",
    photoUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80",
    aiMetrics: {
      categoryConfidence: "96.1%",
      isLegit: "High Confidence",
      duplicateCheck: "Potential duplicate of P-303, merged reports",
      recommendedPriority: "Critical"
    },
    updates: [
      { status: "Submitted", time: "May 23, 11:15", description: "Issue reported by Priya Patel with photo attachment." },
      { status: "AI Screened", time: "May 23, 11:17", description: "AI flagged depth (~15cm) and size as high threat index. Categorized as Critical." },
      { status: "Assigned", time: "May 24, 08:30", description: "Municipal Road Maintenance Division notified and scheduled for patch work." }
    ]
  },
  {
    id: "NS-COMP-103",
    title: "Non-Functional LED Streetlights along Sector 12 Park Pathway",
    description: "Entire stretch of streetlights from Corner 2 to the main gate has been dark for a week. Many residents who go for evening walks feel extremely unsafe.",
    category: "Street Lighting",
    priority: "Medium",
    status: "Resolved",
    latitude: 28.6080,
    longitude: 77.2320,
    locationName: "Sector 12 Public Park, Inner Jogging Track, New Delhi",
    citizenName: "Amit Singh",
    assignedVolunteer: "Vikram Sen",
    xpReward: 150,
    likes: 18,
    commentsCount: 3,
    createdAt: "2026-05-18T19:40:00Z",
    qrCode: "QR-NS-103-RESOLVED",
    photoUrl: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?w=600&auto=format&fit=crop&q=80",
    aiMetrics: {
      categoryConfidence: "92.5%",
      isLegit: "High Confidence",
      duplicateCheck: "Unique Issue",
      recommendedPriority: "Medium"
    },
    updates: [
      { status: "Submitted", time: "May 18, 19:40", description: "Issue reported by Amit Singh." },
      { status: "AI Screened", time: "May 18, 19:42", description: "AI categorized: Streetlight darkness verification matched." },
      { status: "Assigned", time: "May 19, 10:00", description: "Assigned to Ward Electrician Team." },
      { status: "In Progress", time: "May 20, 14:00", description: "Technician arrived, replacing LED drivers and bulb sets." },
      { status: "Resolved", time: "May 21, 18:30", description: "Wiring issue fixed. Resident Amit Singh verified lights are back on." }
    ]
  },
  {
    id: "NS-COMP-104",
    title: "Burst Water Main & Clean Drinking Water wastage",
    description: "Clean municipal water is gushing out of a cracked pipe under the pavement, flooding the street and creating a small pond. Thousands of liters of water are getting wasted.",
    category: "Water & Sewage",
    priority: "High",
    status: "Submitted",
    latitude: 28.6320,
    longitude: 77.1990,
    locationName: "Main Road Intersection, Ward 7, New Delhi",
    citizenName: "Sneha Reddy",
    assignedVolunteer: "Unassigned",
    xpReward: 200,
    likes: 56,
    commentsCount: 9,
    createdAt: "2026-05-24T06:10:00Z",
    qrCode: "QR-NS-104-PENDING",
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80",
    aiMetrics: {
      categoryConfidence: "99.0%",
      isLegit: "Verified (Water Gush)",
      duplicateCheck: "Unique Issue",
      recommendedPriority: "High"
    },
    updates: [
      { status: "Submitted", time: "May 24, 06:10", description: "Issue submitted by Sneha Reddy." },
      { status: "AI Screened", time: "May 24, 06:12", description: "AI identified heavy water logging. Sent notification to Hydro-works department." }
    ]
  }
];

export const mockFeedPosts = [
  {
    id: "p1",
    author: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Volunteer Squad Lead",
    title: "Sector 4 Market Overhaul Accomplished! 🎉",
    description: "Together with 6 community volunteers, we gathered this morning and completely cleared the overflowing garbage bin area at Sector 4. We swept the walkways, treated the mud piles, and put up warning posters to prevent littering. Municipal Corp has also agreed to empty the bins twice a day!",
    type: "cleanup",
    beforeImage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80",
    likes: 124,
    salutes: 53,
    comments: [
      { name: "Aarav Sharma", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", text: "Incredible! I filed this complaint, and seeing you guys resolve it so fast makes me feel so proud of our sector! Thank you!", time: "2h ago" },
      { name: "Meera Nair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", text: "Fabulous work! Joining the next cleanup drive this weekend.", time: "1h ago" }
    ],
    shares: 16,
    xpRewarded: 500,
    tags: ["#GreenSector4", "#CleanDelhi", "#NagarSetuVolunteers"],
    time: "4 hours ago"
  },
  {
    id: "p2",
    author: "Eco-Warriors Ward 12",
    avatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80",
    role: "Community Group",
    title: "Planted 50 Native Saplings along Sector 12 Bypass Road",
    description: "Our community group successfully hosted the Sunday Tree Plantation drive. Residents of all age groups came together to plant native trees including Neem, Amaltas, and Gulmohar. Let's make our neighborhood green!",
    type: "plantation",
    beforeImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80", // plain plot
    afterImage: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80",  // plantation
    likes: 210,
    salutes: 89,
    comments: [
      { name: "Dr. Sandeep Goel", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80", text: "Excellent initiative by Ward 12. The Municipal Corporation will support you with tree guards next week.", time: "5h ago" }
    ],
    shares: 34,
    xpRewarded: 800,
    tags: ["#GoGreen", "#Afforestation", "#SmartCities"],
    time: "8 hours ago"
  }
];

export const mockLeaderboard = {
  citizens: [
    { rank: 1, name: "Sneha Reddy", xp: 4890, level: 7, resolved: 28, streak: 12, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { rank: 2, name: "Vikram Malhotra", xp: 4210, level: 6, resolved: 24, streak: 9, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { rank: 3, name: "Kunal Kapoor", xp: 3950, level: 5, resolved: 19, streak: 14, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    { rank: 4, name: "Anjali Gupta", xp: 3400, level: 5, resolved: 17, streak: 5, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    { rank: 12, name: "Aarav Sharma (You)", xp: 2450, level: 4, resolved: 14, streak: 8, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" }
  ],
  wards: [
    { rank: 1, name: "Ward 12 - Vasant Kunj", xp: 45200, compliance: "96.4%", resolvedCount: 310 },
    { rank: 2, name: "Ward 4 - Dwarka", xp: 38900, compliance: "92.1%", resolvedCount: 245 },
    { rank: 3, name: "Ward 9 - Saket", xp: 32400, compliance: "89.5%", resolvedCount: 190 },
    { rank: 4, name: "Ward 15 - Rohini", xp: 29800, compliance: "88.2%", resolvedCount: 162 }
  ],
  volunteers: [
    { rank: 1, name: "Vikram Sen", solvedCount: 52, score: 98, level: 8, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80" },
    { rank: 2, name: "Neha Sharma", solvedCount: 48, score: 96, level: 7, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
    { rank: 3, name: "Rahul Verma (You)", solvedCount: 45, score: 95, level: 7, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { rank: 4, name: "Preeti Singh", solvedCount: 39, score: 92, level: 6, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" }
  ]
};

export const mockVolunteerGroups = [
  {
    id: "g1",
    name: "Vasant Kunj Green Guardians",
    members: 245,
    city: "New Delhi",
    description: "Committed to planting trees, cleaning municipal parks, and organizing active plastic-free drives around Ward 12.",
    avatar: "🌱",
    upcomingDrive: "Sunday Plantation Drive at Vasant Kunj Sector C - 08:00 AM",
    activeDrivesCount: 2
  },
  {
    id: "g2",
    name: "Dwarka Cleanliness Crusaders",
    members: 189,
    city: "New Delhi",
    description: "Focuses on waste segregation, public wall painting, clearing trash dumps, and holding waste awareness seminars.",
    avatar: "🧹",
    upcomingDrive: "Dwarka Sector 6 Metro Station cleanup sweep - Saturday 07:00 AM",
    activeDrivesCount: 1
  },
  {
    id: "g3",
    name: "Yamuna Cleanup Force",
    members: 412,
    city: "New Delhi",
    description: "Large volunteer group specifically cleaning plastic trash and biological wastes near the banks of the Yamuna River.",
    avatar: "🌊",
    upcomingDrive: "Yamuna Ghat Clean-Sweep phase 4 - Saturday 06:00 AM",
    activeDrivesCount: 3
  }
];

export const mockRewards = [
  { id: "r1", title: "Free Delhi Metro Pass (3 Days)", cost: 1500, category: "Transport", sponsor: "DMRC Corporation", icon: "🚇", code: "NS-METRO-4U8" },
  { id: "r2", title: "15% Municipal Property Tax Rebate", cost: 3500, category: "Municipal", sponsor: "Municipal Corporation", icon: "🏠", code: "NS-TAX-MUNI1" },
  { id: "r3", title: "Free Solar Plant Consultation Audit", cost: 1200, category: "Green Energy", sponsor: "Delhi Power Corp", icon: "☀️", code: "NS-SOLAR-AUDIT" },
  { id: "r4", title: "Organic Seeds & Gardening Kit", cost: 800, category: "Nature", sponsor: "Horticulture Dept", icon: "🌱", code: "NS-GARDEN-SEED" }
];

export const mockAdminStats = {
  totalComplaints: 1450,
  resolvedComplaints: 1220,
  activeComplaints: 185,
  spamFilteredComplaints: 45,
  resolutionRate: "84.1%",
  avgResolutionTime: "31 hours",
  weeklyTrends: [
    { name: "Mon", reported: 45, resolved: 38 },
    { name: "Tue", reported: 55, resolved: 42 },
    { name: "Wed", reported: 68, resolved: 50 },
    { name: "Thu", reported: 60, resolved: 58 },
    { name: "Fri", reported: 75, resolved: 65 },
    { name: "Sat", reported: 90, resolved: 82 },
    { name: "Sun", reported: 50, resolved: 70 }
  ],
  categoryShare: [
    { name: "Waste Management", value: 450, color: "#10B981" },
    { name: "Roads & Potholes", value: 380, color: "#3B82F6" },
    { name: "Streetlights", value: 290, color: "#8B5CF6" },
    { name: "Water & Sewage", value: 230, color: "#22D3EE" },
    { name: "Other", value: 100, color: "#F59E0B" }
  ],
  wardPerformance: [
    { ward: "Ward 12", speed: 22, score: 98, reports: 340 },
    { ward: "Ward 4", speed: 28, score: 92, reports: 290 },
    { ward: "Ward 9", speed: 31, score: 88, reports: 210 },
    { ward: "Ward 15", speed: 38, score: 85, reports: 180 },
    { ward: "Ward 7", speed: 45, score: 79, reports: 120 }
  ]
};

export const mockNotifications = [
  { id: "n1", type: "status", title: "Complaint Assigned", message: "Your complaint 'Overflowing Smart-Trash' has been assigned to Volunteer Rahul Verma.", time: "2 hours ago", unread: true },
  { id: "n2", type: "streak", title: "Streak Saved! 🔥", message: "You cleared a cleanup streak of 8 days! Keep reporting to reach Level 5.", time: "8 hours ago", unread: true },
  { id: "n3", type: "system", title: "XP Received 🎉", message: "You received 150 Green XP as resident endorsement on Sector 12 Streetlights.", time: "1 day ago", unread: false },
  { id: "n4", type: "drive", title: "Upcoming Drive", message: "Dwarka Crusaders is hosting a plastic pickup sweep this Saturday at 07:00 AM.", time: "2 days ago", unread: false }
];

export const mockWardsAqi = [
  {
    id: "aqi-12",
    name: "Ward 12 - Vasant Kunj",
    aqi: 42,
    status: "Good",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    textColor: "text-emerald-600",
    mainPollutant: "PM2.5",
    breakdown: { pm25: 12, pm10: 25, co: 0.4, no2: 8 },
    trend: [
      { time: "09:00", aqi: 35 },
      { time: "11:00", aqi: 38 },
      { time: "13:00", aqi: 45 },
      { time: "15:00", aqi: 42 },
      { time: "17:00", aqi: 40 },
      { time: "19:00", aqi: 48 },
      { time: "21:00", aqi: 42 }
    ]
  },
  {
    id: "aqi-4",
    name: "Ward 4 - Dwarka",
    aqi: 85,
    status: "Moderate",
    color: "#EAB308",
    bgColor: "rgba(234, 179, 8, 0.12)",
    textColor: "text-yellow-600",
    mainPollutant: "PM10",
    breakdown: { pm25: 28, pm10: 65, co: 0.8, no2: 18 },
    trend: [
      { time: "09:00", aqi: 72 },
      { time: "11:00", aqi: 78 },
      { time: "13:00", aqi: 82 },
      { time: "15:00", aqi: 85 },
      { time: "17:00", aqi: 80 },
      { time: "19:00", aqi: 92 },
      { time: "21:00", aqi: 85 }
    ]
  },
  {
    id: "aqi-9",
    name: "Ward 9 - Saket",
    aqi: 120,
    status: "Poor",
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.12)",
    textColor: "text-orange-600",
    mainPollutant: "PM2.5",
    breakdown: { pm25: 45, pm10: 95, co: 1.4, no2: 28 },
    trend: [
      { time: "09:00", aqi: 95 },
      { time: "11:00", aqi: 105 },
      { time: "13:00", aqi: 115 },
      { time: "15:00", aqi: 120 },
      { time: "17:00", aqi: 110 },
      { time: "19:00", aqi: 125 },
      { time: "21:00", aqi: 120 }
    ]
  },
  {
    id: "aqi-15",
    name: "Ward 15 - Rohini",
    aqi: 185,
    status: "Severe",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    textColor: "text-red-600",
    mainPollutant: "NO2",
    breakdown: { pm25: 75, pm10: 160, co: 2.1, no2: 52 },
    trend: [
      { time: "09:00", aqi: 160 },
      { time: "11:00", aqi: 172 },
      { time: "13:00", aqi: 180 },
      { time: "15:00", aqi: 185 },
      { time: "17:00", aqi: 178 },
      { time: "19:00", aqi: 195 },
      { time: "21:00", aqi: 185 }
    ]
  },
  {
    id: "aqi-7",
    name: "Ward 7 - Civil Lines",
    aqi: 220,
    status: "Severe",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    textColor: "text-red-600",
    mainPollutant: "PM2.5",
    breakdown: { pm25: 98, pm10: 195, co: 2.8, no2: 65 },
    trend: [
      { time: "09:00", aqi: 190 },
      { time: "11:00", aqi: 205 },
      { time: "13:00", aqi: 215 },
      { time: "15:00", aqi: 220 },
      { time: "17:00", aqi: 210 },
      { time: "19:00", aqi: 230 },
      { time: "21:00", aqi: 220 }
    ]
  }
];

