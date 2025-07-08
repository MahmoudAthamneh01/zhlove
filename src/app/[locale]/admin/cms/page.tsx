'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Globe,
  FileText,
  Calendar,
  User,
  Settings,
  GripVertical,
  Target,
  Zap,
  Shield,
  Users,
  Crown,
  Flag,
  Map,
  Trophy,
  Medal,
  Star,
  Layout,
  Type,
  Image,
  Clock,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

// Section Types for Drag & Drop
interface SectionType {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: any;
  color: string;
  category: string;
}

interface PageSection {
  id: string;
  type: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  settings?: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  type: string;
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: string;
  author: {
    username: string;
    name: string;
  };
  sections?: PageSection[];
}

const availableSections: SectionType[] = [
  {
    id: 'hero',
    name: { en: 'Hero Section', ar: 'قسم البطل' },
    description: { en: 'Main banner with title and call-to-action', ar: 'شعار رئيسي مع العنوان ودعوة للعمل' },
    icon: Layout,
    color: 'from-blue-500 to-blue-600',
    category: 'layout'
  },
  {
    id: 'army-showcase',
    name: { en: 'Army Showcase', ar: 'عرض الجيوش' },
    description: { en: 'Interactive army and generals display', ar: 'عرض تفاعلي للجيوش والجنرالات' },
    icon: Users,
    color: 'from-red-500 to-red-600',
    category: 'interactive'
  },
  {
    id: 'strategies',
    name: { en: 'Strategies Gallery', ar: 'معرض الاستراتيجيات' },
    description: { en: 'Battle strategies and tactics showcase', ar: 'عرض استراتيجيات وتكتيكات المعركة' },
    icon: Gamepad2,
    color: 'from-purple-500 to-purple-600',
    category: 'content'
  },
  {
    id: 'timeline',
    name: { en: 'Game Timeline', ar: 'الجدول الزمني للعبة' },
    description: { en: 'Historical evolution of the game', ar: 'التطور التاريخي للعبة' },
    icon: Clock,
    color: 'from-green-500 to-green-600',
    category: 'content'
  },
  {
    id: 'champions',
    name: { en: 'Champions Gallery', ar: 'معرض الأبطال' },
    description: { en: 'Featured players and tournament winners', ar: 'اللاعبون المميزون والفائزون في البطولات' },
    icon: Trophy,
    color: 'from-yellow-500 to-yellow-600',
    category: 'community'
  },
  {
    id: 'features',
    name: { en: 'Platform Features', ar: 'ميزات المنصة' },
    description: { en: 'Highlight platform capabilities', ar: 'إبراز قدرات المنصة' },
    icon: Star,
    color: 'from-indigo-500 to-indigo-600',
    category: 'features'
  },
  {
    id: 'rich-text',
    name: { en: 'Rich Text Content', ar: 'محتوى نصي غني' },
    description: { en: 'Formatted text with images and media', ar: 'نص منسق مع صور ووسائط' },
    icon: Type,
    color: 'from-gray-500 to-gray-600',
    category: 'content'
  }
];

