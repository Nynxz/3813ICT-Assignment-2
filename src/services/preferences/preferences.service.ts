import { Injectable, signal, effect } from '@angular/core';

type Preferences = {
  sidebar_folded: boolean;
  jwt: string;
};

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  sidebar_folded = signal(this.getKey('sidebar_folded'));
  jwt = signal(this.getKey('jwt'));

  apiURL = 'http://localhost:3200/api/v1/';

  constructor() {
    effect(() => {
      console.log(this.sidebar_folded());
      this.setKey('sidebar_folded', this.sidebar_folded()!);
    });

    effect(() => {
      console.log(this.jwt());
      this.setKey('jwt', this.jwt()!);
    });
  }

  setKeys(keys: Partial<Preferences>): void {
    for (const [key, value] of Object.entries(keys) as [
      keyof Preferences,
      any,
    ][]) {
      if (value !== undefined) {
        localStorage.setItem(key, value.toString());
      }
    }
  }

  setKey<K extends keyof Preferences>(key: K, value: Preferences[K]): void {
    if (value) localStorage.setItem(key, value.toString());
  }

  getKeys(keys: Array<keyof Preferences>): Partial<Preferences> {
    const result: Partial<Preferences> = {};
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        result[key] = this.parseValue(value);
      }
    }
    return result;
  }

  getKey<K extends keyof Preferences>(key: K): Preferences[K] | null {
    const value = localStorage.getItem(key);
    if (value !== null) {
      return this.parseValue(value) as Preferences[K];
    }
    return null;
  }

  private parseValue(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}
