export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface SidebarUser {
  name: string;
  role: string;
  avatarInitials: string;
}

export interface SidebarConfig {
  title: string;
  logoIcon: string;
  sections: NavSection[];
  user: SidebarUser;
  footerActions?: {
    icon: string;
    label: string;
    action: () => void;
  }[];
}
