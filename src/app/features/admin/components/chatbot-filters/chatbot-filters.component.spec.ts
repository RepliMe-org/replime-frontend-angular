import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChatbotFiltersComponent } from './chatbot-filters.component';

describe('ChatbotFiltersComponent', () => {
  let component: ChatbotFiltersComponent;
  let fixture: ComponentFixture<ChatbotFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatbotFiltersComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should have default input values', () => {
      expect(component.searchQuery).toBe('');
      expect(component.activeFilter).toBe('All');
    });

    it('should accept input values', () => {
      component.searchQuery = 'Angular';
      component.activeFilter = 'Training';

      fixture.detectChanges();

      expect(component.searchQuery).toBe('Angular');
      expect(component.activeFilter).toBe('Training');
    });
  });

  describe('setFilter', () => {
    it('should emit selected filter', () => {
      spyOn(component.filterChange, 'emit');

      component.setFilter('Active');

      expect(component.filterChange.emit).toHaveBeenCalledOnceWith('Active');
    });

    it('should emit every valid filter', () => {
      spyOn(component.filterChange, 'emit');

      const filters: Array<'All' | 'Active' | 'Training' | 'Failed'> = [
        'All',
        'Active',
        'Training',
        'Failed',
      ];

      filters.forEach((filter) => component.setFilter(filter));

      expect(component.filterChange.emit).toHaveBeenCalledTimes(filters.length);
      expect(component.filterChange.emit).toHaveBeenCalledWith('All');
      expect(component.filterChange.emit).toHaveBeenCalledWith('Active');
      expect(component.filterChange.emit).toHaveBeenCalledWith('Training');
      expect(component.filterChange.emit).toHaveBeenCalledWith('Failed');
    });
  });

  describe('Outputs', () => {
    it('should emit search change', () => {
      spyOn(component.searchChange, 'emit');

      component.searchChange.emit('chatbot');

      expect(component.searchChange.emit).toHaveBeenCalledOnceWith('chatbot');
    });
  });
});
