'use client';

import { useEffect, useRef } from 'react';
import styles from './frontend.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  photoUrl?: string | null;
}

export default function MemoryTimeline({ events }: { events: TimelineEvent[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current || !events.length) return;

    const items = timelineRef.current.querySelectorAll(`.${styles.timelineEvent}`);

    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, [events]);

  if (!events || events.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.timelineSection}`} id="timeline">
      <h2 className={styles.sectionTitle}>
        <span className="text-gradient">Our Journey Together</span>
      </h2>
      <div className="section-divider" />
      <p className={styles.sectionSubtitle}>Moments that became memories 💫</p>

      <div className={styles.timeline} ref={timelineRef}>
        <div className={styles.timelineLine} />

        {events.map((event) => (
          <div key={event.id} className={styles.timelineEvent}>
            <div className={styles.timelineDot} />
            <div className={`${styles.timelineContent} glass`}>
              <span className={styles.timelineDate}>{event.date}</span>
              <h3 className={styles.timelineTitle}>{event.title}</h3>
              <p className={styles.timelineDesc}>{event.description}</p>
              {event.photoUrl && (
                <img
                  src={event.photoUrl}
                  alt={event.title}
                  className={styles.timelinePhoto}
                  draggable={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
