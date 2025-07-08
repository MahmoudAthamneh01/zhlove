import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch published home page configuration for public use
export async function GET(request: NextRequest) {
  try {
    // Get published home page config from database
    const homeConfig = await prisma.cmsContent.findFirst({
      where: {
        type: 'HOME_PAGE',
        isActive: true,
        isPublished: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    if (!homeConfig) {
      // Return default configuration if none exists
      const defaultConfig = {
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
        }
      };

      return NextResponse.json(defaultConfig);
    }

    // Parse and return the published content
    const config = JSON.parse(homeConfig.content);
    
    return NextResponse.json({
      sections: config.sections || [],
      globalSettings: config.globalSettings || {
        theme: 'dark',
        primaryColor: '#3A9A5B',
        secondaryColor: '#F2C94C',
        fontFamily: 'arabic',
        customCSS: ''
      },
      lastPublished: homeConfig.publishedAt?.toISOString(),
      lastModified: homeConfig.updatedAt.toISOString()
    });

  } catch (error) {
    console.error('Error fetching published home config:', error);
    
    // Return default configuration on error
    const defaultConfig = {
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'Dominate the Battlefield',
          titleAr: 'سيطر على ساحة المعركة',
          content: 'Join the largest community for Generals Zero Hour players.',
          contentAr: 'انضم إلى أكبر مجتمع للاعبي Generals Zero Hour.',
          order: 1,
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
      }
    };
    
    return NextResponse.json(defaultConfig);
  }
} 