'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './frontend.module.css';
import gsap from 'gsap';

interface GalleryItem {
  id: string;
  photoUrl: string;
  songUrl?: string | null;
  caption?: string | null;
}

export default function InteractiveGallery({ items, friendName }: { items: GalleryItem[], friendName?: string }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const heartsContainerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Generate twinkling stars
  useEffect(() => {
    if (!starsRef.current) return;
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
        animation: starTwinkle ${Math.random() * 3 + 1}s infinite ease-in-out;
        animation-delay: ${Math.random() * 3}s;
      `;
      starsRef.current.appendChild(star);
    }
  }, []);

  const spawnHearts = useCallback(() => {
    if (!heartsContainerRef.current) return;
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💜'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        if (!heartsContainerRef.current) return;
        const heart = document.createElement('span');
        heart.className = styles.floatingHeart;
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.bottom = '0';
        heart.style.fontSize = `${Math.random() * 18 + 14}px`;
        heartsContainerRef.current.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
      }, i * 150);
    }
  }, []);

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    if (audioRef.current) {
      const oldAudio = audioRef.current;
      gsap.to(oldAudio, {
        volume: 0,
        duration: 0.5,
        onComplete: () => {
          oldAudio.pause();
          oldAudio.currentTime = 0;
        },
      });
    }
    if (item.songUrl) {
      const newAudio = new Audio(item.songUrl);
      newAudio.volume = 0;
      newAudio.loop = true;
      newAudio.play().catch(() => { });
      gsap.to(newAudio, { volume: 0.7, duration: 2, ease: 'power2.inOut' });
      audioRef.current = newAudio;
      setIsPlaying(true);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
    } else {
      audioRef.current = null;
      setIsPlaying(false);
    }
    setTimeout(spawnHearts, 300);
  };

  const closeLightbox = () => {
    if (audioRef.current) {
      const a = audioRef.current;
      gsap.to(a, {
        volume: 0,
        duration: 1.2,
        onComplete: () => {
          a.pause();
          a.currentTime = 0;
          audioRef.current = null;
          setIsPlaying(false);
        },
      });
    }
    if (lightboxRef.current) {
      gsap.to(lightboxRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => setSelectedItem(null),
      });
    } else {
      setSelectedItem(null);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.gallerySection}`} id="gallery">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {friendName && (
        <div className={styles.birthdayHeader}>
          <div className={styles.birthdayStars} ref={starsRef} />
          <span className={styles.birthdayRose}>🌹</span>
          <span className={styles.birthdayTitle}>
            Happy Birthday, {friendName}!
          </span>
          <p className={styles.birthdaySubtitle}>✦ it's all yours ✦</p>
          <div className={styles.birthdayDivider}>
            <div className={styles.birthdayLine} />
            <span className={styles.birthdayDiamond}>♦</span>
            <div className={styles.birthdayLineRight} />
          </div>
        </div>
      )}

      <div className={styles.galleryGrid}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.galleryItem}
            onClick={() => openLightbox(item)}
          >
            <img
              src={item.photoUrl}
              alt={item.caption || 'Memory'}
              className={styles.galleryImage}
              draggable={false}
            />
            {item.songUrl && (
              <div className={styles.galleryOverlay}>
                <p className={styles.gallerySongIndicator}>Each pic has own music</p>
              </div>
            )}
            {item.songUrl && (
              <div className={styles.galleryMusicBadge}>🎶</div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <>
          <div className={styles.heartsContainer} ref={heartsContainerRef} />
          <div className={styles.lightbox} onClick={closeLightbox}>
            <button className={styles.closeBtn} onClick={closeLightbox}>✕</button>
            <div
              ref={lightboxRef}
              className={styles.lightboxInner}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.photoUrl}
                alt={selectedItem.caption || 'Memory'}
                className={styles.lightboxImage}
                draggable={false}
              />
              {selectedItem.caption && (
                <p className={styles.lightboxCaption}>{selectedItem.caption}</p>
              )}
              {selectedItem.songUrl && (
                <div className={styles.lightboxMusicControl}>
                  <button className={styles.musicToggleBtn} onClick={togglePlayPause}>
                    {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Playing...' : 'Play Song'}
                  </button>
                  <div className={styles.musicVisualizer}>
                    {isPlaying && (
                      <>
                        <span className={styles.musicBar} />
                        <span className={styles.musicBar} />
                        <span className={styles.musicBar} />
                        <span className={styles.musicBar} />
                        <span className={styles.musicBar} />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}