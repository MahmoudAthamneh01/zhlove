'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Home, 
  Settings, 
  Eye, 
  Edit, 
  Save, 
  RotateCcw, 
  Upload,
  Type,
  ImageIcon,
  Layout,
  Star,
  Trophy,
  Users,
  MessageSquare,
  Gamepad2,
  Target,
  Swords,
  Crown,
  Palette,
  Monitor,
  RefreshCw
} from 'lucide-react';

interface HomeSection {
  id: string;
  type: 'hero' | 'stats' | 'features' | 'cta' | 'custom';
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  isVisible: boolean;
  settings: {
    bgColor?: string;
    textColor?: string;
    buttonColor?: string;
    alignment?: 'left' | 'center' | 'right';
    animation?: string;
    customClass?: string;
  };
}

interface HomePageConfig {
  id: string;
  sections: HomeSection[];
  globalSettings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCSS: string;
  };
  lastModified: string;
  isPublished: boolean;
}

const sectionTypes = [
  {
    id: 'hero',
    name: { en: 'Hero Section', ar: 'القسم الرئيسي' },
    description: { en: 'Main banner with title and call-to-action', ar: 'الشعار الرئيسي مع العنوان ودعوة للعمل' },
    icon: Layout,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'stats',
    name: { en: 'Live Statistics', ar: 'إحصائيات مباشرة' },
    description: { en: 'Real-time platform statistics', ar: 'إحصائيات المنصة في الوقت الفعلي' },
    icon: Trophy,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'features',
    name: { en: 'Feature Showcase', ar: 'عرض الميزات' },
    description: { en: 'Platform features and capabilities', ar: 'ميزات وقدرات المنصة' },
    icon: Star,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cta',
    name: { en: 'Call to Action', ar: 'دعوة للعمل' },
    description: { en: 'Encourage user registration and engagement', ar: 'تشجيع تسجيل المستخدمين والتفاعل' },
    icon: Target,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'custom',
    name: { en: 'Custom Section', ar: 'قسم مخصص' },
    description: { en: 'Fully customizable content section', ar: 'قسم محتوى قابل للتخصيص بالكامل' },
    icon: Type,
    color: 'from-gray-500 to-gray-600'
  }
];

