import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './ui/card/card.component';
import { StepperComponent } from './ui/stepper/stepper.component';
import { ButtonComponent } from './ui/button/button.component';
import { ModalComponent } from './ui/modal/modal.component';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { StatCardComponent } from './ui/stat-card/stat-card.component';
import { ToastComponent } from './ui/toast/toast.component';
import { DashboardHeaderComponent } from './ui/dashboard-header/dashboard-header.component';
import { SearchInputComponent } from './ui/search-input/search-input.component';
import { DataGridComponent } from './ui/data-grid/data-grid.component';
import { FormCardComponent } from './ui/form-card/form-card.component';
import { DashboardPageComponent } from './ui/dashboard-page/dashboard-page.component';
import { StepPageComponent } from './ui/step-page/step-page.component';
import { SidebarComponent } from './components/sidebar-nav/sidebar-nav.component';
import { ChatbotStatusBadgeComponent } from './ui/chatbot-status-badge/chatbot-status-badge.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Router
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    // Forms
    ReactiveFormsModule,
    FormsModule,

    // UI
    CardComponent,
    ButtonComponent,
    StepperComponent,
    ModalComponent,
    EmptyStateComponent,
    StatCardComponent,
    ToastComponent,
    DashboardHeaderComponent,
    SearchInputComponent,
    DataGridComponent,
    FormCardComponent,
    DashboardPageComponent,
    StepPageComponent,
    SidebarComponent,
    ChatbotStatusBadgeComponent
  ],
  exports: [
    CommonModule,
    // Router
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    // Forms
    ReactiveFormsModule,
    FormsModule,

    // UI
    CardComponent,
    ButtonComponent,
    StepperComponent,
    ModalComponent,
    EmptyStateComponent,
    StatCardComponent,
    ToastComponent,
    DashboardHeaderComponent,
    SearchInputComponent,
    DataGridComponent,
    FormCardComponent,
    DashboardPageComponent,
    StepPageComponent,
    SidebarComponent,
    ChatbotStatusBadgeComponent
  ],
})
export class SharedModule {}
