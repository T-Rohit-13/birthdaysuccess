import { prisma } from '@/lib/prisma';
import WelcomePageClient from './WelcomePageClient';

export const revalidate = 0;

export default async function WelcomePage() {
  const friendNameItem = await prisma.appContent.findUnique({
    where: { key: 'friend_name' },
  });

  const friendName = friendNameItem?.value || 'Beautiful';

  return <WelcomePageClient friendName={friendName} />;
}
