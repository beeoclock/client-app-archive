import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {inject, InjectionToken} from '@angular/core';

export const CLIENT_ID = new InjectionToken<BehaviorSubject<string>>(
  'CLIENT_ID',
);

export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory: () => {
        const {defaultView} = inject(DOCUMENT);

      if (!defaultView) {
        throw new Error('Window is not available');
      }

      return defaultView;
    },
  },
);

export const tokens = [
  {
    provide: CLIENT_ID, // New
    useValue: new BehaviorSubject(''),
  },
  {
    provide: WINDOW,
    useFactory: () => window,
  },
];
