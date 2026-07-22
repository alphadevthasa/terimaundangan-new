'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ListTemplatePage() {
  const router = useRouter();
  useEffect(() => { router.replace('/dashboard/kelola-template'); }, [router]);
  return null;
}
