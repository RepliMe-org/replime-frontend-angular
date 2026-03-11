import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './ui/card/card.component';
import { StepperComponent } from './ui/stepper/stepper.component';
import { ButtonComponent } from './ui/button/button.component';

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
  ],
})
export class SharedModule {}
