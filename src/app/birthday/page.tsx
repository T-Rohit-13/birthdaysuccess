import { prisma } from '@/lib/prisma';
import CustomMessage from '../components/CustomMessage';
import AboutHer from '../components/AboutHer';
import MemoryTimeline from '../components/MemoryTimeline';
import InteractiveGallery from '../components/InteractiveGallery';
import WishesCarousel from '../components/WishesCarousel';
import SurpriseBox from '../components/SurpriseBox';
import styles from '../components/frontend.module.css';

export const revalidate = 0;

export default async function BirthdayPage() {
  const [contentItems, galleryItems, timelineEvents, wishes] = await Promise.all([
    prisma.appContent.findMany(),
    prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }),
    prisma.wish.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const contentMap = contentItems.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main>
      <InteractiveGallery
        items={galleryItems}
        friendName={contentMap['friend_name']}
      />

      <CustomMessage
        birthdayMessage={contentMap['birthday_message']}
        personalMessage={contentMap['personal_message']}
      />

      <AboutHer contentMap={contentMap} />

      <MemoryTimeline events={timelineEvents} />

      <WishesCarousel wishes={wishes} />

      <SurpriseBox message={contentMap['surprise_message']} />

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Made with ❤️ for {contentMap['friend_name'] || 'you'}
        </p>
      </footer>
    </main>
  );
}