export default function CMSPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  // New page form state
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    type: 'game_info',
    language: locale,
    metaTitle: '',
    metaDescription: '',
    content: '',
    sections: [] as PageSection[]
  });

  // Edit form state for selected page
  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    type: '',
    language: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
    status: 'draft',
    sections: [] as PageSection[]
  });

  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [showSectionEditor, setShowSectionEditor] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    fetchPages();
  }, [session, router]);

  useEffect(() => {
    if (selectedPage) {
      setEditForm({
        title: selectedPage.title || '',
        slug: selectedPage.slug || '',
        type: selectedPage.type || '',
        language: selectedPage.language || '',
        metaTitle: selectedPage.metaTitle || '',
        metaDescription: selectedPage.metaDescription || '',
        content: selectedPage.content || '',
        status: selectedPage.status || 'draft',
        sections: selectedPage.sections || []
      });
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/cms');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPage.title.trim()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      });

      if (response.ok) {
        await fetchPages();
        setShowNewPageForm(false);
        setNewPage({
          title: '',
          slug: '',
          type: 'game_info',
          language: locale,
          metaTitle: '',
          metaDescription: '',
          content: '',
          sections: []
        });
      }
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePage = async () => {
    if (!selectedPage || !editForm.title.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/cms/${selectedPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchPages();
        setIsEditing(false);
        setSelectedPage(null);
      }
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه الصفحة؟' : 'Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cms/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPages();
        if (selectedPage?.id === pageId) {
          setSelectedPage(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handlePublishPage = async (pageId: string) => {
    try {
      const response = await fetch(`/api/admin/cms/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });

      if (response.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error publishing page:', error);
    }
  };

  // Drag & Drop Functions
  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (draggedSection) {
      const sectionInfo = availableSections.find(s => s.id === draggedSection);
      if (!sectionInfo) return;

      const newSection: PageSection = {
        id: generateNewSectionId(),
        type: draggedSection,
        title: sectionInfo.name.en,
        titleAr: sectionInfo.name.ar,
        content: `Default content for ${sectionInfo.name.en}. Click edit to customize this section.`,
        contentAr: `محتوى افتراضي لـ ${sectionInfo.name.ar}. انقر على تحرير لتخصيص هذا القسم.`,
        order: editForm.sections.length + 1,
        settings: {
          category: sectionInfo.category,
          color: sectionInfo.color
        }
      };

      if (isEditing && selectedPage) {
        setEditForm(prev => ({
          ...prev,
          sections: [...prev.sections, newSection]
        }));
      } else if (showNewPageForm) {
        setNewPage(prev => ({
          ...prev,
          sections: [...prev.sections, newSection]
        }));
      }

      setDraggedSection(null);
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    if (isEditing && selectedPage) {
      setEditForm(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }));
    } else if (showNewPageForm) {
      setNewPage(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }));
    }
  };

  const getSectionInfo = (type: string) => {
    return availableSections.find(t => t.id === type);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'layout': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'interactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'content': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'community': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'features': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    
    const newSections = [...editForm.sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    
    setEditForm({
      ...editForm,
      sections: newSections.map((section, i) => ({ ...section, order: i }))
    });
  };

  const moveSectionDown = (index: number) => {
    if (index === editForm.sections.length - 1) return;
    
    const newSections = [...editForm.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    
    setEditForm({
      ...editForm,
      sections: newSections.map((section, i) => ({ ...section, order: i }))
    });
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section);
    setShowSectionEditor(true);
  };

  const handleSaveSectionEdit = (updatedSection: PageSection) => {
    if (isEditing && selectedPage) {
      const updatedSections = editForm.sections.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      );
      setEditForm({
        ...editForm,
        sections: updatedSections
      });
    }
    setShowSectionEditor(false);
    setEditingSection(null);
  };

  const generateNewSectionId = () => {
    return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
            <Settings className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Content Management System
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Build and customize your game information pages with drag & drop functionality
            </p>
          </div>
        </AnimatedBackground>

        {/* Page Builder Interface */}
        <section className="py-16">
          <div className="zh-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Page Builder</h2>
              <div className="flex gap-3">
                <Button 
                  variant="gaming"
                  onClick={() => {
                    // Create or edit Game Info page
                    setIsEditing(true);
                    setEditForm({
                      title: 'Game Information',
                      slug: 'game-info',
                      content: '',
                      metaTitle: 'Game Information - ZH Love',
                      metaDescription: 'Complete guide about Command & Conquer Generals Zero Hour',
                      type: 'game-info',
                      status: 'published',
                      language: locale,
                      sections: []
                    });
                  }}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  تخصيص صفحة معلومات اللعبة
                </Button>
                <Button 
                  variant={isPreviewMode ? 'outline' : 'ghost'} 
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Edit Mode' : 'Preview'}
                </Button>
                <Button 
                  variant="gaming"
                  onClick={handleUpdatePage}
                  disabled={!isEditing}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Page
                </Button>
              </div>
            </div>

            {isEditing ? (
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Available Sections Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="zh-card">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Available Sections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {availableSections.map((section) => {
                        const IconComponent = section.icon;
                        return (
                          <div
                            key={section.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', section.id);
                              setDraggedSection(section.id);
                            }}
                            className="p-3 rounded-lg bg-zh-primary/30 hover:bg-zh-primary/50 cursor-grab active:cursor-grabbing transition-colors group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">
                                  {locale === 'ar' ? section.name.ar : section.name.en}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              {locale === 'ar' ? section.description.ar : section.description.en}
                            </p>
                            <Badge className={`text-xs ${getCategoryColor(section.category)}`}>
                              {section.category}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Page Builder Area */}
                <div className="lg:col-span-3">
                  <Card className="zh-card">
                    <CardHeader>
                      <CardTitle className="text-white">
                        تخصيص الصفحة: {editForm.title}
                      </CardTitle>
                      <p className="text-gray-400">
                        اسحب الأقسام من الشريط الجانبي وأفلتها هنا لبناء صفحتك
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`min-h-96 border-2 border-dashed rounded-lg p-6 transition-colors ${
                          isDraggingOver 
                            ? 'border-zh-accent bg-zh-accent/10' 
                            : 'border-zh-primary/30'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingOver(true);
                        }}
                        onDragLeave={() => setIsDraggingOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingOver(false);
                          
                          const sectionId = e.dataTransfer.getData('text/plain');
                          const sectionInfo = availableSections.find(s => s.id === sectionId);
                          
                          if (sectionInfo) {
                            const newSection: PageSection = {
                              id: generateNewSectionId(),
                              type: sectionId,
                              title: sectionInfo.name.en,
                              titleAr: sectionInfo.name.ar,
                              content: `Default content for ${sectionInfo.name.en}. Click edit to customize.`,
                              contentAr: `محتوى افتراضي لـ ${sectionInfo.name.ar}. انقر على تحرير للتخصيص.`,
                              order: editForm.sections.length,
                              settings: {
                                category: sectionInfo.category,
                                color: sectionInfo.color
                              }
                            };

                            setEditForm(prev => ({
                              ...prev,
                              sections: [...prev.sections, newSection]
                            }));
                          }
                          setDraggedSection(null);
                        }}
                      >
                        {editForm.sections.length === 0 ? (
                          <div className="text-center py-20">
                            <Layout className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">
                              اسحب الأقسام هنا لبناء صفحتك
                            </p>
                            <p className="text-gray-400 text-sm">
                              ابدأ بسحب قسم من الشريط الجانبي
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {editForm.sections.map((section, index) => {
                              const sectionInfo = getSectionInfo(section.type);
                              const IconComponent = sectionInfo?.icon || Layout;
                              
                              return (
                                <Card key={section.id} className="zh-card border-zh-primary/20">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded bg-gradient-to-r ${sectionInfo?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                                          <IconComponent className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-white">
                                            {locale === 'ar' ? section.titleAr : section.title}
                                          </h4>
                                          <p className="text-xs text-gray-400">
                                            {sectionInfo?.name[locale as 'en' | 'ar'] || section.type}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-1">
                                          <button
                                            onClick={() => moveSectionUp(index)}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                                          >
                                            ▲
                                          </button>
                                          <GripVertical className="h-4 w-4 text-gray-400" />
                                          <button
                                            onClick={() => moveSectionDown(index)}
                                            disabled={index === editForm.sections.length - 1}
                                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                                          >
                                            ▼
                                          </button>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleEditSection(section)}
                                          >
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleRemoveSection(section.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <p className="text-sm text-gray-300">
                                      {locale === 'ar' ? section.contentAr : section.content}
                                    </p>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="zh-card text-center py-16">
                <CardContent>
                  <Layout className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    ابدأ بتخصيص صفحة
                  </h3>
                  <p className="text-gray-400 mb-6">
                    اختر صفحة معلومات اللعبة أو أنشئ صفحة جديدة
                  </p>
                  <Button 
                    variant="gaming"
                    onClick={() => {
                      setIsEditing(true);
                      setEditForm({
                        title: 'Game Information',
                        slug: 'game-info',
                        content: '',
                        metaTitle: 'Game Information - ZH Love',
                        metaDescription: 'Complete guide about Command & Conquer Generals Zero Hour',
                        type: 'game-info',
                        status: 'published',
                        language: locale,
                        sections: []
                      });
                    }}
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    تخصيص صفحة معلومات اللعبة
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Section Categories Overview */}
        <section className="py-16 bg-zh-primary/20">
          <div className="zh-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Section Categories
              </h2>
              <p className="text-gray-400 text-lg">
                Different types of sections to create engaging content
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Layout', description: 'Structural elements and containers', color: 'blue', count: 1 },
                { name: 'Interactive', description: 'User engagement and dynamic content', color: 'red', count: 1 },
                { name: 'Content', description: 'Text, media, and information blocks', color: 'purple', count: 2 },
                { name: 'Community', description: 'User-generated and social features', color: 'yellow', count: 1 },
                { name: 'Features', description: 'Platform capabilities showcase', color: 'indigo', count: 1 }
              ].map((category) => (
                <Card key={category.name} className="zh-card group hover:scale-105 transition-transform">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${category.color}-500/20 flex items-center justify-center`}>
                      <BookOpen className={`h-6 w-6 text-${category.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {category.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {category.count} section{category.count > 1 ? 's' : ''}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="py-16">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white">How to Use the Page Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">1. Drag & Drop</h4>
                      <p className="text-gray-400 text-sm">
                        Drag sections from the sidebar to the main area to add them to your page.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">2. Reorder Sections</h4>
                      <p className="text-gray-400 text-sm">
                        Use the up/down arrows to change the order of sections on your page.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">3. Configure Content</h4>
                      <p className="text-gray-400 text-sm">
                        Click the settings icon to customize the content and appearance of each section.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">4. Preview & Save</h4>
                      <p className="text-gray-400 text-sm">
                        Use preview mode to see how your page will look to visitors, then save your changes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Editor Modal */}
        {showSectionEditor && editingSection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="zh-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b border-zh-primary/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Edit Section: {getSectionInfo(editingSection.type)?.name.en}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSectionEditor(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title (English)
                    </label>
                    <Input
                      value={editingSection.title}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        title: e.target.value
                      })}
                      className="mb-4"
                    />
                    <label className="block text-sm font-medium text-white mb-2">
                      Content (English)
                    </label>
                    <Textarea
                      value={editingSection.content}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        content: e.target.value
                      })}
                      rows={6}
                      className="mb-4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title (Arabic)
                    </label>
                    <Input
                      value={editingSection.titleAr}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        titleAr: e.target.value
                      })}
                      className="mb-4"
                      dir="rtl"
                    />
                    <label className="block text-sm font-medium text-white mb-2">
                      Content (Arabic)
                    </label>
                    <Textarea
                      value={editingSection.contentAr}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        contentAr: e.target.value
                      })}
                      rows={6}
                      className="mb-4"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-zh-primary/20">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowSectionEditor(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="gaming" 
                    onClick={() => handleSaveSectionEdit(editingSection)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 