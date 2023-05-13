import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightswitchService {
  private darkModeSubject = new BehaviorSubject(!!localStorage.getItem('lf_dark'));
  public darkMode$ = this.darkModeSubject.asObservable();
  // public darkMode = !!localStorage.getItem('lf_dark');

  constructor() { }

  public toggleDarkMode() {
    const isDark = document.getElementsByClassName('dark-mode');
    if (isDark.length) {
      document.getElementsByTagName('body')[0].classList.remove('dark-mode');
      localStorage.removeItem('lf_dark');
      this.darkModeSubject.next(false);
    } else {
      document.getElementsByTagName('body')[0].classList.add('dark-mode');
      localStorage.setItem('lf_dark', '1');
      this.darkModeSubject.next(true);
    }
  }
}
