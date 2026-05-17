import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-typing',
  standalone: true,
  template: `
    <div class="typing-indicator">
      <div class="typing-avatar">
        <img
          [src]="botAvatar"
          alt="Bot Avatar"
          class="w-full h-full object-cover rounded-full"
        />
      </div>
      <div class="typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .typing-indicator {
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .typing-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        flex-shrink: 0;
        background: rgba(33, 213, 237, 0.12);
        color: var(--cyan);
        border: 1px solid rgba(33, 213, 237, 0.25);
      }
      .typing-bubble {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 0.75rem 1rem;
        border-radius: 18px 18px 18px 4px;
        background: var(--subtle-bg);
        border: 1px solid var(--border-color);
      }
      .typing-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--subtle-text);
        animation: typing-bounce 1.2s infinite ease-in-out;
      }
      .typing-dot:nth-child(1) {
        animation-delay: 0s;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing-bounce {
        0%,
        60%,
        100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-6px);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ChatTypingComponent {
  @Input() avatarNumber: number = 1;

  get botAvatar(): string {
    return `/assets/avatars/${this.avatarNumber}.svg`;
  }
}
