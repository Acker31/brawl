import { useState, useEffect } from 'react';
import { CHARACTERS, GRID_IMAGE_PATH } from '../data/characters';
import { sliceCharacterIcon } from './slicer';

let globalAvatarCache: Record<string, string> = {};
let isPreloading = false;
const listeners: Array<(cache: Record<string, string>) => void> = [];

let globalBustCache: Record<string, string> = {};
let isBustPreloading = false;
const bustListeners: Array<(cache: Record<string, string>) => void> = [];

export function useCharacterAvatars() {
  const [avatars, setAvatars] = useState<Record<string, string>>(globalAvatarCache);

  useEffect(() => {
    listeners.push(setAvatars);

    if (Object.keys(globalAvatarCache).length === 0 && !isPreloading) {
      isPreloading = true;
      Promise.all(
        CHARACTERS.map(async (char) => {
          try {
            const url = await sliceCharacterIcon(GRID_IMAGE_PATH, char.crop, {
              size: 384,
              isCircular: true,
              includeBorder: false,
            });
            return { id: char.id, url };
          } catch (e) {
            console.error('Failed to pre-slice', char.id, e);
            return { id: char.id, url: '' };
          }
        })
      ).then((results) => {
        const cache: Record<string, string> = {};
        results.forEach((r) => {
          if (r.url) cache[r.id] = r.url;
        });
        globalAvatarCache = cache;
        listeners.forEach((fn) => fn(cache));
      });
    }

    return () => {
      const idx = listeners.indexOf(setAvatars);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return avatars;
}

export function useBustPortraits() {
  const [busts, setBusts] = useState<Record<string, string>>(globalBustCache);

  useEffect(() => {
    bustListeners.push(setBusts);

    if (Object.keys(globalBustCache).length === 0 && !isBustPreloading) {
      isBustPreloading = true;
      Promise.all(
        CHARACTERS.map(async (char) => {
          try {
            const url = await sliceCharacterIcon(GRID_IMAGE_PATH, char.crop, {
              size: 400,
              isCircular: false,
              isBustPortrait: true,
              includeBorder: false,
            });
            return { id: char.id, url };
          } catch (e) {
            console.error('Failed to pre-slice bust', char.id, e);
            return { id: char.id, url: '' };
          }
        })
      ).then((results) => {
        const cache: Record<string, string> = {};
        results.forEach((r) => {
          if (r.url) cache[r.id] = r.url;
        });
        globalBustCache = cache;
        bustListeners.forEach((fn) => fn(cache));
      });
    }

    return () => {
      const idx = bustListeners.indexOf(setBusts);
      if (idx !== -1) bustListeners.splice(idx, 1);
    };
  }, []);

  return busts;
}
