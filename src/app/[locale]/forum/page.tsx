'use client';

import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import ForumClient from './ForumClient';

export default function ForumPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <MainLayout>
      <ForumClient locale={locale} />
    </MainLayout>
  );
} 