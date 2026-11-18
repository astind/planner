import type { CustomItem } from "./custom-items";

export interface CustomList {
  id: number;
  name: string;
  createdAt: Date;
  createdBy?: number;
  items?: CustomItem[];
}
