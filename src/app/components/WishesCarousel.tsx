'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './frontend.module.css';

interface Wish {
  id: string;
  message: string;
}

export default function WishesCarousel({ wishes }: { wishes: Wish[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goNext = useCallback(() => {
    if (!wishes.length) return;
    setCurrentIndex((prev) => (prev + 1) % wishes.length);
  }, [wishes]);

  const goPrev = useCallback(() => {
    if (!wishes.length) return;
    setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
  }, [wishes]);

  useEffect(() => {
    if (!isAutoPlaying || !wishes.length) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext, wishes]);

  if (!wishes || wishes.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.wishesSection}`} id="wishes">
      <h2 className={styles.sectionTitle}>
        <span className="text-gradient">Birthday Wishes</span>
      </h2>
      <div className="section-divider" />
      <p className={styles.sectionSubtitle}>Words from the heart 💌</p>

      <div className={styles.carouselContainer}>
        <div className={`${styles.wishCard} glass`}>
          <p className={styles.wishText}>{wishes[currentIndex]?.message}</p>
        </div>

        <div className={styles.carouselNav}>
          <button
            className={styles.carouselNavBtn}
            onClick={() => { setIsAutoPlaying(false); goPrev(); }}
            aria-label="Previous wish"
          >
            ‹
          </button>
          <button
            className={styles.carouselNavBtn}
            onClick={() => { setIsAutoPlaying(false); goNext(); }}
            aria-label="Next wish"
          >
            ›
          </button>
        </div>

        <div className={styles.carouselDots}>
          {wishes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setIsAutoPlaying(false); setCurrentIndex(idx); }}
              className={`${styles.carouselDot} ${
                idx === currentIndex
                  ? styles.carouselDotActive
                  : styles.carouselDotInactive
              }`}
              aria-label={`Go to wish ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
