'use client';

import { ShareImageConfig } from '@/types';
import html2canvas from 'html2canvas';

export async function generateShareImage(config: ShareImageConfig): Promise<string> {
  const {
    role,
    progress,
    date,
    userName = '神秘体验者',
    theme = 'light'
  } = config;

  // 创建一个临时的DOM元素来渲染分享图
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: 800px;
    height: 1200px;
    padding: 40px;
    background: ${theme === 'light' ? '#f8fafc' : '#0f172a'};
    border-radius: 20px;
    font-family: Arial, sans-serif;
    color: ${theme === 'light' ? '#1e293b' : '#f1f5f9'};
  `;

  const completedCount = progress.completedTasks.filter(Boolean).length;
  const totalTasks = role.tasks.length;
  const progressPercent = (completedCount / totalTasks) * 100;

  tempDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">今日角色</h1>
      <div style="font-size: 64px; margin-bottom: 20px;">${role.emoji}</div>
      <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">${role.title}</h2>
    </div>

    <div style="margin: 40px 0;">
      <div style="height: 20px; background: ${theme === 'light' ? '#e2e8f0' : '#334155'}; border-radius: 10px; overflow: hidden;">
        <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 10px;"></div>
      </div>
      <p style="text-align: center; font-size: 24px; margin-top: 10px; color: ${theme === 'light' ? '#475569' : '#cbd5e1'}">
        完成度：${completedCount}/${totalTasks}
      </p>
    </div>

    <div style="text-align: center; margin-top: 60px; font-size: 20px; color: ${theme === 'light' ? '#64748b' : '#94a3b8'}">
      <p>${date} • ${userName}</p>
    </div>

    <div style="position: absolute; bottom: 40px; left: 0; right: 0; text-align: center; font-size: 18px; color: ${theme === 'light' ? '#94a3b8' : '#475569'}">
      来自「今日角色」应用
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });

    const imageUrl = canvas.toDataURL('image/png');
    document.body.removeChild(tempDiv);

    return imageUrl;
  } catch (error) {
    console.error('生成分享图失败:', error);
    document.body.removeChild(tempDiv);
    throw error;
  }
}

// 直接使用DOM元素生成图片
export async function generateShareImageWithCanvas(element: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('生成分享图失败:', error);
    throw error;
  }
}