export type User = 'O' | 'X';
export interface Cell {
  index: number;
  user?: User;
}