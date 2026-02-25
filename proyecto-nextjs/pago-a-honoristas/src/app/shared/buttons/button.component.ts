import { Component, Input, output } from '@angular/core';

@Component({
    selector: 'app-button',
    standalone: true,
    template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit()"
      [class]="buttonClasses">
      <ng-content></ng-content>
    </button>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
    @Input() variant: 'default' | 'destructive' | 'outline' | 'ghost' = 'default';
    @Input() size: 'default' | 'sm' | 'lg' = 'default';
    @Input() type: 'button' | 'submit' = 'button';
    @Input() disabled = false;

    onClick = output<void>();

    get buttonClasses(): string {
        const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

        const variants = {
            default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
            ghost: 'hover:bg-gray-100 focus:ring-gray-500'
        };

        const sizes = {
            default: 'px-4 py-2 text-sm',
            sm: 'px-3 py-1.5 text-xs',
            lg: 'px-6 py-3 text-base'
        };

        return `${baseClasses} ${variants[this.variant]} ${sizes[this.size]}`;
    }
}