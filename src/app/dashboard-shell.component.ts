import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from './icon.component';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly menuItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', href: '/' },
    { icon: 'task', label: 'Tasks', badge: '124', href: '/tasks' },
    { icon: 'calendar', label: 'Calendar', href: '/calendar' },
    { icon: 'analytics', label: 'Analytics', href: '/analytics' },
    { icon: 'users', label: 'Team', href: '/team' }
  ];

  readonly generalItems: NavItem[] = [
    { icon: 'settings', label: 'Settings', href: '/settings' },
    { icon: 'help', label: 'Help', href: '/help' },
    { icon: 'logout', label: 'Logout', href: '/logout' }
  ];

  readonly statsCards = [
    { title: 'Total Projects', value: '24', increase: 'Increased from last month', bg: 'bg-primary text-primary-foreground' },
    { title: 'Ended Projects', value: '10', increase: 'Increased from last month', bg: 'bg-card text-foreground' },
    { title: 'Running Projects', value: '12', increase: 'Increased from last month', bg: 'bg-card text-foreground' },
    { title: 'Pending Project', value: '2', increase: 'On Discuss', bg: 'bg-card text-foreground' }
  ];

  readonly tasks = [
    { id: 1, title: 'Design landing page mockup', project: 'Website Redesign', priority: 'High', dueDate: 'Nov 24, 2024', completed: false, tags: ['Design', 'UI/UX'] },
    { id: 2, title: 'Implement authentication flow', project: 'Mobile App', priority: 'High', dueDate: 'Nov 25, 2024', completed: false, tags: ['Backend', 'Security'] },
    { id: 3, title: 'Review pull requests', project: 'Github Project', priority: 'Medium', dueDate: 'Nov 23, 2024', completed: true, tags: ['Code Review'] },
    { id: 4, title: 'Update documentation', project: 'API Development', priority: 'Low', dueDate: 'Nov 26, 2024', completed: false, tags: ['Documentation'] }
  ];

  readonly teamMembers = ['Alexandra Deff', 'Edwin Adenike', 'Isaac Oluwatemilorun', 'David Oshodi'];
  readonly helpCategories = ['Documentation', 'Video Tutorials', 'Community Forum', 'Contact Support'];
  readonly daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  readonly monthData = [45, 52, 48, 61, 55, 67];

  readonly routePath = signal('/');
  readonly taskFilter = signal<'all' | 'active' | 'completed'>('all');
  readonly isMobileMenuOpen = signal(false);
  readonly elapsedSeconds = signal(24 * 3600 + 8);
  readonly isRunning = signal(true);

  readonly pageMap: Record<string, { title: string; description: string; cta?: string; secondary?: string; ctaOutline?: boolean }> = {
    '/': { title: 'Dashboard', description: 'Plan, prioritize, and accomplish your tasks with ease.', cta: '+ Add Project', secondary: 'Import Data' },
    '/tasks': { title: 'Tasks', description: 'Manage and organize your tasks efficiently.', cta: '+ Add Task' },
    '/calendar': { title: 'Calendar', description: 'Schedule and track your events and meetings.', cta: '+ Add Event' },
    '/analytics': { title: 'Analytics', description: 'Track your performance and productivity metrics.', cta: 'Export Report', ctaOutline: true },
    '/team': { title: 'Team', description: 'Manage your team members and their roles.', cta: '+ Add Member' },
    '/settings': { title: 'Settings', description: 'Manage your account preferences and application settings.' },
    '/help': { title: 'Help & Support', description: 'Get help with using Tasko and find answers to common questions.' },
    '/logout': { title: 'Logout', description: '' }
  };

  readonly pageInfo = computed(() => this.pageMap[this.routePath()] ?? this.pageMap['/']);

  readonly filteredTasks = computed(() => {
    if (this.taskFilter() === 'completed') {
      return this.tasks.filter((task) => task.completed);
    }
    if (this.taskFilter() === 'active') {
      return this.tasks.filter((task) => !task.completed);
    }
    return this.tasks;
  });

  readonly timerText = computed(() => {
    const total = this.elapsedSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const format = (value: number): string => String(value).padStart(2, '0');
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  });

  constructor(private readonly router: Router) {
    this.routePath.set(this.router.url.split('?')[0] || '/');
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.routePath.set(this.router.url.split('?')[0] || '/');
      this.isMobileMenuOpen.set(false);
    });

    setInterval(() => {
      if (this.isRunning()) {
        this.elapsedSeconds.update((value) => value + 1);
      }
    }, 1000);
  }

  setFilter(filterValue: 'all' | 'active' | 'completed'): void {
    this.taskFilter.set(filterValue);
  }

  toggleTimer(): void {
    this.isRunning.update((value) => !value);
  }

  resetTimer(): void {
    this.elapsedSeconds.set(0);
    this.isRunning.set(false);
  }
}
