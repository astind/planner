export interface Item {
  text: string;
  id: number;
  complete: boolean;
  ownerId?: number;
  day: string;
  sortOrder: number;
}
