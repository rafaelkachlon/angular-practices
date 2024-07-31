import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from '@angular/core';
import { GameScoreComponent } from './game-score/game-score.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameService } from './game.service';
import { Cell, User } from './models/cell.model';
import { BoardSizeSelectionComponent } from './board-size-selection/board-size-selection.component';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgIf,
    GameScoreComponent,
    GameBoardComponent,
    BoardSizeSelectionComponent
  ],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicTacToeComponent {
  public readonly title: string = 'Tic Tac Toe';

  public cells: WritableSignal<Cell[]> = this.gameService.cells;
  public gameOver: WritableSignal<boolean> = this.gameService.gameOver;
  public winner: WritableSignal<User | undefined | 'Draw'> = this.gameService.winner;
  public isXTurn: WritableSignal<boolean> = this.gameService.isXTurn;
  public totalPlayedGames: Signal<number> = this.gameService.totalPlayedGames;

  public constructor(public readonly gameService: GameService) { }

  public ngOnInit(): void {
    this.gameService.calculateWinningCombinations(3);
    this.gameService.resetGame();
  }
}
