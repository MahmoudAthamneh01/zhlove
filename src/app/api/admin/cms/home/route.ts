import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch home page configuration
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /admin/cms/home called');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('❌ No session user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'admin') {
      console.log('❌ User not admin:', user?.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('✅ User is admin, fetching home config');
    
    // Get home page config from database
    const homeConfig = await prisma.cmsContent.findFirst({
      where: {
        type: 'HOME_PAGE',
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log('📊 Database query result:', homeConfig ? 'Found config' : 'No config found');
    
    if (!homeConfig) {
      console.log('📄 Returning default config');
      // Return default configuration
      const defaultConfig = {
        id: 'home-config-default',
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
              bgColor: '#1D1834',
              textColor: '#FFFFFF',
              buttonColor: '#3A9A5B',
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
              bgColor: '#1F152D',
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
              bgColor: '#281B39',
              textColor: '#FFFFFF',
              buttonColor: '#F2C94C',
              alignment: 'center'
            }
          }
        ],
        globalSettings: {
          theme: 'dark',
          primaryColor: '#3A9A5B',
          secondaryColor: '#F2C94C',
          fontFamily: 'arabic',
          customCSS: ''
        },
        lastModified: new Date().toISOString(),
        isPublished: true
      };

      return NextResponse.json(defaultConfig);
    }

    // Parse the JSON content
    const config = JSON.parse(homeConfig.content);
    console.log('📄 Parsed config sections count:', config.sections?.length || 0);
    
    const responseData = {
      ...config,
      id: homeConfig.id,
      lastModified: homeConfig.updatedAt.toISOString(),
      isPublished: homeConfig.isPublished
    };
    
    console.log('📤 Sending response with sections:', responseData.sections?.length || 0);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Error fetching home config:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// PUT - Update home page configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { sections, globalSettings } = body;

    // Validate required fields
    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid sections data' }, 
        { status: 400 }
      );
    }

    // Prepare content for database
    const contentData = {
      sections,
      globalSettings: globalSettings || {
        theme: 'dark',
        primaryColor: '#3A9A5B',
        secondaryColor: '#F2C94C',
        fontFamily: 'arabic',
        customCSS: ''
      }
    };

    console.log('💾 Saving CMS content with auto-publish...');

    // Update or create CMS content with auto-publish
    const updatedConfig = await prisma.cmsContent.upsert({
      where: {
        type_isActive: {
          type: 'HOME_PAGE',
          isActive: true
        }
      },
      update: {
        content: JSON.stringify(contentData),
        updatedBy: user.id,
        isPublished: true, // Auto-publish when saving
        publishedAt: new Date() // Set publish time
      },
      create: {
        type: 'HOME_PAGE',
        title: 'Home Page Configuration',
        titleAr: 'إعدادات الصفحة الرئيسية',
        content: JSON.stringify(contentData),
        createdBy: user.id,
        updatedBy: user.id,
        isActive: true,
        isPublished: true, // Auto-publish when creating
        publishedAt: new Date()
      }
    });

    console.log('✅ Content saved and published automatically');

    return NextResponse.json({
      success: true,
      id: updatedConfig.id,
      lastModified: updatedConfig.updatedAt.toISOString(),
      isPublished: updatedConfig.isPublished,
      publishedAt: updatedConfig.publishedAt?.toISOString(),
      message: 'Configuration saved and published successfully'
    });

  } catch (error) {
    console.error('Error updating home config:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// DELETE - Reset to default configuration
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Deactivate current home page config
    await prisma.cmsContent.updateMany({
      where: {
        type: 'HOME_PAGE',
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error resetting home config:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 