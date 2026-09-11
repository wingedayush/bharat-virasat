import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId } from '@/lib/supabase';

export interface StateProgress {
  stateId: string;
  exploredItems: Record<string, number>;
  explorationPercentage: number;
}

export interface UserProgress {
  states: Record<string, StateProgress>;
  totalPoints: number;
  badges: string[];
  quizCorrectTotal: number;
  craftsViewed: string[];
  artisansViewed: string[];
}

const STORAGE_KEY = 'bharat_virasat_progress';
const LEGACY_STORAGE_KEY = 'digital_bharat_progress';

function loadLocalProgress(): UserProgress {
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return {
    states: {},
    totalPoints: 0,
    badges: [],
    quizCorrectTotal: 0,
    craftsViewed: [],
    artisansViewed: [],
  };
}

function saveLocalProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function checkBadgesForProgress(p: UserProgress): string[] {
  const statesExplored = Object.values(p.states).filter(s => s.explorationPercentage > 0).length;
  const craftsViewed = p.craftsViewed.length;
  const artisansViewed = p.artisansViewed.length;
  const quizPoints = p.totalPoints;
  const quizCorrect = p.quizCorrectTotal;

  const earned: string[] = [];
  if (statesExplored >= 3) earned.push('heritage-explorer');
  if (craftsViewed >= 5) earned.push('craft-master');
  if (quizPoints >= 100) earned.push('culture-expert');
  if (statesExplored >= 12) earned.push('state-explorer');
  if (artisansViewed >= 5) earned.push('artisan-friend');
  if (quizCorrect >= 20) earned.push('quiz-champion');
  return earned;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadLocalProgress);
  const deviceId = getDeviceId();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    async function loadFromSupabase() {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('device_id', deviceId);

      const { data: badgeData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('device_id', deviceId);

      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('device_id', deviceId);

      if (progressData || badgeData || quizData) {
        const states: Record<string, StateProgress> = {};
        (progressData || []).forEach((row: { state_id: string; explored_items: Record<string, number>; exploration_percentage: number }) => {
          states[row.state_id] = {
            stateId: row.state_id,
            exploredItems: row.explored_items || {},
            explorationPercentage: row.exploration_percentage || 0,
          };
        });

        const supabaseBadges = (badgeData || []).map((b: { badge_id: string }) => b.badge_id);
        const quizCorrectTotal = (quizData || []).reduce((sum: number, q: { correct_answers: number }) => sum + q.correct_answers, 0);
        const totalPoints = (quizData || []).reduce((sum: number, q: { score: number }) => sum + q.score, 0);

        setProgress((prev) => {
          const merged: UserProgress = {
            ...prev,
            states: { ...prev.states, ...states },
            badges: Array.from(new Set([...prev.badges, ...supabaseBadges])),
            quizCorrectTotal: Math.max(prev.quizCorrectTotal, quizCorrectTotal),
            totalPoints: Math.max(prev.totalPoints, totalPoints),
          };
          saveLocalProgress(merged);
          return merged;
        });
      }
    }
    loadFromSupabase();
  }, [deviceId]);

  const awardBadge = useCallback(async (badgeId: string) => {
    let alreadyHas = false;
    setProgress((prev) => {
      if (prev.badges.includes(badgeId)) {
        alreadyHas = true;
        return prev;
      }
      const updated: UserProgress = { ...prev, badges: [...prev.badges, badgeId] };
      saveLocalProgress(updated);
      return updated;
    });
    if (!alreadyHas) {
      await supabase.from('user_badges').upsert({
        device_id: deviceId,
        badge_id: badgeId,
      }, { onConflict: 'device_id,badge_id' });
    }
  }, [deviceId]);

  const checkAndAwardBadges = useCallback((p: UserProgress) => {
    const earned = checkBadgesForProgress(p);
    earned.forEach((id) => awardBadge(id));
  }, [awardBadge]);

  const recordCraftView = useCallback(async (stateId: string, craftId: string) => {
    let newProgress: UserProgress | null = null;
    setProgress((prev) => {
      const existing = prev.states[stateId] || { stateId, exploredItems: {}, explorationPercentage: 0 };
      const newCrafts = (existing.exploredItems.crafts || 0) + 1;
      const newState: StateProgress = {
        ...existing,
        exploredItems: { ...existing.exploredItems, crafts: newCrafts },
        explorationPercentage: Math.min(100, existing.explorationPercentage + 10),
      };
      const updated: UserProgress = {
        ...prev,
        states: { ...prev.states, [stateId]: newState },
        craftsViewed: Array.from(new Set([...prev.craftsViewed, craftId])),
      };
      saveLocalProgress(updated);
      newProgress = updated;
      return updated;
    });

    if (newProgress) {
      checkAndAwardBadges(newProgress);
    }

    const current = progressRef.current;
    const existingState = current.states[stateId];
    const newExploredItems = { ...(existingState?.exploredItems || {}), crafts: (existingState?.exploredItems.crafts || 0) + 1 };
    const newPercentage = Math.min(100, (existingState?.explorationPercentage || 0) + 10);

    await supabase
      .from('user_progress')
      .upsert({
        device_id: deviceId,
        state_id: stateId,
        explored_items: newExploredItems,
        exploration_percentage: newPercentage,
      }, { onConflict: 'device_id,state_id' });
  }, [deviceId, checkAndAwardBadges]);

  const recordArtisanView = useCallback(async (artisanId: string) => {
    let newProgress: UserProgress | null = null;
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        artisansViewed: Array.from(new Set([...prev.artisansViewed, artisanId])),
      };
      saveLocalProgress(updated);
      newProgress = updated;
      return updated;
    });

    if (newProgress) {
      checkAndAwardBadges(newProgress);
    }
  }, [checkAndAwardBadges]);

  const recordQuizResult = useCallback(async (score: number, correct: number, total: number, category: string) => {
    let newProgress: UserProgress | null = null;
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        totalPoints: prev.totalPoints + score,
        quizCorrectTotal: prev.quizCorrectTotal + correct,
      };
      saveLocalProgress(updated);
      newProgress = updated;
      return updated;
    });

    if (newProgress) {
      checkAndAwardBadges(newProgress);
    }

    await supabase.from('quiz_results').insert({
      device_id: deviceId,
      category,
      score,
      total_questions: total,
      correct_answers: correct,
    });
  }, [deviceId, checkAndAwardBadges]);

  return { progress, recordCraftView, recordArtisanView, recordQuizResult, awardBadge, checkBadges: checkAndAwardBadges };
}
