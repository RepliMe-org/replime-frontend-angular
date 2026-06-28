import {
  ListFormState,
  getInitialListFormState,
  openListForm,
  discardListForm,
  isItemDuplicateInForm,
  isItemAlreadySaved,
} from './list-form.utils';
import { InputListItem } from '../ui/dynamic-input-list/dynamic-input-list.model';

describe('list-form.utils', () => {
  describe('getInitialListFormState()', () => {
    it('should return a state object with correct default values', () => {
      const state = getInitialListFormState();

      expect(state.newItems).toEqual([]);
      expect(state.showAddForm).toBeFalse();
      expect(state.formError).toBe('');
      expect(state.saving).toBeFalse();
      expect(state.duplicateItemFlags).toEqual([]);
      expect(state.existingItemFlags).toEqual([]);
      expect(state.triggerListValidation).toBeFalse();
      expect(state.nextItemId).toBe(0);
    });
  });

  describe('openListForm()', () => {
    it('should set showAddForm to true', () => {
      const state = getInitialListFormState();
      openListForm(state);
      expect(state.showAddForm).toBeTrue();
    });

    it('should add exactly one blank item with incremented localId', () => {
      const state = getInitialListFormState();
      openListForm(state);

      expect(state.newItems.length).toBe(1);
      expect(state.newItems[0].value).toBe('');
      expect(state.newItems[0].localId).toBe(1);
    });

    it('should increment nextItemId on each open', () => {
      const state = getInitialListFormState();
      openListForm(state);
      expect(state.nextItemId).toBe(1);

      openListForm(state);
      expect(state.nextItemId).toBe(2);
      expect(state.newItems[0].localId).toBe(2);
    });

    it('should reset duplicate and existing flags', () => {
      const state = getInitialListFormState();
      state.duplicateItemFlags = [true, false];
      state.existingItemFlags = [false, true];

      openListForm(state);

      expect(state.duplicateItemFlags).toEqual([]);
      expect(state.existingItemFlags).toEqual([]);
    });

    it('should clear any previous formError', () => {
      const state = getInitialListFormState();
      state.formError = 'Some previous error';

      openListForm(state);

      expect(state.formError).toBe('');
    });
  });

  describe('discardListForm()', () => {
    it('should set showAddForm to false', () => {
      const state = getInitialListFormState();
      state.showAddForm = true;

      discardListForm(state);

      expect(state.showAddForm).toBeFalse();
    });

    it('should clear newItems', () => {
      const state = getInitialListFormState();
      state.newItems = [{ localId: 1, value: 'test' }];

      discardListForm(state);

      expect(state.newItems).toEqual([]);
    });

    it('should reset all flags and errors', () => {
      const state = getInitialListFormState();
      state.duplicateItemFlags = [true];
      state.existingItemFlags = [true];
      state.formError = 'Error!';
      state.triggerListValidation = true;

      discardListForm(state);

      expect(state.duplicateItemFlags).toEqual([]);
      expect(state.existingItemFlags).toEqual([]);
      expect(state.formError).toBe('');
      expect(state.triggerListValidation).toBeFalse();
    });
  });

  describe('isItemDuplicateInForm()', () => {
    it('should return false for empty value', () => {
      const items: InputListItem[] = [
        { localId: 1, value: '' },
        { localId: 2, value: 'hello' },
      ];
      expect(isItemDuplicateInForm(items, 0)).toBeFalse();
    });

    it('should return true when another item has the same value (case-insensitive)', () => {
      const items: InputListItem[] = [
        { localId: 1, value: 'Hello' },
        { localId: 2, value: 'hello' },
      ];
      expect(isItemDuplicateInForm(items, 0)).toBeTrue();
      expect(isItemDuplicateInForm(items, 1)).toBeTrue();
    });

    it('should return false when all values are unique', () => {
      const items: InputListItem[] = [
        { localId: 1, value: 'Apple' },
        { localId: 2, value: 'Banana' },
        { localId: 3, value: 'Cherry' },
      ];
      expect(isItemDuplicateInForm(items, 0)).toBeFalse();
      expect(isItemDuplicateInForm(items, 1)).toBeFalse();
      expect(isItemDuplicateInForm(items, 2)).toBeFalse();
    });

    it('should ignore the item at the given index when checking duplicates', () => {
      const items: InputListItem[] = [{ localId: 1, value: 'Unique' }];
      expect(isItemDuplicateInForm(items, 0)).toBeFalse();
    });

    it('should trim values before comparing', () => {
      const items: InputListItem[] = [
        { localId: 1, value: '  Hello  ' },
        { localId: 2, value: 'Hello' },
      ];
      expect(isItemDuplicateInForm(items, 0)).toBeTrue();
    });
  });

  describe('isItemAlreadySaved()', () => {
    const existing = ['apple', 'banana', 'cherry'];

    it('should return false for empty value', () => {
      const items: InputListItem[] = [{ localId: 1, value: '' }];
      expect(isItemAlreadySaved(items, 0, existing)).toBeFalse();
    });

    it('should return true when value already exists in saved list', () => {
      const items: InputListItem[] = [{ localId: 1, value: 'apple' }];
      expect(isItemAlreadySaved(items, 0, existing)).toBeTrue();
    });

    it('should return false when value does not exist in saved list', () => {
      const items: InputListItem[] = [{ localId: 1, value: 'mango' }];
      expect(isItemAlreadySaved(items, 0, existing)).toBeFalse();
    });

    it('should be case-sensitive (no lowercasing of existingValues)', () => {
      const items: InputListItem[] = [{ localId: 1, value: 'Apple' }];
      expect(isItemAlreadySaved(items, 0, existing)).toBeTrue();
    });

    it('should return false when item at index is undefined', () => {
      const items: InputListItem[] = [];
      expect(isItemAlreadySaved(items, 5, existing)).toBeFalse();
    });
  });
});
