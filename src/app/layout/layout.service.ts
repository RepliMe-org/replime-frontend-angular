import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly showSidebar = signal(true);

  setShowSidebar(show: boolean) {
    this.showSidebar.set(show);
  }
}
