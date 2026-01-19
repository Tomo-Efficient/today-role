import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '今日角色 - 每天体验一个新身份',
  description: '每天醒来，获得一个随机的新身份，用TA的视角体验生活一天。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.className}>
      <body className="antialiased">
        {children}
        <footer className="max-w-2xl mx-auto mt-12 mb-8 text-center">
          <p className="text-gray-500 text-sm">
            一个帮助你打破日常、体验生活的产品实验
            <br />
            <span className="text-xs text-gray-400 mt-1 inline-block">
              数据仅保存在本地浏览器 • 每日凌晨自动刷新
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}