'use client';

import { useState, useRef } from 'react';
import styles from './frontend.module.css';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function SurpriseBox({ message }: { message?: string }) {
  const [opened, setOpened] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);

    // Big confetti burst
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#ffb7b2', '#c9b1ff', '#9b5de5', '#ffd700', '#ff6b6b', '#ffffff'];

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });

    // Continuous side-streams
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);

    // Animate message in
    if (messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, scale: 0.6, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.4)',
          delay: 0.8,
        }
      );
    }
  };

  return (
    <section className={`${styles.section} ${styles.surpriseSection}`} id="surprise">
      <h2 className={styles.sectionTitle}>
        <span className="text-gradient">A Special Surprise</span>
      </h2>
      <div className="section-divider" />

      {!opened && (
        <div className={styles.giftBoxWrapper} onClick={handleOpen}>
          <div className={styles.giftBox}>
            <div className={styles.giftBoxBow} />
            <div className={styles.giftBoxLid}>
              <div className={styles.giftBoxRibbon} />
            </div>
            <div className={styles.giftBoxBody}>
              <div className={styles.giftBoxRibbon} />
            </div>
          </div>
          <p className={styles.giftLabel}>
            <span className={styles.giftLabelEmoji}>👆</span> Tap to unwrap
            your gift!
          </p>
        </div>
      )}

      <p
        ref={messageRef}
        className={styles.surpriseMessage}
        style={{ opacity: opened ? undefined : 0 }}
      >
        {message ||
          'May your life be filled with happiness, success, love, and unforgettable memories. Happy Birthday! 🎉'}
      </p>
    </section>
  );
}
