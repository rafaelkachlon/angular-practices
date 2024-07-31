import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Cell, User } from './models/cell.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    public cells: WritableSignal<Cell[]> = signal<Cell[]>([]);
    public totalWinsX: WritableSignal<number> = signal<number>(0);
    public totalWinsO: WritableSignal<number> = signal<number>(0);
    public totalDraws: WritableSignal<number> = signal<number>(0);
    public gameOver: WritableSignal<boolean> = signal<boolean>(false);
    public winner: WritableSignal<User | undefined | 'Draw'> = signal<User | undefined | 'Draw'>(undefined);
    public isXTurn: WritableSignal<boolean> = signal<boolean>(true);
    public size: WritableSignal<number> = signal<number>(3);

    public totalPlayedGames: Signal<number> = computed(() => {
        return this.totalWinsX() + this.totalDraws() + this.totalWinsO();
    });

    private winningCombinations: number[][] = [];
    public calculateWinningCombinations(size: number): void {
        this.size.set(size);
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
            this.gameOver.set(true);
            this.winner.set(hasWinner ? currentUser : 'Draw');
            this.updateScores();
        }
    }

    public resetGame(): void {
        this.gameOver.set(false);
        this.cells.set(new Array(this.size() * this.size()).fill(null).map((_, i) => ({ index: i })));
        this.toggleUserTurn();
        this.winner.set(undefined);
    }

    public toggleUserTurn(): void {
        this.isXTurn.update(isXturn => !isXturn);
    }

    private updateScores(): void {
        if (!this.winner()) {
            return;
        }
        if (this.winner() === 'X') {
            this.totalWinsX.update((wins) => wins + 1);
        } else if (this.winner() === 'O') {
            this.totalWinsO.update(wins => wins + 1);
        } else {
            this.totalDraws.update(draws => draws + 1);
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