export default function HomePageCMS() {
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [selectedSection, setSelectedSection] = useState<HomeSection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const [editForm, setEditForm] = useState<HomeSection>({
    id: '',
    type: 'custom',
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    order: 1,
    isVisible: true,
    settings: {
      bgColor: '#1D1834',
      textColor: '#FFFFFF',
      buttonColor: '#3A9A5B',
      alignment: 'center',
      animation: 'fade-in',
      customClass: ''
    }
  });

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchHomeConfig();
  }, [session, router]);

  const fetchHomeConfig = async () => {
    try {
      console.log('📡 Fetching home config from /api/admin/cms/home...');
      const response = await fetch('/api/admin/cms/home');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📡 Received data:', data);
        setConfig(data);
      } else {
        console.log('📡 Response not ok, creating default config');
        // Create default config if none exists
        const defaultConfig = createDefaultConfig();
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('📡 Error fetching home config:', error);
      const defaultConfig = createDefaultConfig();
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultConfig = (): HomePageConfig => {
    return {
      id: 'home-config-1',
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'Dominate the Battlefield',
          titleAr: 'سيطر على ساحة المعركة',
          content: 'Join the largest community for Generals Zero Hour players. Compete, connect, and conquer.',
          contentAr: 'انضم إلى أكبر مجتمع للاعبي Generals Zero Hour. تنافس، تواصل، وسيطر.',
          order: 1,
          isVisible: true,
          settings: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            buttonColor: '#32CD32',
            alignment: 'center',
            animation: 'fade-in'
          }
        },
        {
          id: 'stats-1',
          type: 'stats',
          title: 'Live Platform Statistics',
          titleAr: 'إحصائيات المنصة المباشرة',
          content: 'Real-time data from our gaming community',
          contentAr: 'بيانات في الوقت الفعلي من مجتمع الألعاب لدينا',
          order: 2,
          isVisible: true,
          settings: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            alignment: 'center'
          }
        },
        {
          id: 'features-1',
          type: 'features',
          title: 'Discover Everything About ZH-Love',
          titleAr: 'اكتشف كل شيء عن ZH-Love',
          content: 'Explore our platform features and capabilities',
          contentAr: 'استكشف ميزات وقدرات منصتنا',
          order: 3,
          isVisible: true,
          settings: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            alignment: 'center'
          }
        },
        {
          id: 'cta-1',
          type: 'cta',
          title: 'Are You Ready to Compete?',
          titleAr: 'هل أنت مستعد للمنافسة؟',
          content: 'Create your free account now and join thousands of players in the battlefield.',
          contentAr: 'أنشئ حسابك المجاني الآن وانضم إلى آلاف اللاعبين في ساحة المعركة.',
          order: 4,
          isVisible: true,
          settings: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            buttonColor: '#32CD32',
            alignment: 'center'
          }
        }
      ],
      globalSettings: {
        theme: 'dark',
        primaryColor: '#32CD32',
        secondaryColor: '#FFD700',
        fontFamily: 'arabic',
        customCSS: ''
      },
      lastModified: new Date().toISOString(),
      isPublished: false
    };
  };

  const handleSaveSection = async () => {
    if (!config) return;

    setSaving(true);
    try {
      let updatedSections;
      
      if (selectedSection) {
        // Update existing section
        updatedSections = config.sections.map(s => 
          s.id === selectedSection.id ? editForm : s
        );
      } else {
        // Add new section
        const newSection = { 
          ...editForm, 
          id: `section-${Date.now()}`,
          order: config.sections.length + 1
        };
        updatedSections = [...config.sections, newSection];
      }

      const updatedConfig = {
        sections: updatedSections,
        globalSettings: config.globalSettings || {
          theme: 'dark',
          primaryColor: '#32CD32',
          secondaryColor: '#FFD700',
          fontFamily: 'arabic',
          customCSS: ''
        }
      };

      console.log('💾 Saving section:', editForm.titleAr, editForm.title);

      const response = await fetch('/api/admin/cms/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Save successful, refreshing...');
        
        // Force immediate UI update
        setConfig({
          id: result.id || config.id,
          sections: updatedSections,
          globalSettings: updatedConfig.globalSettings,
          lastModified: result.lastModified || new Date().toISOString(),
          isPublished: result.isPublished || false
        });
        
        // Also refresh from server to ensure data consistency
        setTimeout(() => {
          fetchHomeConfig();
        }, 100);
        
        setIsEditing(false);
        setSelectedSection(null);
        
        // Reset form
        setEditForm({
          id: '',
          type: 'custom',
          title: '',
          titleAr: '',
          content: '',
          contentAr: '',
          order: 1,
          isVisible: true,
          settings: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            buttonColor: '#32CD32',
            alignment: 'center',
            animation: 'fade-in',
            customClass: ''
          }
        });
        
        alert(locale === 'ar' ? 'تم حفظ ونشر القسم بنجاح! ✅' : 'Section saved and published successfully! ✅');
      } else {
        const errorData = await response.json();
        console.error('❌ Save failed:', errorData);
        throw new Error('Failed to save section');
      }
    } catch (error) {
      console.error('❌ Error saving section:', error);
      alert(locale === 'ar' ? 'حدث خطأ في حفظ القسم' : 'Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!config) return;

    setSaving(true);
    try {
      let updatedSections;
      
      if (selectedSection) {
        // Update existing section
        updatedSections = config.sections.map(s => 
          s.id === selectedSection.id ? editForm : s
        );
      } else {
        // Add new section
        const newSection = { 
          ...editForm, 
          id: `section-${Date.now()}`,
          order: config.sections.length + 1
        };
        updatedSections = [...config.sections, newSection];
      }

      const updatedConfig = {
        sections: updatedSections,
        globalSettings: config.globalSettings || {
          theme: 'dark',
          primaryColor: '#32CD32',
          secondaryColor: '#FFD700',
          fontFamily: 'arabic',
          customCSS: ''
        }
      };

      console.log('💾 Saving and publishing section:', editForm.titleAr, editForm.title);

      // First save the changes
      const saveResponse = await fetch('/api/admin/cms/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save section');
      }

      // Then publish the changes
      const publishResponse = await fetch('/api/admin/cms/home/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!publishResponse.ok) {
        throw new Error('Failed to publish changes');
      }

      console.log('✅ Save and publish successful, refreshing...');
      
      // Refresh the page to get the latest data
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error saving and publishing:', error);
      alert(locale === 'ar' ? 'حدث خطأ في حفظ ونشر التغييرات' : 'Error saving and publishing changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishChanges = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/cms/home/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        
        // Refresh the config to get updated publish status
        await fetchHomeConfig();
        
        alert(locale === 'ar' ? 'تم نشر التغييرات بنجاح!' : 'Changes published successfully!');
      } else {
        throw new Error('Failed to publish changes');
      }
    } catch (error) {
      console.error('Error publishing changes:', error);
      alert(locale === 'ar' ? 'حدث خطأ في نشر التغييرات' : 'Error publishing changes');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSection = (section: HomeSection) => {
    setSelectedSection(section);
    setEditForm(section);
    setIsEditing(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!config) return;
    
    if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this section?')) {
      const updatedSections = config.sections.filter(s => s.id !== sectionId);
      setConfig({ ...config, sections: updatedSections });
    }
  };

  const getSectionIcon = (type: string) => {
    const sectionType = sectionTypes.find(t => t.id === type);
    return sectionType?.icon || Type;
  };

  const getSectionColor = (type: string) => {
    const sectionType = sectionTypes.find(t => t.id === type);
    return sectionType?.color || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600 text-xl">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <AnimatedBackground variant="hero" className="py-16">
          <div className="zh-container text-center">
            <Home className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {locale === 'ar' ? 'تخصيص الصفحة الرئيسية' : 'Customize Home Page'}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {locale === 'ar' 
                ? 'قم بتخصيص محتوى الصفحة الرئيسية بالكامل مع معاينة مباشرة للتغييرات' 
                : 'Fully customize your home page content with live preview of changes'
              }
            </p>
          </div>
        </AnimatedBackground>

        {/* Main Content */}
        <section className="py-16 bg-zh-background">
          <div className="zh-container">
            
            {/* Control Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {locale === 'ar' ? 'إدارة محتوى الصفحة الرئيسية' : 'Home Page Content Management'}
                </h2>
                <p className="text-zh-border">
                  {locale === 'ar' 
                    ? 'قم بتخصيص أقسام الصفحة الرئيسية ومعاينة التغييرات مباشرة' 
                    : 'Customize home page sections and preview changes live'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoading(true);
                    fetchHomeConfig();
                  }}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {locale === 'ar' ? 'تحديث' : 'Refresh'}
                </Button>
                
                <Badge variant={config?.isPublished ? 'default' : 'secondary'}>
                  {config?.isPublished 
                    ? (locale === 'ar' ? 'منشور' : 'Published')
                    : (locale === 'ar' ? 'مسودة' : 'Draft')
                  }
                </Badge>
                
                <Button
                  variant="gaming"
                  onClick={handlePublishChanges}
                  disabled={saving || config?.isPublished}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving 
                    ? (locale === 'ar' ? 'جاري النشر...' : 'Publishing...')
                    : (locale === 'ar' ? 'نشر التغييرات' : 'Publish Changes')
                  }
                </Button>
              </div>
            </div>

            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections">{locale === 'ar' ? 'الأقسام' : 'Sections'}</TabsTrigger>
                <TabsTrigger value="preview">{locale === 'ar' ? 'المعاينة' : 'Preview'}</TabsTrigger>
                <TabsTrigger value="settings">{locale === 'ar' ? 'الإعدادات' : 'Settings'}</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="space-y-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  
                  {/* Sections List */}
                  <div className="lg:col-span-1">
                    <Card className="zh-card">
                      <CardHeader>
                        <CardTitle className="text-white">
                          {locale === 'ar' ? 'أقسام الصفحة' : 'Page Sections'}
                        </CardTitle>
                        <Button
                          variant="gaming"
                          size="sm"
                          onClick={() => {
                            setSelectedSection(null);
                            setEditForm({
                              id: '',
                              type: 'custom',
                              title: '',
                              titleAr: '',
                              content: '',
                              contentAr: '',
                              order: config?.sections.length ? Math.max(...config.sections.map(s => s.order)) + 1 : 1,
                              isVisible: true,
                              settings: {
                                bgColor: '#1D1834',
                                textColor: '#FFFFFF',
                                buttonColor: '#3A9A5B',
                                alignment: 'center',
                                animation: 'fade-in'
                              }
                            });
                            setIsEditing(true);
                          }}
                          className="w-full"
                        >
                          + {locale === 'ar' ? 'إضافة قسم' : 'Add Section'}
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {config?.sections
                          .sort((a, b) => a.order - b.order)
                          .map((section) => {
                            const Icon = getSectionIcon(section.type);
                            return (
                              <div
                                key={section.id}
                                className={`p-3 rounded-lg bg-zh-secondary border border-zh-border cursor-pointer hover:border-zh-accent transition-colors ${
                                  selectedSection?.id === section.id ? 'border-zh-accent bg-zh-accent/10' : ''
                                }`}
                                onClick={() => handleEditSection(section)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded bg-gradient-to-r ${getSectionColor(section.type)}`}>
                                      <Icon className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {locale === 'ar' ? section.titleAr || section.title : section.title}
                                      </p>
                                      <p className="text-xs text-gray-400 capitalize">
                                        {section.type}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {section.isVisible ? (
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    ) : (
                                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section Editor */}
                  <div className="lg:col-span-3">
                    {isEditing ? (
                      <Card className="zh-card">
                        <CardHeader>
                          <CardTitle className="text-white">
                            {selectedSection 
                              ? (locale === 'ar' ? 'تحرير القسم' : 'Edit Section')
                              : (locale === 'ar' ? 'إضافة قسم جديد' : 'Add New Section')
                            }
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          
                          {/* Section Type Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {locale === 'ar' ? 'نوع القسم' : 'Section Type'}
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                              {sectionTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <div
                                    key={type.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                      editForm.type === type.id
                                        ? 'border-zh-accent bg-zh-accent/10'
                                        : 'border-zh-border bg-zh-secondary hover:border-zh-accent/50'
                                    }`}
                                    onClick={() => setEditForm({ ...editForm, type: type.id as any })}
                                  >
                                    <div className={`p-2 rounded bg-gradient-to-r ${type.color} mb-2`}>
                                      <Icon className="h-4 w-4 text-white mx-auto" />
                                    </div>
                                    <p className="text-xs text-white text-center font-medium">
                                      {locale === 'ar' ? type.name.ar : type.name.en}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <Separator />

                          {/* Content Fields */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                العنوان (العربية)
                              </label>
                              <Input
                                value={editForm.titleAr}
                                onChange={(e) => setEditForm({ ...editForm, titleAr: e.target.value })}
                                placeholder="أدخل العنوان بالعربية..."
                                className="zh-input"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title (English)
                              </label>
                              <Input
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Enter title in English..."
                                className="zh-input"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                المحتوى (العربية)
                              </label>
                              <Textarea
                                value={editForm.contentAr}
                                onChange={(e) => setEditForm({ ...editForm, contentAr: e.target.value })}
                                placeholder="أدخل المحتوى بالعربية..."
                                className="zh-input min-h-[120px]"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content (English)
                              </label>
                              <Textarea
                                value={editForm.content}
                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                placeholder="Enter content in English..."
                                className="zh-input min-h-[120px]"
                              />
                            </div>
                          </div>

                          <Separator />

                          {/* Settings */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">
                              {locale === 'ar' ? 'إعدادات التصميم' : 'Design Settings'}
                            </h4>
                            
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  {locale === 'ar' ? 'لون الخلفية' : 'Background Color'}
                                </label>
                                <Input
                                  type="color"
                                  value={editForm.settings.bgColor}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    settings: { ...editForm.settings, bgColor: e.target.value }
                                  })}
                                  className="zh-input h-12"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  {locale === 'ar' ? 'لون النص' : 'Text Color'}
                                </label>
                                <Input
                                  type="color"
                                  value={editForm.settings.textColor}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    settings: { ...editForm.settings, textColor: e.target.value }
                                  })}
                                  className="zh-input h-12"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  {locale === 'ar' ? 'المحاذاة' : 'Alignment'}
                                </label>
                                <select
                                  value={editForm.settings.alignment}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    settings: { ...editForm.settings, alignment: e.target.value as any }
                                  })}
                                  className="zh-input"
                                >
                                  <option value="left">{locale === 'ar' ? 'يسار' : 'Left'}</option>
                                  <option value="center">{locale === 'ar' ? 'وسط' : 'Center'}</option>
                                  <option value="right">{locale === 'ar' ? 'يمين' : 'Right'}</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-6">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setSelectedSection(null);
                              }}
                              className="flex-1"
                            >
                              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                            </Button>
                            
                            <Button
                              variant="gaming"
                              onClick={async () => {
                                await handleSaveSection();
                                // Use router.refresh() instead of window.location.reload()
                                router.refresh();
                              }}
                              disabled={saving}
                              className="flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4" />
                              {saving 
                                ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                                : (locale === 'ar' ? 'حفظ وتحديث' : 'Save & Refresh')
                              }
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="zh-card text-center py-16">
                        <CardContent>
                          <Settings className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {locale === 'ar' ? 'اختر قسماً للتحرير' : 'Select a Section to Edit'}
                          </h3>
                          <p className="text-gray-400 mb-6">
                            {locale === 'ar' 
                              ? 'اختر قسماً من القائمة الجانبية أو أضف قسماً جديداً لبدء التخصيص'
                              : 'Choose a section from the sidebar or add a new section to start customizing'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="zh-card">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {locale === 'ar' ? 'معاينة الصفحة الرئيسية' : 'Home Page Preview'}
                    </CardTitle>
                    <p className="text-gray-400">
                      {locale === 'ar' 
                        ? 'معاينة مباشرة لكيف ستظهر الصفحة الرئيسية للزوار'
                        : 'Live preview of how the home page will appear to visitors'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-zh-border rounded-lg bg-zh-background p-6">
                      <iframe
                        src="/ar?preview=true"
                        className="w-full h-[600px] border-0 rounded"
                        title="Home Page Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="zh-card">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {locale === 'ar' ? 'الإعدادات العامة' : 'Global Settings'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {locale === 'ar' ? 'اللون الأساسي' : 'Primary Color'}
                        </label>
                        <Input
                          type="color"
                          value={config?.globalSettings.primaryColor}
                          onChange={(e) => setConfig(config ? {
                            ...config,
                            globalSettings: { ...config.globalSettings, primaryColor: e.target.value }
                          } : null)}
                          className="zh-input h-12"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {locale === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}
                        </label>
                        <Input
                          type="color"
                          value={config?.globalSettings.secondaryColor}
                          onChange={(e) => setConfig(config ? {
                            ...config,
                            globalSettings: { ...config.globalSettings, secondaryColor: e.target.value }
                          } : null)}
                          className="zh-input h-12"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {locale === 'ar' ? 'CSS مخصص' : 'Custom CSS'}
                      </label>
                      <Textarea
                        value={config?.globalSettings.customCSS}
                        onChange={(e) => setConfig(config ? {
                          ...config,
                          globalSettings: { ...config.globalSettings, customCSS: e.target.value }
                        } : null)}
                        placeholder={locale === 'ar' ? 'أدخل CSS مخصص...' : 'Enter custom CSS...'}
                        className="zh-input min-h-[200px] font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 