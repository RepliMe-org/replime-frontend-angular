import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() maxWidth = 'max-w-lg';

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay'))
      this.close();
  }
}
