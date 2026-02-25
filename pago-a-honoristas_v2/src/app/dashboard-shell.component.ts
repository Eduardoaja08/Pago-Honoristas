import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

interface PageInfo {
  title: string;
  description: string;
  cta?: string;
  secondary?: string;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  readonly menuItems: NavItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tasks', href: '/tasks', badge: '124' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Team', href: '/team' }
  ];

  readonly generalItems: NavItem[] = [
    { label: 'Settings', href: '/settings' },
    { label: 'Help', href: '/help' },
    { label: 'Logout', href: '/logout' }
  ];

  private readonly pageMap: Record<string, PageInfo> = {
    '/': {
      title: 'Dashboard',
      description: 'Plan, prioritize, and accomplish your tasks with ease.',
      cta: '+ Add Project',
      secondary: 'Import Data'
    },
    '/tasks': {
      title: 'Tasks',
      description: 'Manage and organize your tasks efficiently.',
      cta: '+ Add Task'
    },
    '/calendar': {
      title: 'Calendar',
      description: 'Schedule and track your events and meetings.',
      cta: '+ Add Event'
    },
    '/analytics': {
      title: 'Analytics',
      description: 'Track your performance and productivity metrics.',
      cta: 'Export Report'
    },
    '/team': {
      title: 'Team',
      description: 'Manage your team members and their roles.',
      cta: '+ Add Member'
    },
    '/settings': {
      title: 'Settings',
      description: 'Manage your account preferences and application settings.'
    },
    '/help': {
      title: 'Help & Support',
      description: 'Get help with using Tasko and find answers to common questions.'
    },
    '/logout': {
      title: 'Logout',
      description: 'Are you sure you want to logout?'
    }
  } as const;

  readonly tasks = [
    { title: 'Design system updates', priority: 'High', project: 'Tasko App', dueDate: 'Nov 20', tags: ['UI', 'Design'] },
    { title: 'Write sprint retrospective', priority: 'Medium', project: 'Operations', dueDate: 'Nov 22', tags: ['Planning'] },
    { title: 'Deploy release v2.3', priority: 'High', project: 'Platform', dueDate: 'Nov 23', tags: ['DevOps'] },
    { title: 'Update onboarding docs', priority: 'Low', project: 'Support', dueDate: 'Nov 25', tags: ['Docs'] }
  ];

  readonly events = [
    { title: 'Team Standup', time: '09:00 AM', duration: '30 min' },
    { title: 'Design Review', time: '11:00 AM', duration: '1 hour' },
    { title: 'Client Presentation', time: '02:00 PM', duration: '2 hours' },
    { title: 'Code Review Session', time: '04:30 PM', duration: '45 min' }
  ];

  readonly routePath = signal('/');

  readonly pageInfo = computed(() => this.pageMap[this.routePath() as keyof typeof this.pageMap] ?? this.pageMap['/']);

  constructor(private readonly router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url.split('?')[0] || '/';
      this.routePath.set(url);
    });
    this.routePath.set(this.router.url.split('?')[0] || '/');
  }

  get days(): number[] {
    return Array.from({ length: 30 }, (_, index) => index + 1);
  }

  isCurrent(path: string): boolean {
    return this.routePath() === path;
  }
}
