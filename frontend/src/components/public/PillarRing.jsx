import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const PillarRing = ({ sections, accentColor, onSectionClick, activeSectionId }) => {
  const [radius, setRadius] = useState(160);
  const [rotation, setRotation] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [velocity, setVelocity] = useState(0);
  const animationRef = useRef(null);
  const ringRef = useRef(null);

  const sectionCount = sections.length;
  const angleStep = sectionCount > 0 ? (360 / sectionCount) : 0;

  useEffect(() => {
    const animate = () => {
      if (Math.abs(velocity) > 0.01) {
        setRotation(prev => prev + velocity);
        setVelocity(prev => prev * 0.98);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [velocity]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setRadius(120);
      else if (w < 1024) setRadius(150);
      else setRadius(160);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, rotation });
    setVelocity(0);
  };

  const handleMouseMove = (e) => {
    if (!dragStart) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaRotation = deltaX * 0.5;
    setRotation(dragStart.rotation + deltaRotation);
  };

  const handleMouseUp = (e) => {
    if (!dragStart) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaTime = 1;
    setVelocity(deltaX * 0.1);
    setDragStart(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setRotation(prev => prev - angleStep);
    } else if (e.key === 'ArrowRight') {
      setRotation(prev => prev + angleStep);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragStart, angleStep]);

  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const frontIndex = sectionCount > 0 ? Math.round(normalizedRotation / angleStep) % sectionCount : 0;
  const frontSection = sections[frontIndex];

  return (
    <div className="relative" style={{ width: radius * 2 + 100, height: radius * 2 + 100 }}>
      <div
        ref={ringRef}
        className="relative w-full h-full"
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => handleMouseDown(e.touches[0])}
        role="region"
        aria-label="Interactive pillar ring"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {sections.map((section, index) => {
          const itemAngle = index * angleStep;
          const x = radius * Math.sin((itemAngle * Math.PI) / 180);
          const y = -radius * Math.cos((itemAngle * Math.PI) / 180);
          const isFront = index === frontIndex;
          const scale = isFront ? 1.15 : 1;
          const zIndex = isFront ? 10 : 5;
          const opacity = isFront ? 1 : 0.7;

          return (
            <button
              key={section.id}
              onClick={() => onSectionClick?.(section)}
              className="absolute flex flex-col items-center cursor-pointer transition-all duration-300"
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                zIndex,
                opacity,
                pointerEvents: 'auto',
              }}
              aria-label={section.title}
              aria-pressed={isFront}
            >
              <div
                className="rounded-2xl shadow-xl flex flex-col items-center p-4"
                style={{
                  backgroundColor: 'white',
                  borderTop: `4px solid ${section.accent_color || accentColor}`,
                  width: isFront ? 200 : 160,
                  minHeight: isFront ? 200 : 160,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white mb-3"
                  style={{ backgroundColor: section.accent_color || accentColor }}
                >
                  {section.icon || section.title?.charAt(0) || '?'}
                </div>
                <h3 className="font-headline font-semibold text-center text-sm leading-tight">
                  {section.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Center indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full border-2 border-dashed" style={{ borderColor: accentColor }} />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setRotation(prev => prev - angleStep)}
        className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Previous section"
      >
        <ChevronLeft className="w-6 h-6" style={{ color: accentColor }} />
      </button>
      <button
        onClick={() => setRotation(prev => prev + angleStep)}
        className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Next section"
      >
        <ChevronRight className="w-6 h-6" style={{ color: accentColor }} />
      </button>

      {/* Section detail panel */}
      {frontSection && (
        <div className="mt-8 max-w-2xl mx-auto animate-fade-in">
          <div
            className="rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8"
            style={{ backgroundColor: 'white', borderTop: `4px solid ${frontSection.accent_color || accentColor}` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: frontSection.accent_color || accentColor }}
                >
                  {frontSection.icon || frontSection.title?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{frontSection.title}</h3>
                  <p className="text-sm font-medium" style={{ color: frontSection.accent_color || accentColor }}>
                    {frontSection.slug}
                  </p>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-6">{frontSection.description}</p>
              <button
                onClick={() => onSectionClick?.(frontSection)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
                style={{ backgroundColor: frontSection.accent_color || accentColor }}
              >
                Explore <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillarRing;