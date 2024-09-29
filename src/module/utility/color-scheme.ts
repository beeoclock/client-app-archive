import {ReplaySubject} from 'rxjs';

const _isDark$ = new ReplaySubject<boolean>(1);
let mediaQueryList: MediaQueryList | undefined;

const detectStyleMode = () => {
  if (mediaQueryList) {
    const isDark = mediaQueryList.matches;
    const html = document.querySelector('html');
    if (html) {
      if (isDark) {
        html.setAttribute('data-bs-theme', 'dark');
      } else {
        html.setAttribute('data-bs-theme', 'light');
      }
      _isDark$.next(isDark);
    }
  }
};

export const initMediaQueryList = () => {
  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  if (mediaQueryList) {
    mediaQueryList.addEventListener('change', () => {
      detectStyleMode();
    });
    detectStyleMode();
  }
};

export const isDark$ = _isDark$.asObservable();
