import { useEffect, useRef } from 'react';
import './CursorAnimation.css';

const CursorAnimation = () => {
  const dotRef   = useRef(null);
  const auraRef  = useRef(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const auraPos  = useRef({ x: 0, y: 0 });
  const raf      = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    // Smooth aura lag via rAF
    const animate = () => {
      auraPos.current.x += (mouse.current.x - auraPos.current.x) * 0.1;
      auraPos.current.y += (mouse.current.y - auraPos.current.y) * 0.1;
      if (auraRef.current) {
        auraRef.current.style.transform =
          `translate(${auraPos.current.x}px, ${auraPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    // Grow aura on interactive elements
    const onEnter = () => auraRef.current?.classList.add('hovered');
    const onLeave = () => auraRef.current?.classList.remove('hovered');

    const interactives = document.querySelectorAll(
      'button, a, input, select, [role="button"], .chip, .item-card, .nav-link'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={auraRef}  className="cursor-aura"  />
      <div ref={dotRef}   className="cursor-dot"   />
    </>
  );
};

export default CursorAnimation;
