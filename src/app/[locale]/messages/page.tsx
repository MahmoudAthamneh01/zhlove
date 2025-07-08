import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  Send,
  Search,
  Plus,
  User,
  Clock,
  Check,
  CheckCheck,
  Star,
  Archive,
  Trash2,
  Edit,
  Image,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Settings
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    participant: {
      name: "ChinaCommander",
      avatar: "/assets/placeholders/chat.svg",
      status: "online"
    },
    lastMessage: "GG! That was an amazing match. Your micro management is incredible!",
    timestamp: "2024-01-25T10:30:00Z",
    unreadCount: 2,
    isRead: false
  },
  {
    id: 2,
    participant: {
      name: "DesertEagle",
      avatar: "/assets/placeholders/chat.svg",
      status: "offline"
    },
    lastMessage: "Are you available for the clan war tonight?",
    timestamp: "2024-01-25T09:15:00Z",
    unreadCount: 0,
    isRead: true
  },
  {
    id: 3,
    participant: {
      name: "USAGeneral",
      avatar: "/assets/placeholders/chat.svg",
      status: "online"
    },
    lastMessage: "Thanks for the strategy tips! Really helped me improve my game.",
    timestamp: "2024-01-24T18:45:00Z",
    unreadCount: 1,
    isRead: false
  },
  {
    id: 4,
    participant: {
      name: "GLAWarrior",
      avatar: "/assets/placeholders/chat.svg",
      status: "away"
    },
    lastMessage: "Let's practice some 1v1 matches tomorrow.",
    timestamp: "2024-01-24T14:20:00Z",
    unreadCount: 0,
    isRead: true
  }
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: 1,
    sender: "ChinaCommander",
    content: "Hey! Great match earlier. Your USA build was impressive!",
    timestamp: "2024-01-25T10:15:00Z",
    isOwn: false,
    isRead: true
  },
  {
    id: 2,
    sender: "You",
    content: "Thanks! Your China superweapon timing was perfect. I barely held on.",
    timestamp: "2024-01-25T10:16:00Z",
    isOwn: true,
    isRead: true
  },
  {
    id: 3,
    sender: "ChinaCommander",
    content: "Haha, it was close! Want to practice some more matches later?",
    timestamp: "2024-01-25T10:17:00Z",
    isOwn: false,
    isRead: true
  },
  {
    id: 4,
    sender: "You",
    content: "Sure! I'm free after 8 PM. We can work on some advanced strategies.",
    timestamp: "2024-01-25T10:18:00Z",
    isOwn: true,
    isRead: true
  },
  {
    id: 5,
    sender: "ChinaCommander",
    content: "GG! That was an amazing match. Your micro management is incredible!",
    timestamp: "2024-01-25T10:30:00Z",
    isOwn: false,
    isRead: false
  }
];

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online': return 'bg-zh-accent';
    case 'away': return 'bg-zh-gold';
    case 'offline': return 'bg-zh-border';
    default: return 'bg-zh-border';
  }
}

export default function MessagesPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="zh-container py-8">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            
            {/* Hero Section */}
            <AnimatedBackground variant="subtle" className="py-16">
              <div className="zh-container text-center">
                <MessageSquare className="h-16 w-16 text-zh-accent mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {t('messages.title', { default: 'Messages' })}
                </h1>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                  {t('messages.subtitle', { default: 'Private conversations and chat history' })}
                </p>
              </div>
            </AnimatedBackground>

            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="zh-card h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Messages
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search conversations..."
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {mockConversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 hover:bg-zh-primary/20 cursor-pointer transition-colors ${
                          conversation.id === 1 ? 'bg-zh-primary/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={conversation.participant.avatar} 
                              alt={conversation.participant.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zh-secondary ${getStatusColor(conversation.participant.status)}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white truncate">
                                {conversation.participant.name}
                              </h3>
                              <span className="text-xs text-gray-400">
                                {formatTime(conversation.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-zh-accent text-white">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              <Card className="zh-card h-full flex flex-col">
                
                {/* Chat Header */}
                <CardHeader className="border-b border-zh-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src="/assets/placeholders/chat.svg" 
                          alt="ChinaCommander"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zh-secondary bg-green-400"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">ChinaCommander</h3>
                        <p className="text-xs text-green-400">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.isOwn 
                            ? 'bg-zh-accent text-white' 
                            : 'bg-zh-primary/30 text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${
                          message.isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.isOwn && (
                            message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-400" />
                            ) : (
                              <Check className="h-3 w-3 text-gray-400" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-zh-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input 
                        placeholder="Type a message..."
                        className="pr-12"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="gaming" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 