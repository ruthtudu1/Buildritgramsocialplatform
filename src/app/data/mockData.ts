export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  website: string;
  followers: number;
  following: number;
  postsCount: number;
  isVerified: boolean;
  isFollowing: boolean;
  joinedDate: string;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Rit {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  likes: number;
  loves: number;
  insightfuls: number;
  comments: Comment[];
  reRits: number;
  shares: number;
  isLiked: boolean;
  isLoved: boolean;
  isInsightful: boolean;
  isReRitted: boolean;
  hashtags: string[];
  mentions: string[];
  type: 'text' | 'image' | 'video';
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  type: 'text' | 'image';
}

export interface Conversation {
  id: string;
  user: User;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isTyping: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'rerit';
  user: User;
  content: string;
  ritContent?: string;
  timestamp: string;
  isRead: boolean;
}

export const CURRENT_USER: User = {
  id: 'current',
  name: 'Alex Morgan',
  username: 'alexmorgan',
  avatar: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  coverPhoto: 'https://images.unsplash.com/photo-1764260640542-3d62cdbf9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  bio: '✨ Designer & Creator | Exploring the intersection of tech & art | Coffee enthusiast ☕ | Building cool things @RitgramHQ',
  location: 'San Francisco, CA',
  website: 'alexmorgan.dev',
  followers: 12847,
  following: 1203,
  postsCount: 384,
  isVerified: true,
  isFollowing: false,
  joinedDate: 'January 2022',
};

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Jordan Kim',
    username: 'jordankim',
    avatar: 'https://images.unsplash.com/photo-1584940121730-93ffb8aa88b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '🚀 Full-stack developer | Open source contributor | JavaScript enthusiast | Building the future one commit at a time',
    location: 'New York, NY',
    website: 'jordankim.io',
    followers: 48200,
    following: 892,
    postsCount: 1042,
    isVerified: true,
    isFollowing: true,
    joinedDate: 'March 2021',
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    username: 'priyasharma',
    avatar: 'https://images.unsplash.com/photo-1729202305341-d146fdea0a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1708552592289-350724a8e695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '📸 Travel photographer & storyteller | 47 countries and counting | DM for collaborations | #WanderLust',
    location: 'Mumbai, India',
    website: 'priyasharma.photo',
    followers: 89500,
    following: 534,
    postsCount: 2341,
    isVerified: true,
    isFollowing: true,
    joinedDate: 'June 2020',
  },
  {
    id: 'u3',
    name: 'Marcus Webb',
    username: 'marcuswebb',
    avatar: 'https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '🎵 Music producer & DJ | Creating sounds that move you | Signed @SoundwaveRecords | 🎧 Available for collabs',
    location: 'Los Angeles, CA',
    website: 'marcuswebb.music',
    followers: 124000,
    following: 298,
    postsCount: 567,
    isVerified: true,
    isFollowing: false,
    joinedDate: 'September 2019',
  },
  {
    id: 'u4',
    name: 'Sofia Laurent',
    username: 'sofialaurent',
    avatar: 'https://images.unsplash.com/photo-1619107096786-702cb089d38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1731598463111-05e7df3d84d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '🎨 Artist & Fashion Designer | Paris-based | Blending art with wearable stories | Available for commissions',
    location: 'Paris, France',
    website: 'sofialaurent.art',
    followers: 67300,
    following: 712,
    postsCount: 891,
    isVerified: false,
    isFollowing: true,
    joinedDate: 'April 2021',
  },
  {
    id: 'u5',
    name: 'Dev Patel',
    username: 'devpatel',
    avatar: 'https://images.unsplash.com/photo-1633605435219-654abe70d37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1700527722944-b07372622800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '💡 Startup founder | Ex-Google | Building @TechNova | Speaker | Investor | Writing about AI & the future',
    location: 'London, UK',
    website: 'devpatel.tech',
    followers: 32100,
    following: 1456,
    postsCount: 234,
    isVerified: true,
    isFollowing: false,
    joinedDate: 'November 2022',
  },
];

