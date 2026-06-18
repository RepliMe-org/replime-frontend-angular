import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { NavItem, SidebarConfig } from './sidebar-nav.model';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.css'],
})
export class SidebarComponent {
  @Input() config: SidebarConfig;

  collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  onItemClick(item: NavItem) {
    item.action?.();
  }
}