'use client';

import { useEffect, useRef } from 'react';
import styles from './frontend.module.css';
import gsap from 'gsap';

export default function LandingHero({ quote, friendName }: { quote?: string; friendName?: string }) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const symbols = ['❤️', '✨', '💖', '💫', '🌸'];

    const createParticle = () => {
      if (!containerRef.current) return;
      const el = document.createElement('span');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: -30px;
        font-size: ${Math.random() * 18 + 10}px;
        opacity: 0;
        z-index: 0;
        pointer-events: none;
      `;
      containerRef.current.appendChild(el);

      gsap.to(el, {
        y: -(window.innerHeight + 60),
        x: `+=${Math.random() * 100 - 50}`,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.4 + 0.15,
        duration: Math.random() * 6 + 6,
        ease: 'none',
        onComplete: () => el.remove(),
      });
    };

    const interval = setInterval(createParticle, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${styles.section} ${styles.hero}`} ref={containerRef}>
      <div className={styles.heroContent}>
        <div className={styles.heroEmoji}>🎉</div>

        <h1 className={styles.heroTitle}>
          <span className="text-gradient">
            Happy Birthday, {friendName || 'Beautiful'} ❤️
          </span>
        </h1>

        <p className={styles.heroQuote}>
          {quote || 'A special gift crafted with love, just for you.'}
        </p>

        <div className={styles.heroButton}>
          <button
            className="btn-primary"
            onClick={() => {
              const el = document.getElementById('message');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ✨ Explore Your Gift ✨
          </button>
        </div>
      </div>
    </section>
  );
}
