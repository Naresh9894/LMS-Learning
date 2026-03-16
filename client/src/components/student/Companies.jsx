import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, theme } from '../../hooks/useAnimationVariants'

const logos = [
  { src: assets.microsoft_logo, alt: 'Microsoft' },
  { src: assets.walmart_logo,   alt: 'Walmart'   },
  { src: assets.accenture_logo, alt: 'Accenture' },
  { src: assets.adobe_logo,     alt: 'Adobe'     },
  { src: assets.paypal_logo,    alt: 'PayPal'    },
]

// Duplicate logos for seamless infinite loop
const track = [...logos, ...logos, ...logos]

const Companies = () => {
  const { ref, inView } = useScrollAnimation({ margin: '-60px' })
  const { item } = cinematic

  return (
    <div
      ref={ref}
      className="pt-5 pb-5 overflow-hidden"
    >
      {/*
        ── Injected keyframe animation ──────────────────────────────────────
        Pure CSS marquee — runs on GPU compositor, zero JS, zero lag
      */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee 22s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .logo-item {
          filter: grayscale(40%) brightness(2.8);
          opacity: 1;
          transition: filter 0.4s ease, opacity 0.4s ease, transform 0.3s ease;
        }
        .logo-item:hover {
          filter: grayscale(0%) brightness(1);
          opacity: 1;
          transform: scale(1.12);
        }
      `}</style>

      {/* Heading */}
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={item}
        className="text-center mb-10"
      >
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}
        >
          Trusted by learners from
        </p>
        {/* Gold line under heading */}
        <div
          className="w-12 h-px mx-auto"
          style={{ background: theme.gradients.gold }}
        />
      </motion.div>

      {/* Carousel wrapper — fade edges with gold tint */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        {/* Moving track */}
        <div className="flex marquee-track">
          {track.map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-10 md:px-16"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="logo-item h-7 md:h-9 w-auto object-contain cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Companies