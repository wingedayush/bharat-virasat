import { useState, useEffect } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'explore' }
  | { name: 'state-detail'; stateId: string }
  | { name: 'craft-detail'; craftId: string }
  | { name: 'artisans' }
  | { name: 'artisan-detail'; artisanId: string }
  | { name: 'quiz' }
  | { name: 'journey' }
  | { name: 'compare' }
  | { name: 'reels' }
  | { name: 'identify' }
  | { name: 'ask-bharat' }
  | { name: 'near-me' }
  | { name: 'unesco' }
  | { name: 'login' };

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'login') return { name: 'login' };
  if (parts[0] === 'unesco') return { name: 'unesco' };
  if (parts[0] === 'explore' && parts.length === 1) return { name: 'explore' };
  if (parts[0] === 'explore' && parts[1] === 'state' && parts[2]) return { name: 'state-detail', stateId: parts[2] };
  if (parts[0] === 'craft' && parts[1]) return { name: 'craft-detail', craftId: parts[1] };
  if (parts[0] === 'artisans' && parts.length === 1) return { name: 'artisans' };
  if (parts[0] === 'artisans' && parts[1]) return { name: 'artisan-detail', artisanId: parts[1] };
  if (parts[0] === 'quiz') return { name: 'quiz' };
  if (parts[0] === 'journey') return { name: 'journey' };
  if (parts[0] === 'compare') return { name: 'compare' };
  if (parts[0] === 'reels') return { name: 'reels' };
  if (parts[0] === 'identify') return { name: 'identify' };
  if (parts[0] === 'ask-bharat') return { name: 'ask-bharat' };
  if (parts[0] === 'near-me') return { name: 'near-me' };
  return { name: 'home' };
}

export function navigate(route: string) {
  window.location.hash = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}
