import { browser } from '$app/environment';

export const ssr = false;

const minWidth = 1140;
const mobilePath = '/mobile';

export function load() {
    if (browser) {
      if (window.innerWidth < minWidth && window.location.pathname !== mobilePath) {
        window.location.href = mobilePath;
      }
    }
}