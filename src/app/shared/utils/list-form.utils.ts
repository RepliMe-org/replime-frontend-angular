import { InputListItem } from '../ui/dynamic-input-list/dynamic-input-list.model';

export interface ListFormState {
  newItems: InputListItem[];
  showAddForm: boolean;
  formError: string;
  saving: boolean;
  duplicateItemFlags: boolean[];
  existingItemFlags: boolean[];
  triggerListValidation: boolean;
  nextItemId: number;
}

export function getInitialListFormState(): ListFormState {
  return {
    newItems: [],
    showAddForm: false,
    formError: '',
    saving: false,
    duplicateItemFlags: [],
    existingItemFlags: [],
    triggerListValidation: false,
    nextItemId: 0,
  };
}

export function openListForm(state: ListFormState): void {
  state.newItems = [
    {
      localId: ++state.nextItemId,
      value: '',
    },
  ];
  state.duplicateItemFlags = [];
  state.existingItemFlags = [];
  state.formError = '';
  state.showAddForm = true;
}

export function discardListForm(state: ListFormState): void {
  state.showAddForm = false;
  state.newItems = [];
  state.duplicateItemFlags = [];
  state.existingItemFlags = [];
  state.formError = '';
  state.triggerListValidation = false;
}

export function isItemDuplicateInForm(items: InputListItem[], index: number): boolean {
  const value = items[index]?.value.toLowerCase().trim();
  if (!value) return false;
  return items.some(
    (item, i) => i !== index && item.value.toLowerCase().trim() === value,
  );
}

export function isItemAlreadySaved(items: InputListItem[], index: number, existingValues: string[]): boolean {
  const value = items[index]?.value.toLowerCase().trim();
  if (!value) return false;
  return existingValues.includes(value);
}
