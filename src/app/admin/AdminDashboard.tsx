'use client';

import { useState } from 'react';
import styles from './admin.module.css';
import { useRouter } from 'next/navigation';
import {
  saveAppContent,
  addGalleryItem,
  deleteGalleryItem,
  addTimelineEvent,
  deleteTimelineEvent,
  addWish,
  deleteWish,
} from './actions';

const CONTENT_KEYS = [
  { key: 'friend_name', label: "Friend's Name", placeholder: 'e.g., Sarah' },
  { key: 'hero_quote', label: 'Hero Quote (Landing Page)', placeholder: 'The quote shown under the greeting' },
  { key: 'birthday_message', label: 'Main Birthday Message', placeholder: 'Your main birthday message' },
  { key: 'personal_message', label: 'Personal Message', placeholder: 'A deeper personal message' },
  { key: 'surprise_message', label: 'Surprise Gift Message', placeholder: 'Message revealed when the gift box is opened' },
  { key: 'about_personality', label: 'About: Her Personality', placeholder: 'Describe her personality' },
  { key: 'about_achievements', label: 'About: Her Achievements', placeholder: 'Her achievements' },
  { key: 'about_funny', label: 'About: Funny Moments', placeholder: 'Funny moments together' },
  { key: 'about_special', label: 'About: Why She Is Special', placeholder: 'Why she is special to you' },
  { key: 'about_memories', label: 'About: Favorite Memories', placeholder: 'Your favorite memories together' },
  { key: 'about_quotes', label: 'About: Special Quotes', placeholder: 'Special quotes written by you' },
  { key: 'about_thanks', label: 'About: Things To Thank Her For', placeholder: 'Things you want to thank her for' },
  { key: 'about_future', label: 'About: Future Wishes', placeholder: 'Your future wishes for her' },
];

