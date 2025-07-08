import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Download, 
  MessageCircle,
  FileQuestion,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  MessageSquare,
  Shield,
  Zap,
  Settings,
  Bug,
  Users
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default function SupportPage({
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
        {/* Hero Section */}
        <AnimatedBackground variant="hero" className="py-16">
          <div className="zh-container text-center">
            <HelpCircle className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('support.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t('support.subtitle')}
            </p>
          </div>
        </AnimatedBackground>

        {/* Quick Actions */}
        <section className="py-8 bg-zh-primary/20">
          <div className="zh-container">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t('support.requestForm')}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Submit a detailed support request
                  </p>
                </CardContent>
              </Card>

              <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Download className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t('support.downloadGame')}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Get the latest game version
                  </p>
                </CardContent>
              </Card>

              <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileQuestion className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t('support.faq')}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Quick answers to common questions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Request Form */}
        <section className="py-16">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('support.requestForm')}
                </h2>
                <p className="text-gray-400 text-lg">
                  Having issues? Submit a detailed support request and our team will help you
                </p>
              </div>

              <Card className="zh-card">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          {t('support.form.name')}
                        </label>
                        <Input placeholder="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          {t('support.form.email')}
                        </label>
                        <Input type="email" placeholder="john@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        {t('support.form.subject')}
                      </label>
                      <Input placeholder="Brief description of your issue" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        {t('support.form.category')}
                      </label>
                      <Select placeholder={t('support.form.categoryPlaceholder')}>
                        <option value="technical">{t('support.form.categories.technical')}</option>
                        <option value="gameplay">{t('support.form.categories.gameplay')}</option>
                        <option value="account">{t('support.form.categories.account')}</option>
                        <option value="bug">{t('support.form.categories.bug')}</option>
                        <option value="feature">{t('support.form.categories.feature')}</option>
                        <option value="other">{t('support.form.categories.other')}</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        {t('support.form.message')}
                      </label>
                      <Textarea 
                        rows={6}
                        placeholder={t('support.form.messagePlaceholder')}
                      />
                    </div>

                    <Button type="submit" variant="gaming" className="w-full">
                      {t('support.form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 bg-zh-primary/30">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('support.downloadTitle')}
                </h2>
                <p className="text-gray-400 text-lg">
                  {t('support.downloadSubtitle')}
                </p>
              </div>

              <Card className="zh-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Download className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Command & Conquer: Generals Zero Hour
                        </h3>
                        <p className="text-gray-400">
                          Latest Version v1.04 + Community Patches
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Official</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-zh-primary/30 rounded-lg">
                      <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Size</div>
                      <div className="font-semibold text-white">{t('support.downloadSize')}</div>
                    </div>
                    <div className="text-center p-4 bg-zh-primary/30 rounded-lg">
                      <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Security</div>
                      <div className="font-semibold text-white">Verified</div>
                    </div>
                    <div className="text-center p-4 bg-zh-primary/30 rounded-lg">
                      <Settings className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Updates</div>
                      <div className="font-semibold text-white">Included</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button variant="gaming" size="lg" className="mb-4">
                      {t('support.downloadLatest')}
                    </Button>
                    <p className="text-sm text-gray-400">
                      {t('support.downloadNote')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('support.faq')}
                </h2>
                <p className="text-gray-400 text-lg">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-6">
                {t.raw('support.faqItems').map((item: any, index: number) => (
                  <Card key={index} className="zh-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-zh-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">Q</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.question}
                          </h3>
                          <p className="text-gray-400">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section className="py-16 bg-zh-primary/20">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('support.troubleshooting')}
                </h2>
                <p className="text-gray-400 text-lg">
                  Quick fixes for common issues
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {t.raw('support.troubleshootingItems').map((item: any, index: number) => (
                  <Card key={index} className="zh-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">
                            {item.problem}
                          </h4>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-400 text-sm">
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16">
          <div className="zh-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Other Ways to Get Help
                </h2>
                <p className="text-gray-400 text-lg">
                  Connect with our community and support team
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Join our Discord
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Real-time chat with community and staff
                    </p>
                    <Button variant="outline" size="sm">
                      Join Discord
                    </Button>
                  </CardContent>
                </Card>

                <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Community Forum
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Get help from experienced players
                    </p>
                    <Button variant="outline" size="sm">
                      Visit Forum
                    </Button>
                  </CardContent>
                </Card>

                <Card className="zh-card group hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-12 w-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Email Support
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Direct email for complex issues
                    </p>
                    <Button variant="outline" size="sm">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 