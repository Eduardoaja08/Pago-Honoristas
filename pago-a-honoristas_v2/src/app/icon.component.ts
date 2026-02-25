import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="className"
      [innerHTML]="icons[name] || ''"
      aria-hidden="true"
    ></svg>
  `
})
export class IconComponent {
  @Input() name = '';
  @Input() size = 16;
  @Input() className = '';

  readonly icons: Record<string, string> = {
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
    task: '<path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5"></path><path d="m9 11 3 3L22 4"></path>',
    calendar: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
    analytics: '<path d="M3 3v18h18"></path><path d="M7 16V9"></path><path d="M12 16V7"></path><path d="M17 16v-4"></path>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-1.94 1.51l-.19.77a2 2 0 0 1-2.91 1.26l-.67-.39a2 2 0 0 0-2.53.31l-.31.31a2 2 0 0 0-.31 2.53l.39.67a2 2 0 0 1-1.26 2.91l-.77.19A2 2 0 0 0 2 11.78v.44a2 2 0 0 0 1.51 1.94l.77.19a2 2 0 0 1 1.26 2.91l-.39.67a2 2 0 0 0 .31 2.53l.31.31a2 2 0 0 0 2.53.31l.67-.39a2 2 0 0 1 2.91 1.26l.19.77A2 2 0 0 0 11.78 22h.44a2 2 0 0 0 1.94-1.51l.19-.77a2 2 0 0 1 2.91-1.26l.67.39a2 2 0 0 0 2.53-.31l.31-.31a2 2 0 0 0 .31-2.53l-.39-.67a2 2 0 0 1 1.26-2.91l.77-.19A2 2 0 0 0 22 12.22v-.44a2 2 0 0 0-1.51-1.94l-.77-.19a2 2 0 0 1-1.26-2.91l.39-.67a2 2 0 0 0-.31-2.53l-.31-.31a2 2 0 0 0-2.53-.31l-.67.39a2 2 0 0 1-2.91-1.26l-.19-.77A2 2 0 0 0 12.22 2z"></path><circle cx="12" cy="12" r="3"></circle>',
    help: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>',
    logout: '<path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"></path>',
    search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-10 6L2 7"></path>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .738-1.674C19.41 13.89 18 12.256 18 8A6 6 0 0 0 6 8c0 4.256-1.411 5.89-2.738 7.326"></path>',
    plus: '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
    video: '<path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2"></rect>',
    chevronLeft: '<path d="m15 18-6-6 6-6"></path>',
    chevronRight: '<path d="m9 18 6-6-6-6"></path>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>',
    tag: '<path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z"></path><path d="M7 7h.01"></path>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.77.68 2.59a2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.49-1.19a2 2 0 0 1 2.11-.45c.82.33 1.69.56 2.59.68A2 2 0 0 1 22 16.92z"></path>',
    more: '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
    trendUp: '<path d="m22 7-8.5 8.5-5-5L2 17"></path><path d="M16 7h6v6"></path>',
    upRight: '<path d="M7 17 17 7"></path><path d="M7 7h10v10"></path>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
    menu: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>',
    apple: '<path d="M16.7 12.8c0-3.1 2.5-4.6 2.6-4.7-1.4-2-3.6-2.3-4.4-2.4-1.9-.2-3.7 1.1-4.7 1.1-1 0-2.5-1.1-4.1-1.1-2.1 0-4 1.2-5 3.1-2.1 3.7-.5 9.1 1.5 12 1 1.4 2.2 2.9 3.8 2.8 1.5-.1 2.1-1 4-1s2.4 1 4 1c1.7 0 2.8-1.5 3.8-2.9 1.1-1.7 1.5-3.4 1.5-3.5-.1 0-2.9-1.1-2.9-4.4z"></path><path d="M14.4 3.3c.8-1 1.3-2.4 1.1-3.3-1.2.1-2.6.8-3.4 1.8-.7.8-1.3 2.2-1.1 3.4 1.3.1 2.6-.7 3.4-1.9z"></path>',
    play: '<path d="M8 5v14l11-7z"></path>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>',
    square: '<rect width="14" height="14" x="5" y="5" rx="2"></rect>'
  };
}
