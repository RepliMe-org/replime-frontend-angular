import { SidebarConfig } from './sidebar-nav.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserInfo } from '../../../core/models/auth.model';

export const ADMIN_SIDEBAR_CONFIG = (
  router: Router,
  authService: AuthService,
  userInfo: UserInfo,
): SidebarConfig => ({
  title: 'Admin',
  logoIcon: 'fa-solid fa-shield-halved',
  sections: [
    {
      items: [
        {
          label: 'Overview',
          icon: 'fa-solid fa-grid',
          route: '/admin/overview',
        },
        { label: 'Users', icon: 'fa-solid fa-users', route: '/admin/users' },
        {
          label: 'Chatbots',
          icon: 'fa-solid fa-robot',
          route: '/admin/chatbots',
        },
        {
          label: 'Categories',
          icon: 'fa-solid fa-folder-tree',
          route: '/admin/categories',
        },
        {
          label: 'Classifications',
          icon: 'fa-solid fa-tags',
          route: '/admin/classifications',
        },
        {
          label: 'Settings',
          icon: 'fa-solid fa-gear',
          route: '/admin/settings',
        },
      ],
    },
  ],
  user: {
    name: userInfo.username,
    role: userInfo.role,
    avatarInitials: 'A',
  },

  footerActions: [
    {
      icon: 'fa-solid fa-arrow-left',
      label: 'Back to App',
      action: () => router.navigate(['/']),
    },
    {
      icon: 'fa-solid fa-arrow-right-from-bracket',
      label: 'Logout',
      action: () => {
        router.navigate(['/']);
        authService.logout();
      },
    },
  ],
});

export const INFLUENCER_SIDEBAR_CONFIG = (
  router: Router,
  authService: AuthService,
  userInfo: UserInfo,
): SidebarConfig => ({
  title: 'Creator Dashboard',
  logoIcon: 'fa-solid fa-play',
  sections: [
    {
      label: 'Dashboard',
      items: [
        {
          label: 'Overview',
          icon: 'fa-solid fa-grid-2',
          route: '/dashboard/influencer/overview',
        },
        {
          label: 'Analytics',
          icon: 'fa-solid fa-chart-line',
          route: '/dashboard/influencer/analytics',
        },
        {
          label: 'Content',
          icon: 'fa-solid fa-video',
          route: '/dashboard/influencer/content',
        },
        {
          label: 'Conversations',
          icon: 'fa-solid fa-message',
          route: '/dashboard/influencer/conversations',
        },
      ],
    },
    {
      label: 'Management',
      items: [
        {
          label: 'Bot Settings',
          icon: 'fa-solid fa-robot',
          route: '/dashboard/influencer/bot-settings',
        },
        {
          label: 'Audience',
          icon: 'fa-solid fa-users',
          route: '/dashboard/influencer/audience',
        },
        {
          label: 'Automations',
          icon: 'fa-solid fa-rotate',
          route: '/dashboard/influencer/automations',
        },
        {
          label: 'Knowledge Base',
          icon: 'fa-solid fa-book',
          route: '/dashboard/influencer/knowledge-base',
        },
      ],
    },
    {
      label: 'Preferences',
      items: [
        {
          label: 'Settings',
          icon: 'fa-solid fa-gear',
          route: '/dashboard/influencer/settings',
        },
      ],
    },
  ],
  user: {
    name: userInfo.username,
    role: userInfo.role,
    avatarInitials:
      userInfo.username.charAt(0).toUpperCase() +
      userInfo.username.charAt(1).toUpperCase(),
  },
  footerActions: [
    {
      icon: 'fa-solid fa-arrow-left',
      label: 'Back to App',
      action: () => router.navigate(['/']),
    },
    {
      icon: 'fa-solid fa-arrow-right-from-bracket',
      label: 'Logout',
      action: () => {
        router.navigate(['/']);
        authService.logout();
      },
    },
  ],
});