export const RITS: Rit[] = [
  {
    id: 'r1',
    user: USERS[0],
    content: 'Just shipped a brand new feature for our open source project! 🚀 The new API is 3x faster than before and supports real-time streaming. Big thanks to everyone who contributed PRs this month.\n\nCheck out the performance benchmarks below 👇 #OpenSource #JavaScript #WebDev @ritgramhq',
    image: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    timestamp: '2m ago',
    likes: 847,
    loves: 234,
    insightfuls: 156,
    comments: [
      {
        id: 'c1',
        user: USERS[3],
        content: 'This is absolutely incredible! The streaming API was something the community has been waiting for. 🔥',
        timestamp: '1m ago',
        likes: 45,
        isLiked: false,
        replies: [
          {
            id: 'c1r1',
            user: USERS[0],
            content: 'Thanks Sofia! Couldn\'t have done it without the community feedback 💪',
            timestamp: '30s ago',
            likes: 12,
            isLiked: false,
          }
        ]
      },
      {
        id: 'c2',
        user: USERS[4],
        content: 'The benchmarks look insane. 3x improvement is no joke. Did you switch the underlying data structure?',
        timestamp: '1m ago',
        likes: 23,
        isLiked: false,
      }
    ],
    reRits: 312,
    shares: 89,
    isLiked: false,
    isLoved: false,
    isInsightful: false,
    isReRitted: false,
    hashtags: ['OpenSource', 'JavaScript', 'WebDev'],
    mentions: ['ritgramhq'],
    type: 'image',
  },
  {
    id: 'r2',
    user: USERS[1],
    content: 'Golden hour at the Himalayas hit different today. Sometimes you just need to disconnect and let the mountains remind you how small we are. 🏔️✨\n\n#Travel #Photography #Himalayas #GoldenHour #WanderLust',
    image: 'https://images.unsplash.com/photo-1708552592289-350724a8e695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    timestamp: '15m ago',
    likes: 3421,
    loves: 892,
    insightfuls: 134,
    comments: [
      {
        id: 'c3',
        user: USERS[2],
        content: 'This shot is UNREAL! Which lens did you use? The bokeh is perfect 📸',
        timestamp: '10m ago',
        likes: 67,
        isLiked: true,
      },
      {
        id: 'c4',
        user: CURRENT_USER,
        content: 'Adding this location to my bucket list immediately! Is it accessible year-round?',
        timestamp: '5m ago',
        likes: 34,
        isLiked: false,
      }
    ],
    reRits: 1203,
    shares: 567,
    isLiked: true,
    isLoved: false,
    isInsightful: false,
    isReRitted: false,
    hashtags: ['Travel', 'Photography', 'Himalayas', 'GoldenHour', 'WanderLust'],
    mentions: [],
    type: 'image',
  },
  {
    id: 'r3',
    user: USERS[2],
    content: 'New track dropping this Friday 🎵🔥 Been working on this one for 6 months and I can\'t wait for y\'all to hear it. The energy is unmatched.\n\nPre-save link in bio! #NewMusic #EDM #MusicProducer @soundwaverecords',
    timestamp: '1h ago',
    likes: 5634,
    loves: 2341,
    insightfuls: 89,
    comments: [
      {
        id: 'c5',
        user: USERS[3],
        content: 'CANNOT WAIT! Your last drop was on repeat for weeks 🎧',
        timestamp: '45m ago',
        likes: 234,
        isLiked: false,
      }
    ],
    reRits: 987,
    shares: 2341,
    isLiked: false,
    isLoved: false,
    isInsightful: false,
    isReRitted: true,
    hashtags: ['NewMusic', 'EDM', 'MusicProducer'],
    mentions: ['soundwaverecords'],
    type: 'text',
  },
  {
    id: 'r4',
    user: USERS[3],
    content: 'My latest collection just launched! 🎨✨ "Urban Dreams" — a fusion of street art and haute couture. Each piece tells a story of the city that never sleeps.\n\nLink in bio to shop. Limited pieces available. #Fashion #Art #Design #UrbanDreams',
    image: 'https://images.unsplash.com/photo-1731598463111-05e7df3d84d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    timestamp: '2h ago',
    likes: 2891,
    loves: 1204,
    insightfuls: 445,
    comments: [
      {
        id: 'c6',
        user: USERS[1],
        content: 'This collection is absolutely breathtaking Sofia! The way you blend street elements with luxury fashion is genius 🤍',
        timestamp: '1h ago',
        likes: 156,
        isLiked: false,
      },
      {
        id: 'c7',
        user: CURRENT_USER,
        content: 'The third piece is my favorite — the contrast of textures is incredible!',
        timestamp: '30m ago',
        likes: 78,
        isLiked: false,
      }
    ],
    reRits: 634,
    shares: 289,
    isLiked: false,
    isLoved: true,
    isInsightful: false,
    isReRitted: false,
    hashtags: ['Fashion', 'Art', 'Design', 'UrbanDreams'],
    mentions: [],
    type: 'image',
  },
  {
    id: 'r5',
    user: USERS[4],
    content: 'Hot take: Most "AI companies" aren\'t building AI — they\'re building wrappers around OpenAI. Real AI innovation requires:\n\n→ Original research\n→ Proprietary training data  \n→ Novel architectures\n→ Long-term vision\n\nThe wrapper game will end. Build something real. 🧵 #AI #Startups #Tech #Founder',
    timestamp: '3h ago',
    likes: 7823,
    loves: 2341,
    insightfuls: 3456,
    comments: [
      {
        id: 'c8',
        user: USERS[0],
        content: 'Couldn\'t agree more. The foundation model race is a winner-take-all game. Distribution and application innovation is where the opportunity is.',
        timestamp: '2h ago',
        likes: 567,
        isLiked: false,
      },
      {
        id: 'c9',
        user: USERS[1],
        content: 'While I agree with the spirit, I\'d push back on "wrapper" being pejorative. Many great companies are built on abstraction layers. Value = what you deliver to customers.',
        timestamp: '1h ago',
        likes: 892,
        isLiked: true,
      }
    ],
    reRits: 4521,
    shares: 1892,
    isLiked: false,
    isLoved: false,
    isInsightful: true,
    isReRitted: false,
    hashtags: ['AI', 'Startups', 'Tech', 'Founder'],
    mentions: [],
    type: 'text',
  },
  {
    id: 'r6',
    user: USERS[1],
    content: 'Street food in Oaxaca, Mexico is absolutely unreal 🌮✨ This mole negro took 3 days to prepare and you can taste every hour of it. Food is culture, people.\n\n#FoodPhotography #Travel #Mexico #Oaxaca #StreetFood',
    image: 'https://images.unsplash.com/photo-1704728006655-b9340c92839f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    timestamp: '5h ago',
    likes: 4234,
    loves: 1789,
    insightfuls: 234,
    comments: [
      {
        id: 'c10',
        user: USERS[4],
        content: 'My mouth is watering just looking at this. Oaxaca is next on my list!',
        timestamp: '4h ago',
        likes: 89,
        isLiked: false,
      }
    ],
    reRits: 892,
    shares: 456,
    isLiked: true,
    isLoved: true,
    isInsightful: false,
    isReRitted: false,
    hashtags: ['FoodPhotography', 'Travel', 'Mexico', 'Oaxaca', 'StreetFood'],
    mentions: [],
    type: 'image',
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    user: USERS[0],
    messages: [
      { id: 'm1', senderId: 'u1', content: 'Hey! Loved your latest design work 🔥', timestamp: '10:23 AM', status: 'seen', type: 'text' },
      { id: 'm2', senderId: 'current', content: 'Thanks Jordan! Been working hard on it 😊', timestamp: '10:25 AM', status: 'seen', type: 'text' },
      { id: 'm3', senderId: 'u1', content: 'Would love to collaborate on something. Maybe a design system for my new project?', timestamp: '10:28 AM', status: 'seen', type: 'text' },
      { id: 'm4', senderId: 'current', content: 'That sounds amazing! What kind of project is it?', timestamp: '10:30 AM', status: 'seen', type: 'text' },
      { id: 'm5', senderId: 'u1', content: 'It\'s an open source developer tool. I\'ll send over the brief this week. Super excited about this!', timestamp: '10:32 AM', status: 'seen', type: 'text' },
      { id: 'm6', senderId: 'current', content: 'Can\'t wait! Send it over whenever you\'re ready 🚀', timestamp: '10:35 AM', status: 'seen', type: 'text' },
      { id: 'm7', senderId: 'u1', content: 'Will do! Also, that post about your Figma workflow went viral. Congrats! 🎉', timestamp: '2m ago', status: 'seen', type: 'text' },
    ],
    lastMessage: 'Will do! Also, that post about your Figma workflow went viral. Congrats!',
    lastMessageTime: '2m ago',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 'conv2',
    user: USERS[1],
    messages: [
      { id: 'm8', senderId: 'u2', content: 'Your photo from last week\'s event was stunning!', timestamp: 'Yesterday', status: 'seen', type: 'text' },
      { id: 'm9', senderId: 'current', content: 'Thank you so much Priya! Your work inspires me every day', timestamp: 'Yesterday', status: 'seen', type: 'text' },
      { id: 'm10', senderId: 'u2', content: 'Are you going to the photography workshop next month?', timestamp: '1h ago', status: 'seen', type: 'text' },
      { id: 'm11', senderId: 'u2', content: 'I\'m planning to go and it would be great to meet in person! 📸', timestamp: '58m ago', status: 'delivered', type: 'text' },
    ],
    lastMessage: 'I\'m planning to go and it would be great to meet in person!',
    lastMessageTime: '58m ago',
    unreadCount: 2,
    isTyping: true,
  },
  {
    id: 'conv3',
    user: USERS[2],
    messages: [
      { id: 'm12', senderId: 'u3', content: 'Hey! Love your aesthetic. Would you be interested in creating visuals for my next track?', timestamp: '2d ago', status: 'seen', type: 'text' },
      { id: 'm13', senderId: 'current', content: 'That would be incredible Marcus! What\'s the vibe?', timestamp: '2d ago', status: 'seen', type: 'text' },
      { id: 'm14', senderId: 'u3', content: 'Dark, neon, cyberpunk. Think Blade Runner meets Tokyo nightlife 🎧', timestamp: '2d ago', status: 'seen', type: 'text' },
      { id: 'm15', senderId: 'current', content: 'That\'s literally my favorite aesthetic! I\'m so in', timestamp: '2d ago', status: 'seen', type: 'text' },
      { id: 'm16', senderId: 'u3', content: 'Perfect! Sending you the brief and some reference images. This is going to be 🔥', timestamp: '1d ago', status: 'seen', type: 'text' },
    ],
    lastMessage: 'Perfect! Sending you the brief and some reference images.',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 'conv4',
    user: USERS[4],
    messages: [
      { id: 'm17', senderId: 'u5', content: 'Really enjoyed your thread on UX research. Mind if I share it in our newsletter?', timestamp: '3d ago', status: 'seen', type: 'text' },
      { id: 'm18', senderId: 'current', content: 'Of course! Happy to reach a wider audience 🙌', timestamp: '3d ago', status: 'seen', type: 'text' },
      { id: 'm19', senderId: 'u5', content: 'We have 50k subscribers. I\'ll tag you in the edition. Keep creating great content!', timestamp: '3d ago', status: 'seen', type: 'text' },
    ],
    lastMessage: 'We have 50k subscribers. I\'ll tag you in the edition.',
    lastMessageTime: '3d ago',
    unreadCount: 0,
    isTyping: false,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: USERS[0],
    content: 'liked your rit',
    ritContent: 'Just shipped a brand new feature for our open source project! 🚀',
    timestamp: '2m ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'follow',
    user: USERS[2],
    content: 'started following you',
    timestamp: '15m ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'comment',
    user: USERS[1],
    content: 'commented on your rit',
    ritContent: 'Adding this location to my bucket list immediately!',
    timestamp: '32m ago',
    isRead: false,
  },
  {
    id: 'n4',
    type: 'rerit',
    user: USERS[3],
    content: 're-ritted your post',
    ritContent: 'Design is not just what it looks like. Design is how it works.',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 'n5',
    type: 'mention',
    user: USERS[4],
    content: 'mentioned you in a rit',
    ritContent: 'Shoutout to @alexmorgan for the insightful thread on design systems...',
    timestamp: '2h ago',
    isRead: true,
  },
  {
    id: 'n6',
    type: 'like',
    user: USERS[1],
    content: 'liked your rit',
    ritContent: 'Golden hour at the Himalayas...',
    timestamp: '3h ago',
    isRead: true,
  },
  {
    id: 'n7',
    type: 'follow',
    user: USERS[4],
    content: 'started following you',
    timestamp: '5h ago',
    isRead: true,
  },
  {
    id: 'n8',
    type: 'comment',
    user: USERS[2],
    content: 'replied to your comment',
    ritContent: 'New track dropping this Friday 🎵🔥',
    timestamp: '1d ago',
    isRead: true,
  },
];

export const TRENDING_HASHTAGS = [
  { tag: 'WebDev', posts: '24.5K rits' },
  { tag: 'AI', posts: '89.2K rits' },
  { tag: 'Design', posts: '12.1K rits' },
  { tag: 'OpenSource', posts: '8.7K rits' },
  { tag: 'Photography', posts: '45.3K rits' },
  { tag: 'Startups', posts: '18.9K rits' },
  { tag: 'Music', posts: '67.4K rits' },
  { tag: 'Travel', posts: '102K rits' },
];

export const SUGGESTED_USERS = [USERS[2], USERS[4], USERS[3]];

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
