import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';

import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ChatSearchService } from '../../services/chat-search.service';
import { MessageSearchResult } from '../../models/chat-search.model';
import { ToastService } from '../../../../core/services/toast.service';
import { formatDate } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-chat-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './chat-search-modal.component.html',
  styleUrl: './chat-search-modal.component.css',
})
export class ChatSearchModalComponent implements OnChanges {
  @Input() show = false;
  @Input() chatbotId: string;

  @Output() closeModal = new EventEmitter<void>();
  @Output() resultSelected = new EventEmitter<MessageSearchResult>();

  query = '';
  results: MessageSearchResult[] = [];
  matchCount = 0;
  isLoading = false;
  hasSearched = false;

  querySubject = new Subject<string>();

  constructor(
    private chatSearchService: ChatSearchService,
    private toast: ToastService,
  ) {
    this.querySubject
      .pipe(
        debounceTime(4000),
        distinctUntilChanged(),
        tap((q) => {
          if (q.trim().length < 4) {
            this.isLoading = false;
            this.hasSearched = false;
            this.results = [];
            this.matchCount = 0;
          }
        }),
        switchMap((q) => {
          if (q.trim().length < 4 || !this.chatbotId) {
            return of(null);
          }
          this.isLoading = true;
          return this.chatSearchService.search(this.chatbotId, q.trim()).pipe(
            catchError((err) => {
              this.isLoading = false;
              this.hasSearched = true;
              this.results = [];
              this.matchCount = 0;
              this.toast.error(err?.error?.error || 'Search failed. Please try again.');
              return of(null);
            }),
          );
        }),
      )
      .subscribe((res) => {
        if (!res) return;
        this.isLoading = false;
        this.hasSearched = true;
        this.results = res.data;
        this.matchCount = res.matchCount;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && !this.show) {
      this.resetState();
    }
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.querySubject.next(value);
  }

  selectResult(result: MessageSearchResult): void {
    this.resultSelected.emit(result);
  }

  close(): void {
    this.closeModal.emit();
  }

  highlight(text: string): string {
    const q = this.query.trim();
    if (!q) return text;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'ig');
    return text.replace(regex, '<strong>$1</strong>');
  }

  getFormattedDate(dateStr: string): string {
    return formatDate(dateStr);
  }

  resetState(): void {
    this.query = '';
    this.results = [];
    this.matchCount = 0;
    this.isLoading = false;
    this.hasSearched = false;
  }
}