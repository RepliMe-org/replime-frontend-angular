import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SimpleChange } from '@angular/core';

import { ChatSearchModalComponent } from './chat-search-modal.component';
import { ChatSearchService } from '../../services/chat-search.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MessageSearchResult } from '../../models/chat-search.model';

describe('ChatSearchModalComponent', () => {
  let component: ChatSearchModalComponent;
  let fixture: ComponentFixture<ChatSearchModalComponent>;
  let chatSearchServiceSpy: jasmine.SpyObj<ChatSearchService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const mockResults: MessageSearchResult[] = [
    {
      sessionId: 1,
      sessionTitle: 'Angular Chat',
      chatbotId: 'bot-1',
      messageId: 100,
      matchedMessage: 'Hello Angular',
      sender: 'USER',
      sentAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    chatSearchServiceSpy = jasmine.createSpyObj('ChatSearchService', [
      'search',
    ]);

    chatSearchServiceSpy.search.and.returnValue(
      of({
        query: '',
        matchCount: 0,
        data: [],
      }),
    );

    toastSpy = jasmine.createSpyObj('ToastService', ['error', 'success']);

    await TestBed.configureTestingModule({
      imports: [ChatSearchModalComponent],
      providers: [
        {
          provide: ChatSearchService,
          useValue: chatSearchServiceSpy,
        },
        {
          provide: ToastService,
          useValue: toastSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSearchModalComponent);
    component = fixture.componentInstance;
    component.chatbotId = 'bot-1';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onQueryChange()', () => {
    it('should update the query', () => {
      component.onQueryChange('hello');

      expect(component.query).toBe('hello');
    });
  });

  describe('search flow', () => {
    it('should search and populate results', fakeAsync(() => {
      chatSearchServiceSpy.search.and.returnValue(
        of({
          query: 'hello',
          matchCount: 1,
          data: mockResults,
        }),
      );

      component.onQueryChange('hello');

      tick(400);

      expect(chatSearchServiceSpy.search).toHaveBeenCalledWith(
        'bot-1',
        'hello',
      );
      expect(component.results).toEqual(mockResults);
      expect(component.matchCount).toBe(1);
      expect(component.hasSearched).toBeTrue();
      expect(component.isLoading).toBeFalse();
    }));

    it('should not search when query length is less than 4', fakeAsync(() => {
      component.onQueryChange('abc');

      tick(400);

      expect(chatSearchServiceSpy.search).not.toHaveBeenCalled();
      expect(component.results).toEqual([]);
      expect(component.matchCount).toBe(0);
      expect(component.hasSearched).toBeFalse();
      expect(component.isLoading).toBeFalse();
    }));

    it('should not search when chatbotId is missing', fakeAsync(() => {
      component.chatbotId = '';

      component.onQueryChange('hello');

      tick(400);

      expect(chatSearchServiceSpy.search).not.toHaveBeenCalled();
    }));

    it('should handle search errors', fakeAsync(() => {
      chatSearchServiceSpy.search.and.returnValue(
        throwError(() => ({
          error: {
            error: 'Something failed',
          },
        })),
      );

      component.onQueryChange('hello');

      tick(400);

      expect(component.results).toEqual([]);
      expect(component.matchCount).toBe(0);
      expect(component.hasSearched).toBeTrue();
      expect(component.isLoading).toBeFalse();

      expect(toastSpy.error).toHaveBeenCalledWith('Something failed');
    }));

    it('should show default error message when backend error is missing', fakeAsync(() => {
      chatSearchServiceSpy.search.and.returnValue(throwError(() => ({})));

      component.onQueryChange('hello');

      tick(400);

      expect(toastSpy.error).toHaveBeenCalledWith(
        'Search failed. Please try again.',
      );
    }));
  });

  describe('selectResult()', () => {
    it('should emit selected result', () => {
      spyOn(component.resultSelected, 'emit');

      component.selectResult(mockResults[0]);

      expect(component.resultSelected.emit).toHaveBeenCalledWith(
        mockResults[0],
      );
    });
  });

  describe('close()', () => {
    it('should emit close event', () => {
      spyOn(component.closeModal, 'emit');

      component.close();

      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('highlight()', () => {
    it('should highlight matching text', () => {
      component.query = 'Angular';

      const result = component.highlight('Hello Angular');

      expect(result).toBe('Hello <strong>Angular</strong>');
    });

    it('should be case insensitive', () => {
      component.query = 'angular';

      const result = component.highlight('Hello Angular');

      expect(result).toContain('<strong>Angular</strong>');
    });

    it('should return original text when query is empty', () => {
      component.query = '';

      expect(component.highlight('Hello')).toBe('Hello');
    });

    it('should escape regex characters', () => {
      component.query = '.';

      const result = component.highlight('Hello.');

      expect(result).toContain('<strong>.</strong>');
    });
  });

  describe('resetState()', () => {
    it('should reset component state', () => {
      component.query = 'hello';
      component.results = mockResults;
      component.matchCount = 10;
      component.isLoading = true;
      component.hasSearched = true;

      component.resetState();

      expect(component.query).toBe('');
      expect(component.results).toEqual([]);
      expect(component.matchCount).toBe(0);
      expect(component.isLoading).toBeFalse();
      expect(component.hasSearched).toBeFalse();
    });
  });

  describe('ngOnChanges()', () => {
    it('should reset state when modal closes', () => {
      const resetSpy = spyOn(component, 'resetState');

      component.show = false;

      component.ngOnChanges({
        show: new SimpleChange(true, false, false),
      });

      expect(resetSpy).toHaveBeenCalled();
    });

    it('should not reset state when modal opens', () => {
      const resetSpy = spyOn(component, 'resetState');

      component.show = true;

      component.ngOnChanges({
        show: new SimpleChange(false, true, false),
      });

      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  describe('getFormattedDate()', () => {
    it('should return a formatted date', () => {
      const result = component.getFormattedDate('2024-01-01T00:00:00Z');

      expect(result).toBeTruthy();
    });
  });
});
