import { Cell } from './cell.model';
import { Winner } from './types';

export interface GameState {
    cells: Cell[];
    size: number;
    totalWinsX: number;
    totalWinsO: number;
    totalDraws: number;
    gameOver: boolean;
    winner: Winner;
    isXTurn: boolean;
}

export const DefaultState: GameState = {
    cells: [],
    size: 3,
    gameOver: false,
    isXTurn: true,
    totalDraws: 0,
    totalWinsO: 0,
    totalWinsX: 0,
    winner: undefined
};