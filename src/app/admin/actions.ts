'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

// Helper to check auth in server actions
async function checkAuth() {
  const session = (await cookies()).get('session')?.value;
  if (!session) throw new Error('Unauthorized');
  try {
    const parsed = await decrypt(session);
    if (!parsed.admin) throw new Error('Unauthorized');
  } catch {
    throw new Error('Unauthorized');
  }
}

export async function saveAppContent(key: string, value: string) {
  await checkAuth();
  await prisma.appContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath('/');
}

export async function getAppContent() {
  return await prisma.appContent.findMany();
}

export async function addGalleryItem(photoUrl: string, songUrl?: string, caption?: string) {
  await checkAuth();
  await prisma.galleryItem.create({
    data: { photoUrl, songUrl, caption },
  });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteGalleryItem(id: string) {
  await checkAuth();
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function getGalleryItems() {
  return await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function addTimelineEvent(date: string, title: string, description: string, photoUrl?: string) {
  await checkAuth();
  await prisma.timelineEvent.create({
    data: { date, title, description, photoUrl },
  });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteTimelineEvent(id: string) {
  await checkAuth();
  await prisma.timelineEvent.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function getTimelineEvents() {
  return await prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } });
}

export async function addWish(message: string) {
  await checkAuth();
  await prisma.wish.create({
    data: { message },
  });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteWish(id: string) {
  await checkAuth();
  await prisma.wish.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function getWishes() {
  return await prisma.wish.findMany({ orderBy: { createdAt: 'desc' } });
}
