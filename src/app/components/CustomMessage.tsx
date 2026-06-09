'use client';

import { useEffect, useRef } from 'react';
import styles from './frontend.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  birthdayMessage?: string;
  personalMessage?: string;
}

export default function CustomMessage({ birthdayMessage, personalMessage }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.anim-item');
    els.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} id="message" style={{ background: 'var(--color-bg-section)' }}>
      <h2 className={`${styles.sectionTitle} anim-item`}>
        <span className="text-gradient-purple">A Message From My Heart</span>
      </h2>
      <div className="section-divider" />

      <div
        className="anim-item glass"
        style={{
          maxWidth: '750px',
          width: '100%',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontFamily: 'var(--font-secondary)',
            lineHeight: 1.8,
            color: 'var(--color-text-light)',
          }}
        >
          {birthdayMessage || '[Admin: Set "birthday_message" in the dashboard]'}
        </p>
      </div>

      {personalMessage && (
        <div
          className="anim-item glass"
          style={{
            maxWidth: '750px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
            }}
          >
            {personalMessage}
          </p>
        </div>
      )}
    </section>
  );
}
