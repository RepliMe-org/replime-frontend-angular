export interface ClassificationsOutput {
  systemClassNames: string[];
  systemClassIds: number[]; // IDs for PUT
  customClassNames: string[]; // Names for POST
}
