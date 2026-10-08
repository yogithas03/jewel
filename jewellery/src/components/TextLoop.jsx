import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

const buildPath = (shape, curviness, ribbonWidth, viewH) => {
  const cy = viewH ? viewH / 2 : CY;
  const c = Math.max(0, curviness);
  const room = Math.max(20, cy - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${cy} A ${r} ${r} 0 1 1 ${CX + r} ${cy} A ${r} ${r} 0 1 1 ${CX - r} ${cy} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${cy}`,
        `C ${CX + r * 0.55} ${cy - h} ${CX + r} ${cy - h} ${CX + r} ${cy}`,
        `C ${CX + r} ${cy + h} ${CX + r * 0.55} ${cy + h} ${CX} ${cy}`,
        `C ${CX - r * 0.55} ${cy - h} ${CX - r} ${cy - h} ${CX - r} ${cy}`,
        `C ${CX - r} ${cy + h} ${CX - r * 0.55} ${cy + h} ${CX} ${cy}`,
        'Z',
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${cy + rise / 2} Q ${CX} ${cy - rise * 1.5} ${VIEW_W - 120} ${cy + rise / 2}`;
    }
    case 'line':
      return `M -320 ${cy} L ${VIEW_W + 320} ${cy}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${cy} Q -160 ${cy - a} 0 ${cy} T 320 ${cy} T 640 ${cy} T 960 ${cy} T 1280 ${cy} T ${VIEW_W + 320} ${cy}`;
    }
  }
};

/**
 * High-performance DOM-based infinite horizontal marquee ticker.
 * Renders duplicated blocks side-by-side in flex layout with 50% translation.
 * Guarantees zero text overlap, perfect hardware acceleration, fluid responsiveness,
 * and gapless, seamless looping.
 */
const DomMarquee = ({
  unit,
  speed = 90,
  direction = 'forward',
  pauseOnHover = true,
  height = 40,
  textStyle = {},
  color = '#064E3B',
  className = '',
  style = {},
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  // 4 duplicates per set guarantees width spans wide desktop & 4K screens seamlessly
  const copies = useMemo(() => [0, 1, 2, 3], []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track) return undefined;

    const setupTween = () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }

      // Track contains 2 identical sets (Block A and Block B)
      const halfWidth = track.scrollWidth / 2;
      if (!halfWidth || halfWidth <= 0) return;

      const spd = speed > 0 ? speed : 90;
      const duration = halfWidth / spd;

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const isLtr =
        direction === 'right' ||
        direction === 'reverse' ||
        direction === 'ltr' ||
        direction === 'left-to-right';

      // Animate track by 50% so Block B smoothly takes the place of Block A
      const tween = gsap.fromTo(
        track,
        { xPercent: isLtr ? -50 : 0 },
        {
          xPercent: isLtr ? 0 : -50,
          duration,
          ease: 'none',
          repeat: -1,
        }
      );
      tweenRef.current = tween;
    };

    setupTween();

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(setupTween).catch(() => {});
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setupTween) : null;
    if (ro) ro.observe(track);

    const onEnter = () => {
      if (pauseOnHover && tweenRef.current) tweenRef.current.pause();
    };
    const onLeave = () => {
      if (pauseOnHover && tweenRef.current) tweenRef.current.resume();
    };

    if (pauseOnHover && container) {
      container.addEventListener('pointerenter', onEnter);
      container.addEventListener('pointerleave', onLeave);
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
      if (ro) ro.disconnect();
      if (pauseOnHover && container) {
        container.removeEventListener('pointerenter', onEnter);
        container.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [unit, speed, direction, pauseOnHover]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none flex items-center ${className}`.trim()}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    >
      <div
        ref={trackRef}
        className="flex shrink-0 items-center will-change-transform"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Set A */}
        <div
          className="flex shrink-0 items-center"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {copies.map((i) => (
            <span
              key={`a-${i}`}
              style={{
                ...textStyle,
                color,
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {unit}
            </span>
          ))}
        </div>

        {/* Set B (exact replica for seamless wrapping without gaps or overlap) */}
        <div
          className="flex shrink-0 items-center"
          aria-hidden="true"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {copies.map((i) => (
            <span
              key={`b-${i}`}
              style={{
                ...textStyle,
                color,
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {unit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Curved SVG text loop renderer for non-linear shapes (wave, circle, infinity, arch)
 */
const SvgTextLoop = ({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = '#ffffff',
  ribbon = true,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  pauseOnHover = true,
  className = '',
  style = {},
}) => {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const measureRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const [metrics, setMetrics] = useState({ length: 0, reps: 1 });
  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`;

  const d = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth, null),
    [path, shape, curviness, ribbonWidth]
  );

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing]
  );

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;
      const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;
      setMetrics((prev) =>
        prev.length === length && prev.reps === reps ? prev : { length, reps }
      );
    };

    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return undefined;

    const apply = (offset) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute('startOffset', String(offset));
      tail.setAttribute('startOffset', String(partner));
    };
    apply(0);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || speed <= 0) return undefined;

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => apply(state.offset),
    });

    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();
    if (pauseOnHover && root) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener('pointerenter', pause);
        root.removeEventListener('pointerleave', resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.reps);
  const fitLength = metrics.length || undefined;

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={style}
    >
      <svg
        className="block w-full h-auto"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : 'none'}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          ref={measureRef}
          className="invisible pointer-events-none"
          style={textStyle}
          aria-hidden="true"
        >
          {unit}
        </text>
        <text
          className="select-none"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={fitLength}
          lengthAdjust="spacing"
        >
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
        <text
          className="select-none"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={fitLength}
          lengthAdjust="spacing"
        >
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const TextLoop = (props) => {
  const {
    text = 'React ✦ Bits',
    shape = 'wave',
    speed = 90,
    direction = 'forward',
    separator = '✦',
    fontSize = 46,
    fontWeight = 800,
    letterSpacing = 2,
    uppercase = true,
    color = '#ffffff',
    pauseOnHover = true,
    compact = false,
    compactHeight = 48,
    className = '',
    style = {},
  } = props;

  // Use DOM-based marquee for horizontal linear strips to prevent text overlap
  if (compact || shape === 'line') {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    const unit = `${base}${gap}`;
    const textStyle = {
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`,
    };

    return (
      <DomMarquee
        unit={unit}
        speed={speed}
        direction={direction}
        pauseOnHover={pauseOnHover}
        height={compactHeight}
        textStyle={textStyle}
        color={color}
        className={className}
        style={style}
      />
    );
  }

  return <SvgTextLoop {...props} />;
};

export default TextLoop;
