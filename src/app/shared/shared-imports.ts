import { NgIf, NgFor, NgClass } from '@angular/common';

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CardComponent } from './ui/card/card.component';
import { ButtonComponent } from './ui/button/button.component';
import { StepperComponent } from './ui/stepper/stepper.component';

export const SHARED_IMPORTS = [
  // Angular directives
  NgIf,
  NgFor,
  NgClass,

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
  StepperComponent
];
