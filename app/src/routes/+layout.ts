import { browser } from '$app/environment';

export const prerender = false;
export const ssr = false;
export const trailingSlash = 'always';

const minWidth = 1140;
const mobilePath = '/mobile';

export function load() {
    if (browser) {
      if (window.innerWidth < minWidth && window.location.pathname !== mobilePath) {
        window.location.href = mobilePath;
      }
    }
}