import { getAppContent, getGalleryItems, getTimelineEvents, getWishes } from './actions';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const [content, gallery, timeline, wishes] = await Promise.all([
    getAppContent(),
    getGalleryItems(),
    getTimelineEvents(),
    getWishes()
  ]);

  return (
    <AdminDashboard 
      initialContent={content} 
      initialGallery={gallery} 
      initialTimeline={timeline} 
      initialWishes={wishes} 
    />
  );
}
