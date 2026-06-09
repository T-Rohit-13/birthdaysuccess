'use client';

import { useEffect, useRef } from 'react';
import styles from './frontend.module.css';
import gsap from 'gsap';

interface AboutHerProps {
  contentMap: Record<string, string>;
}

const sections = [
  { key: 'about_personality',   icon: '🌟', title: 'Her Personality',         color: '#ffb7b2' },
  { key: 'about_achievements',  icon: '🏆', title: 'Her Achievements',        color: '#ffd700' },
  { key: 'about_funny',         icon: '😂', title: 'Funny Moments',           color: '#c9b1ff' },
  { key: 'about_special',       icon: '💜', title: 'Why She Is Special',      color: '#9b5de5' },
  { key: 'about_memories',      icon: '📸', title: 'Favorite Memories',       color: '#ffb7b2' },
  { key: 'about_quotes',        icon: '✍️', title: 'Special Quotes',          color: '#ffd700' },
  { key: 'about_thanks',        icon: '🙏', title: 'Things I Want To Thank Her For', color: '#c9b1ff' },
  { key: 'about_future',        icon: '🌈', title: 'Future Wishes For Her',   color: '#ff6b6b' },
];

export default function AboutHer({ contentMap }: AboutHerProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(`.${styles.aboutCard}`);
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.12,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  return (
    <section className={`${styles.section} ${styles.aboutSection}`} id="about">
      <h2 className={styles.sectionTitle}>
        <span className="text-gradient">About You</span>
      </h2>
      <div className="section-divider" />
      <p className={styles.sectionSubtitle}>Everything that makes you, you ✨</p>

      <div className={styles.aboutGrid} ref={gridRef}>
        {sections.map((sec) => (
          <div key={sec.key} className={`${styles.aboutCard} glass`}>
            <span className={styles.aboutCardIcon}>{sec.icon}</span>
            <h3 className={styles.aboutCardTitle} style={{ color: sec.color }}>
              {sec.title}
            </h3>
            <p className={styles.aboutCardText}>
              {contentMap[sec.key] || `[Admin: Set "${sec.key}" in the dashboard]`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