export default function AdminDashboard({
  initialContent,
  initialGallery,
  initialTimeline,
  initialWishes,
}: any) {
  const router = useRouter();

  // Content form
  const [selectedKey, setSelectedKey] = useState(CONTENT_KEYS[0].key);
  const [contentValue, setContentValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({
    photoFile: null as File | null,
    songFile: null as File | null,
    caption: '',
  });

  // Timeline form
  const [timelineForm, setTimelineForm] = useState({
    date: '',
    title: '',
    description: '',
    photoFile: null as File | null,
  });

  // Wish form
  const [wishForm, setWishForm] = useState({ message: '' });

  const contentMap = (initialContent || []).reduce((acc: any, c: any) => {
    acc[c.key] = c.value;
    return acc;
  }, {} as Record<string, string>);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.url;
  };

  const handleSaveContent = async () => {
    if (!contentValue.trim()) return;
    setSaving(true);
    await saveAppContent(selectedKey, contentValue);
    setSaving(false);
    setContentValue('');
    router.refresh();
  };

  const selectedKeyMeta = CONTENT_KEYS.find((k) => k.key === selectedKey);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🎂 Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage your birthday gift content</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* ===== TEXT CONTENT ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📝 Text Content Manager</h2>
        <p className={styles.sectionDesc}>
          Select a content section below, type your custom text, and save.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.label}>Content Section:</label>
          <select
            className={styles.select}
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
              setContentValue(contentMap[e.target.value] || '');
            }}
          >
            {CONTENT_KEYS.map((k) => (
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {contentMap[selectedKey] && (
          <div className={styles.currentValue}>
            <strong>Current value:</strong>
            <p>{contentMap[selectedKey]}</p>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>New Value:</label>
          <textarea
            className={styles.textarea}
            placeholder={selectedKeyMeta?.placeholder || 'Enter value...'}
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
          />
        </div>

        <button className={styles.button} onClick={handleSaveContent} disabled={saving}>
          {saving ? 'Saving...' : 'Save Content'}
        </button>
      </section>

      {/* ===== GALLERY ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📸 Photo & Music Gallery</h2>
        <p className={styles.sectionDesc}>
          Upload a photo and optionally link a specific song to it.
        </p>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Photo:</label>
            <input
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, photoFile: e.target.files?.[0] || null })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Song (Optional):</label>
            <input
              type="file"
              accept="audio/*"
              className={styles.input}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, songFile: e.target.files?.[0] || null })
              }
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            placeholder="Caption (Optional)"
            value={galleryForm.caption}
            onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
          />
        </div>
        <button
          className={styles.button}
          onClick={async () => {
            if (!galleryForm.photoFile) return alert('Photo required');
            const photoUrl = await uploadFile(galleryForm.photoFile);
            let songUrl = '';
            if (galleryForm.songFile) songUrl = await uploadFile(galleryForm.songFile);
            await addGalleryItem(photoUrl, songUrl, galleryForm.caption);
            setGalleryForm({ photoFile: null, songFile: null, caption: '' });
            router.refresh();
          }}
        >
          Add to Gallery
        </button>

        {initialGallery?.length > 0 && (
          <>
            <h3 className={styles.listTitle}>Gallery Items ({initialGallery.length})</h3>
            <div className={styles.grid}>
              {initialGallery.map((g: any) => (
                <div key={g.id} className={styles.card}>
                  <img src={g.photoUrl} alt="Gallery" className={styles.cardImage} />
                  <p className={styles.cardCaption}>{g.caption || 'No caption'}</p>
                  {g.songUrl && <p className={styles.songBadge}>🎵 Song Linked</p>}
                  <button className={styles.deleteBtn} onClick={() => { deleteGalleryItem(g.id); router.refresh(); }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ===== TIMELINE ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 Memory Timeline</h2>
        <p className={styles.sectionDesc}>Add memorable moments to the timeline.</p>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date:</label>
            <input
              className={styles.input}
              placeholder="e.g., Aug 2023"
              value={timelineForm.date}
              onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title:</label>
            <input
              className={styles.input}
              placeholder="Event title"
              value={timelineForm.title}
              onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description:</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe this memory..."
            value={timelineForm.description}
            onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Photo (Optional):</label>
          <input
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={(e) =>
              setTimelineForm({ ...timelineForm, photoFile: e.target.files?.[0] || null })
            }
          />
        </div>
        <button
          className={styles.button}
          onClick={async () => {
            if (!timelineForm.date || !timelineForm.title) return alert('Date and title are required');
            let photoUrl = '';
            if (timelineForm.photoFile) photoUrl = await uploadFile(timelineForm.photoFile);
            await addTimelineEvent(timelineForm.date, timelineForm.title, timelineForm.description, photoUrl);
            setTimelineForm({ date: '', title: '', description: '', photoFile: null });
            router.refresh();
          }}
        >
          Add Timeline Event
        </button>

        {initialTimeline?.length > 0 && (
          <>
            <h3 className={styles.listTitle}>Timeline Events ({initialTimeline.length})</h3>
            <div className={styles.grid}>
              {initialTimeline.map((t: any) => (
                <div key={t.id} className={styles.card}>
                  <strong style={{ color: 'var(--color-gold)' }}>{t.date}</strong>
                  <p style={{ fontWeight: 600 }}>{t.title}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {t.description?.substring(0, 80)}...
                  </p>
                  <button className={styles.deleteBtn} onClick={() => { deleteTimelineEvent(t.id); router.refresh(); }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ===== WISHES ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>💌 Birthday Wishes Carousel</h2>
        <p className={styles.sectionDesc}>Add rotating birthday wishes.</p>

        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            placeholder="Write a birthday wish..."
            value={wishForm.message}
            onChange={(e) => setWishForm({ message: e.target.value })}
          />
        </div>
        <button
          className={styles.button}
          onClick={async () => {
            if (!wishForm.message.trim()) return;
            await addWish(wishForm.message);
            setWishForm({ message: '' });
            router.refresh();
          }}
        >
          Add Wish
        </button>

        {initialWishes?.length > 0 && (
          <>
            <h3 className={styles.listTitle}>Wishes ({initialWishes.length})</h3>
            <div className={styles.grid}>
              {initialWishes.map((w: any) => (
                <div key={w.id} className={styles.card}>
                  <p style={{ fontStyle: 'italic' }}>"{w.message}"</p>
                  <button className={styles.deleteBtn} onClick={() => { deleteWish(w.id); router.refresh(); }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
