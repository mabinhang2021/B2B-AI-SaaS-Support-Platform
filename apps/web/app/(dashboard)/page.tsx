'use client';
import { redirect } from 'next/navigation';

export default function Page() {
  // 重定向到对话页面
  redirect('/conversations');
}
