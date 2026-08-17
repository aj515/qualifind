import { useLayoutEffect, useRef, useState } from 'react';

// Hover/focus-triggered explanation bubble. Wraps whatever's passed as
// children — the tooltip itself is purely decorative/informational
// (pointer-events-none), so it never intercepts clicks meant for the wrapped
// element.
//
// Centers on the trigger by default, but the trigger isn't always centered
// in its own container — badges/buttons in the rightmost column of a table
// or a right-aligned card sit near the viewport edge, and a naively centered
// tooltip runs off-screen and gets clipped mid-sentence there. So after
// becoming visible, this measures itself and nudges back onto screen instead
// of just assuming center is safe.
//
// The correction is computed from the TRIGGER's rect and the bubble's own
// (transform-independent) width, not from the bubble's current on-screen
// rect — the bubble's rect already includes whatever shift was applied on a
// previous hover, so measuring it directly would treat an already-corrected
// position as the new baseline and could undo the correction on the next
// hover of the same trigger. Recomputing from the trigger's rect each time
// is idempotent regardless of hover history.
export default function Tooltip({ children, text, width = 'w-56' }) {
  const wrapperRef = useRef(null);
  const bubbleRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    if (!visible || !wrapperRef.current || !bubbleRef.current) return;
    const margin = 8;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const bubbleWidth = bubbleRef.current.getBoundingClientRect().width;
    const centerX = wrapperRect.left + wrapperRect.width / 2;
    const unshiftedLeft = centerX - bubbleWidth / 2;
    const unshiftedRight = centerX + bubbleWidth / 2;
    let next = 0;
    if (unshiftedRight > window.innerWidth - margin) next = window.innerWidth - margin - unshiftedRight;
    else if (unshiftedLeft < margin) next = margin - unshiftedLeft;
    setShift(next);
  }, [visible]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex group/tip"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {/* Fixed slate, not `bg-ink` — `--color-ink` flips to near-white in dark
          mode (it's the primary text-color token), which would render this as
          white text on a white bubble. Tooltips should look the same in both
          themes regardless. */}
      <span
        ref={bubbleRef}
        style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        className={`pointer-events-none absolute bottom-full left-1/2 mb-2 ${width} transition-all z-20 origin-bottom ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <span className="block bg-slate-800 text-white text-[11px] font-semibold leading-snug rounded-xl px-3 py-2 shadow-pop-sm">
          {text}
        </span>
        <span className="block w-2.5 h-2.5 bg-slate-800 rotate-45 mx-auto -mt-1.5" />
      </span>
    </span>
  );
}
