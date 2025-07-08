import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@zh-love.com' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@zh-love.com',
        username: 'admin',
        name: 'ZH-Love Admin',
        password: await bcrypt.hash('admin123', 10),
        status: 'active',
        emailVerified: new Date(),
        joinedAt: new Date(),
        lastSeen: new Date(),
        points: 999999,
        wins: 0,
        losses: 0,
        rank: 'legendary',
        isAdmin: true,
        isModerator: true
      }
    });
    console.log('✅ Admin user created');
  }

  // Create sample users
  const users = []
  const usernames = ['ChinaCommander', 'USAGeneral', 'GLAWarrior', 'RedDragon', 'DesertEagle', 'TankDestroyer', 'AirForceOne', 'StealthMaster']
  
  for (let i = 0; i < usernames.length; i++) {
    const password = await bcrypt.hash('password123', 12)
    const user = await prisma.user.upsert({
      where: { email: `${usernames[i].toLowerCase()}@zh-love.com` },
      update: {},
      create: {
        email: `${usernames[i].toLowerCase()}@zh-love.com`,
        username: usernames[i],
        name: usernames[i],
        password: password,
        rank: ['Recruit', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel', 'General'][Math.floor(Math.random() * 7)],
        points: Math.floor(Math.random() * 5000) + 500,
        wins: Math.floor(Math.random() * 100) + 10,
        losses: Math.floor(Math.random() * 50) + 5,
        xp: Math.floor(Math.random() * 10000) + 1000,
        level: Math.floor(Math.random() * 30) + 5,
      },
    })
    users.push(user)
  }

  // Create sample clans
  const clan1 = await prisma.clan.upsert({
    where: { name: 'Zero Hour Legends' },
    update: {},
    create: {
      name: 'Zero Hour Legends',
      tag: 'ZHL',
      description: 'Elite players dominating the battlefield since 2003',
      ownerId: users[0].id,
      points: 2500,
      wins: 45,
      losses: 12,
      members: {
        create: [
          { userId: users[0].id, role: 'owner' },
          { userId: users[1].id, role: 'leader' },
          { userId: users[2].id, role: 'member' },
          { userId: users[3].id, role: 'member' },
        ]
      }
    },
  })

  const clan2 = await prisma.clan.upsert({
    where: { name: 'Desert Eagles' },
    update: {},
    create: {
      name: 'Desert Eagles',
      tag: 'DE',
      description: 'Masters of desert warfare and tactical supremacy',
      ownerId: users[4].id,
      points: 2200,
      wins: 38,
      losses: 15,
      members: {
        create: [
          { userId: users[4].id, role: 'owner' },
          { userId: users[5].id, role: 'leader' },
          { userId: users[6].id, role: 'member' },
          { userId: users[7].id, role: 'member' },
        ]
      }
    },
  })

  // Create sample tournaments
  const existingTournament = await prisma.tournament.findFirst({
    where: { title: 'Spring Championship 2024' }
  })
  
  if (!existingTournament) {
    const tournament1 = await prisma.tournament.create({
      data: {
        title: 'Spring Championship 2024',
        description: 'Annual spring tournament featuring the best ZH players',
        type: '1v1',
        format: 'single elimination',
        maxParticipants: 32,
        prizePool: 500,
        prizeDescription: '$500 USD cash prize',
        entryFee: 0,
        status: 'upcoming',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        rules: 'Standard tournament rules apply. Best of 3 matches.',
        requirements: 'Minimum rank: Sergeant, Active forum member',
        mapPool: JSON.stringify(['Tournament Desert', 'Urban Conflict', 'Mountain Pass']),
        isPublic: true,
        allowSpectators: true,
        organizerId: adminUser!.id,
        participants: {
          create: [
            { userId: users[0].id },
            { userId: users[1].id },
            { userId: users[2].id },
            { userId: users[4].id },
          ]
        }
      },
    })
  }

  // Create sample forum posts
  const existingPost1 = await prisma.forumPost.findFirst({
    where: { title: 'Welcome to ZH-Love Community!' }
  })
  
  if (!existingPost1) {
    const forumPost1 = await prisma.forumPost.create({
      data: {
        title: 'Welcome to ZH-Love Community!',
        content: 'Welcome to the largest Arabic & global community for Command & Conquer: Generals Zero Hour! Here you can discuss strategies, find players, join tournaments, and much more.',
        authorId: adminUser.id,
        category: 'general',
        isPinned: true,
        comments: {
          create: [
            {
              content: 'Excited to be part of this community!',
              authorId: users[0].id,
            },
            {
              content: 'Looking forward to some great matches!',
              authorId: users[1].id,
            }
          ]
        }
      },
    })
  }

  const existingPost2 = await prisma.forumPost.findFirst({
    where: { title: 'Best China Build Orders for 1v1' }
  })
  
  if (!existingPost2) {
    const forumPost2 = await prisma.forumPost.create({
      data: {
        title: 'Best China Build Orders for 1v1',
        content: 'What are your favorite China build orders for 1v1 matches? I\'ve been experimenting with early nuclear power into overlords.',
        authorId: users[0].id,
        category: 'strategy',
        comments: {
          create: [
            {
              content: 'I prefer the classic barracks first approach for early pressure.',
              authorId: users[1].id,
            }
          ]
        }
      },
    })
  }

  // Create sample badges
  const badges = [
    { name: 'Tournament Winner', description: 'Won a tournament', icon: '🏆', category: 'tournament' },
    { name: 'Forum Veteran', description: 'Active forum participant', icon: '💬', category: 'forum' },
    { name: 'Clan Leader', description: 'Leading a successful clan', icon: '👑', category: 'special' },
    { name: 'Elite Player', description: 'Reached top ranking tier', icon: '⭐', category: 'ranking' },
  ]

  for (const badgeData of badges) {
    await prisma.badge.upsert({
      where: { name: badgeData.name },
      update: {},
      create: badgeData,
    })
  }

  // Create sample streamers
  const streamers = [
    { name: 'ProZHPlayer', youtubeChannel: '@prozhplayer', channelId: 'UC1234567890', subscribers: 15000 },
    { name: 'ZHMaster', youtubeChannel: '@zhmaster', channelId: 'UC0987654321', subscribers: 8500 },
    { name: 'DesertStorm', youtubeChannel: '@desertstorm', channelId: 'UC1122334455', subscribers: 12000 },
  ]

  for (const streamerData of streamers) {
    await prisma.streamer.upsert({
      where: { youtubeChannel: streamerData.youtubeChannel },
      update: {},
      create: streamerData,
    })
  }

  // Create sample CMS pages
  const pages = [
    {
      title: 'Game History & Evolution',
      slug: 'game-history',
      content: `
        <h2>Command & Conquer: Generals Zero Hour - The Evolution</h2>
        <p>Command & Conquer: Generals Zero Hour marked a revolutionary step in real-time strategy gaming when it was released in 2004 as an expansion to the original Generals game.</p>
        
        <h3>Key Features That Defined Zero Hour:</h3>
        <ul>
          <li><strong>Nine Unique Generals:</strong> Each with specialized units and powers</li>
          <li><strong>Enhanced Faction Warfare:</strong> USA, China, and GLA with distinct playstyles</li>
          <li><strong>General's Powers System:</strong> Strategic abilities that change the battlefield</li>
          <li><strong>Advanced Combat Mechanics:</strong> Including veterancy and experience systems</li>
        </ul>

        <h3>The Competitive Scene</h3>
        <p>Zero Hour quickly became a staple in competitive RTS gaming, with tournaments worldwide attracting thousands of players. The game's balance between micro-management and strategic thinking created endless replayability.</p>
      `,
      metaTitle: 'Game History - Command & Conquer Generals Zero Hour',
      metaDescription: 'Learn about the history and evolution of Command & Conquer: Generals Zero Hour',
      type: 'game_info',
      status: 'published',
      language: 'en',
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
    {
      title: 'تاريخ اللعبة وتطورها',
      slug: 'game-history-ar',
      content: `
        <h2>Command & Conquer: Generals Zero Hour - التطور والتاريخ</h2>
        <p>لعبة Command & Conquer: Generals Zero Hour شكلت نقلة ثورية في عالم ألعاب الاستراتيجية الفورية عندما تم إصدارها في عام 2004 كتوسعة للعبة Generals الأصلية.</p>
        
        <h3>المميزات الرئيسية التي ميزت Zero Hour:</h3>
        <ul>
          <li><strong>تسعة جنرالات فريدين:</strong> كل منهم بوحدات وقوى متخصصة</li>
          <li><strong>حروب الفصائل المحسنة:</strong> أمريكا والصين وجيش التحرير الشعبي بأساليب لعب متميزة</li>
          <li><strong>نظام قوى الجنرال:</strong> قدرات استراتيجية تغير ساحة المعركة</li>
          <li><strong>آليات قتال متطورة:</strong> تشمل نظام الخبرة والتجربة</li>
        </ul>

        <h3>المشهد التنافسي</h3>
        <p>أصبحت Zero Hour بسرعة عنصراً أساسياً في ألعاب RTS التنافسية، مع بطولات عالمية تجذب الآلاف من اللاعبين. التوازن في اللعبة بين الإدارة الدقيقة والتفكير الاستراتيجي خلق إمكانيات لا نهائية للعب.</p>
      `,
      metaTitle: 'تاريخ اللعبة - Command & Conquer Generals Zero Hour',
      metaDescription: 'تعرف على تاريخ وتطور لعبة Command & Conquer: Generals Zero Hour',
      type: 'game_info',
      status: 'published',
      language: 'ar',
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
    {
      title: 'Getting Started Guide',
      slug: 'getting-started',
      content: `
        <h2>Welcome to Zero Hour</h2>
        <p>New to Command & Conquer: Generals Zero Hour? This guide will help you get started on your journey to becoming a skilled commander.</p>
        
        <h3>Download and Installation</h3>
        <ol>
          <li>Download the official game from our downloads section</li>
          <li>Install following the setup wizard</li>
          <li>Apply the latest community patches</li>
          <li>Configure graphics and controls to your preference</li>
        </ol>

        <h3>First Steps</h3>
        <p>Start with the tutorial missions to understand basic mechanics, then try skirmish matches against AI before jumping into multiplayer.</p>

        <h3>Choosing Your Faction</h3>
        <ul>
          <li><strong>USA:</strong> High-tech units, laser defenses, air superiority</li>
          <li><strong>China:</strong> Heavy armor, nuclear power, overwhelming numbers</li>
          <li><strong>GLA:</strong> Guerrilla tactics, stealth units, hit-and-run strategies</li>
        </ul>
      `,
      metaTitle: 'Getting Started with Zero Hour',
      metaDescription: 'Complete beginner guide for new Zero Hour players',
      type: 'support',
      status: 'published',
      language: 'en',
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  ]

  for (const pageData of pages) {
    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {},
      create: pageData,
    })
  }

  // Create forum posts
  console.log('Creating forum posts...');
  const forumPosts = [
    {
      title: 'Best GLA strategies for beginners',
      content: 'I\'m looking for some solid GLA strategies that work well against USA and China players. Any tips for someone just starting with GLA? I\'ve been struggling against laser towers and superweapons.',
      category: 'strategy',
      tags: JSON.stringify(['strategy', 'gla', 'beginner', 'tips']),
      views: 234,
      isPinned: false,
      authorId: users[1].id
    },
    {
      title: 'Tournament Results - Winter Championship 2024',
      content: 'Congratulations to all participants! Here are the final results from our Winter Championship. Special thanks to all players who made this tournament exciting. The next tournament will be announced soon!',
      category: 'tournament',
      tags: JSON.stringify(['tournament', 'results', 'championship', 'winners']),
      views: 1205,
      isPinned: true,
      authorId: adminUser.id
    },
    {
      title: 'Looking for clan members - Desert Eagles',
      content: 'Our clan "Desert Eagles" is looking for active players. Requirements: Rank Gold+ and active participation in clan wars. We focus on strategy improvement and team play. Message me if interested!',
      category: 'clans',
      tags: JSON.stringify(['clan', 'recruitment', 'team', 'desert-eagles']),
      views: 89,
      isPinned: false,
      authorId: users[2].id
    },
    {
      title: 'New patch discussion - Balance changes',
      content: 'What do you think about the recent balance changes? USA seems stronger now with the new laser upgrades, while GLA got some nice stealth improvements. How has this affected your gameplay?',
      category: 'discussion',
      tags: JSON.stringify(['patch', 'balance', 'discussion', 'usa', 'gla']),
      views: 567,
      isPinned: false,
      authorId: users[0].id
    },
    {
      title: 'Sharing my China Nuclear build order',
      content: 'Here\'s my optimized China Nuclear build order that has been working great in ranked matches. This build focuses on early economy and quick nuclear research. Let me know what you think!',
      category: 'strategy',
      tags: JSON.stringify(['china', 'nuclear', 'build-order', 'strategy']),
      views: 342,
      isPinned: false,
      authorId: users[1].id
    },
    {
      title: 'Bug Report: Game crashes on Desert Storm map',
      content: 'I\'ve been experiencing crashes when playing on the Desert Storm map, specifically when using GLA tunnel networks. Has anyone else encountered this issue? Playing on Windows 11.',
      category: 'discussion',
      tags: JSON.stringify(['bug', 'crash', 'desert-storm', 'gla', 'windows-11']),
      views: 156,
      isPinned: false,
      authorId: users[3].id
    }
  ];

  const createdPosts = await Promise.all(
    forumPosts.map(post => 
      prisma.forumPost.create({
        data: post
      })
    )
  );

  // Create forum comments
  console.log('Creating forum comments...');
  const forumComments = [
    {
      content: 'Great question! For GLA beginners, I recommend starting with Toxin General. His chemical weapons are very effective against infantry-heavy builds.',
      postId: createdPosts[0].id,
      authorId: users[2].id,
      likes: 5
    },
    {
      content: 'Also try using tunnel networks for quick flanking attacks. They\'re great for bypassing enemy defenses!',
      postId: createdPosts[0].id,
      authorId: users[3].id,
      likes: 3
    },
    {
      content: 'Congratulations to ProGamer2024 for winning the championship! Well deserved victory.',
      postId: createdPosts[1].id,
      authorId: users[0].id,
      likes: 12
    },
    {
      content: 'When will the next tournament be announced? I\'m really looking forward to participating!',
      postId: createdPosts[1].id,
      authorId: users[1].id,
      likes: 8
    },
    {
      content: 'I\'m interested in joining! My current rank is Platinum, is that enough?',
      postId: createdPosts[2].id,
      authorId: users[0].id,
      likes: 2
    },
    {
      content: 'The laser buff was needed, but maybe they overdid it a bit. USA feels too strong in late game now.',
      postId: createdPosts[3].id,
      authorId: users[2].id,
      likes: 7
    },
    {
      content: 'I agree about USA being stronger, but GLA\'s stealth improvements help balance it out in my opinion.',
      postId: createdPosts[3].id,
      authorId: users[1].id,
      likes: 4
    },
    {
      content: 'Thanks for sharing! I\'ve been struggling with China builds. Will definitely try this out.',
      postId: createdPosts[4].id,
      authorId: users[3].id,
      likes: 6
    }
  ];

  await Promise.all(
    forumComments.map(comment => 
      prisma.forumComment.create({
        data: comment
      })
    )
  );

  // Create some post likes
  console.log('Creating post likes...');
  const postLikes = [
    { userId: users[0].id, postId: createdPosts[0].id },
    { userId: users[1].id, postId: createdPosts[0].id },
    { userId: users[2].id, postId: createdPosts[0].id },
    { userId: users[0].id, postId: createdPosts[1].id },
    { userId: users[1].id, postId: createdPosts[1].id },
    { userId: users[2].id, postId: createdPosts[1].id },
    { userId: users[3].id, postId: createdPosts[1].id },
    { userId: users[0].id, postId: createdPosts[2].id },
    { userId: users[1].id, postId: createdPosts[3].id },
    { userId: users[2].id, postId: createdPosts[3].id }
  ];

  await Promise.all(
    postLikes.map(like => 
      prisma.postLike.create({
        data: like
      })
    )
  );

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 