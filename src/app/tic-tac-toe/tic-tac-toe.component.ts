import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { GameScoreComponent } from './components/game-score/game-score.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameService } from './game.service';
import { Cell } from './models/cell.model';
import { BoardSizeSelectionComponent } from './components/board-size-selection/board-size-selection.component';
import { Winner } from './models/types';

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
export class TicTacToeComponent implements OnInit {
  public readonly title: string = 'Tic Tac Toe';

  public cells: Signal<Cell[]> = this.gameService.cells;
  public gameOver: Signal<boolean> = this.gameService.gameOver;
  public winner: Signal<Winner> = this.gameService.winner;
  public isXTurn: Signal<boolean> = this.gameService.isXTurn;
  public totalPlayedGames: Signal<number> = this.gameService.totalPlayedGames;

  public constructor(public readonly gameService: GameService) { }

  public ngOnInit(): void {
    this.gameService.calculateWinningCombinations(3);
    this.gameService.resetGame();
  }
}
