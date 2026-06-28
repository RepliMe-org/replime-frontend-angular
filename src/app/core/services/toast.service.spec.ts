import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('success()', () => {
    it('should add a toast with type "success"', () => {
      service.success('Operation done');

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));

      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Operation done');
    });

    it('should auto-dismiss after 4000ms by default', () => {
      service.success('Done');

      jasmine.clock().tick(4001);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(0);
    });
  });

  describe('error()', () => {
    it('should add a toast with type "error"', () => {
      service.error('Something failed');

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));

      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].message).toBe('Something failed');
    });

    it('should auto-dismiss after 5000ms by default', () => {
      service.error('Failed');

      jasmine.clock().tick(4999);
      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(1);

      jasmine.clock().tick(2);
      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(0);
    });
  });

  describe('show()', () => {
    it('should append toast with an auto-incrementing id', () => {
      service.show('First', 'success', 4000);
      service.show('Second', 'error', 4000);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));

      expect(toasts.length).toBe(2);
      expect(toasts[0].id).toBe(1);
      expect(toasts[1].id).toBe(2);
    });

    it('should dismiss after given custom duration', () => {
      service.show('Hello', 'success', 2000);

      jasmine.clock().tick(2001);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(0);
    });
  });

  describe('dismiss()', () => {
    it('should remove only the toast with the matching id', () => {
      service.show('Toast A', 'success', 99999);
      service.show('Toast B', 'error', 99999);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));

      const idToRemove = toasts[0].id;
      service.dismiss(idToRemove);

      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe('Toast B');
    });

    it('should do nothing when dismissing a non-existent id', () => {
      service.show('Only toast', 'success', 99999);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(1);
    });

    it('should handle dismissing all toasts', () => {
      service.show('A', 'success', 99999);
      service.show('B', 'success', 99999);

      let toasts: Toast[] = [];
      service.toasts$.subscribe((t) => (toasts = t));

      const ids = toasts.map((t) => t.id);
      ids.forEach((id) => service.dismiss(id));

      service.toasts$.subscribe((t) => (toasts = t));
      expect(toasts.length).toBe(0);
    });
  });
});
