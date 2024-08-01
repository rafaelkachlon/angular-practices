import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Cell } from './models/cell.model';
import { DefaultState, GameState } from './models/game-state.model';
import { User, Winner } from './models/types';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    public cells: Signal<Cell[]> = computed(() => this.gameState().cells);
    public totalWinsX: Signal<number> = computed(() => this.gameState().totalWinsX);
    public totalWinsO: Signal<number> = computed(() => this.gameState().totalWinsO);
    public totalDraws: Signal<number> = computed(() => this.gameState().totalDraws);
    public gameOver: Signal<boolean> = computed(() => this.gameState().gameOver);
    public winner: Signal<Winner> = computed(() => this.gameState().winner);
    public isXTurn: Signal<boolean> = computed(() => this.gameState().isXTurn);
    public size: Signal<number> = computed(() => this.gameState().size);
    public totalPlayedGames: Signal<number> = computed(() => {
        return this.totalWinsX() + this.totalDraws() + this.totalWinsO();
    });

    private winningCombinations: number[][] = [];
    private gameState: WritableSignal<GameState> = signal<GameState>(DefaultState);

    public calculateWinningCombinations(size: number): void {
        this.updateSize(size);
        this.winningCombinations = [
            ...this.comboRows(),
            ...this.comboColumns(),
            [...this.leftDiagonal()],
            [...this.rightDiagonal()]
        ];
        this.resetGame();
    }

    public checkForWinning(currentUser: User): void {
        const currentUserCells: number[] = this.cells().filter(c => c.user === currentUser).map(c => c.index);
        const hasWinner: boolean = this.winningCombinations.some((combination) => {
            return combination.every(idx => currentUserCells.includes(idx));
        });
        const noMoreCells: boolean = this.cells().every(c => c.user !== undefined);
        if (hasWinner || noMoreCells) {
            this.gameState.update(state => ({
                ...state,
                gameOver: true,
                winner: hasWinner ? currentUser : 'Draw'
            }));
            this.updateScores();
        }
    }

    public resetGame(): void {
        this.gameState.update(state => ({
            ...state,
            gameOver: false,
            cells: new Array(this.size() * this.size()).fill(null).map((_, i) => ({ index: i })),
            winner: undefined,
            isXTurn: !this.isXTurn()
        }));
    }

    public markCell(index: number | undefined): void {
        const currentUser: User = this.isXTurn() ? 'X' : 'O';
        this.gameState.update(state => ({
            ...state,
            cells: this.cells().map((c) => c.index === index ? { ...c, user: currentUser } : c),
            isXTurn: !this.isXTurn() // Toggle user turn

        }));
        this.checkForWinning(currentUser);
    }

    private updateSize(size: number): void {
        this.gameState.update((state) => ({ ...state, size }));
    }

    private updateScores(): void {
        if (!this.winner()) {
            return;
        }
        if (this.winner() === 'X') {
            this.gameState.update(state => ({ ...state, totalWinsX: this.totalWinsX() + 1 }));
        } else if (this.winner() === 'O') {
            this.gameState.update(state => ({ ...state, totalWinsO: this.totalWinsO() + 1 }));
        } else {
            this.gameState.update(state => ({ ...state, totalDraws: this.totalDraws() + 1 }));
        }
    }

    private comboRows(): number[][] {
        const result: number[][] = [];
        for (let i = 0; i < this.size(); i++) {
            const row: number[] = [];
            for (let j = 0; j < this.size(); j++) {
                row.push(i * this.size() + j);
            }
            result.push(row);
        }

        return result;
    }

    private comboColumns(): number[][] {
        const result: number[][] = [];
        for (let i = 0; i < this.size(); i++) {
            const column: number[] = [];
            for (let j = 0; j < this.size(); j++) {
                column.push(j * this.size() + i);
            }
            result.push(column);
        }
        return result;
    }

    private rightDiagonal(): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.size(); i++) {
            result.push(i * (this.size() + 1));
        }
        return result;
    }

    private leftDiagonal(): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.size(); i++) {
            result.push(i * this.size() + this.size() - i - 1);
        }
        return result;
    }
}

