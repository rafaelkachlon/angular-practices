import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, WritableSignal } from '@angular/core';
import { GameService } from '../game.service';
import { Cell, User } from '../models/cell.model';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {

  public cells: WritableSignal<Cell[]> = this.gameService.cells;
  public size: Signal<number> = this.gameService.size.asReadonly();
  public gameOver: Signal<boolean> = this.gameService.gameOver.asReadonly();
  private isXTurn: Signal<boolean> = this.gameService.isXTurn.asReadonly();

  public constructor(private readonly gameService: GameService) { }

  public onCellClicked(index?: number) {
    const currentUser: User = this.isXTurn() ? 'X' : 'O';
    this.cells.update(cells => cells.map((c) => c.index === index ? { ...c, user: currentUser } : c));
    this.gameService.toggleUserTurn();
    this.gameService.checkForWinning(currentUser);
  }

  public getStyles(): Record<string, string> {
    return {
      'grid-template-columns': `repeat(${this.size()},1fr)`,
      'grid-template-rows': `repeat(${this.size()},1fr)`
    };
  }

}
