'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './components/frontend.module.css';
import gsap from 'gsap';

interface WelcomePageClientProps {
  friendName: string;
}

export default function WelcomePageClient({ friendName }: WelcomePageClientProps) {
  const containerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const symbols = ['❤️', '✨', '💖', '⭐', '💫', '🌸', '💜', '🎂', '🎁'];

    const createParticle = () => {
      if (!containerRef.current) return;
      const el = document.createElement('span');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: -30px;
        font-size: ${Math.random() * 20 + 12}px;
        opacity: 0;
        z-index: 0;
        pointer-events: none;
      `;
      containerRef.current.appendChild(el);

      gsap.to(el, {
        y: -(window.innerHeight + 60),
        x: `+=${Math.random() * 120 - 60}`,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.2,
        duration: Math.random() * 6 + 6,
        ease: 'none',
        onComplete: () => el.remove(),
      });
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    // Animate out, then navigate
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => router.push('/birthday'),
      });
    } else {
      router.push('/birthday');
    }
  };

  return (
    <section className={`${styles.section} ${styles.hero}`} ref={containerRef}>
      <div className={styles.heroContent}>
        <div className={styles.heroEmoji}>🎂</div>

        <h1 className={styles.heroTitle}>
          <span className="text-gradient">
            Happy Birthday, {friendName} ❤️
          </span>
        </h1>

        <p className={styles.heroQuote}>
          A special gift crafted with love, just for you.
        </p>

        <div className={styles.heroButton}>
          <button className="btn-primary" onClick={handleOpen}>
            🎁 Open Your Gift 🎁
          </button>
        </div>
      </div>
    </section>
  );
}
