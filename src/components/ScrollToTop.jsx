import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation the way a full
// page load would — without this, clicking through to a new page from
// partway down the previous one lands you still scrolled to that same
// offset instead of the top of the new page. Most noticeable on mobile,
// where pages are taller relative to the viewport and scrolling is routine.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
