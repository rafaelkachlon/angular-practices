import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { GameService } from '../../game.service';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, NgStyle],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {

  public cells: Signal<Cell[]> = this.gameService.cells;
  public size: Signal<number> = this.gameService.size;
  public gameOver: Signal<boolean> = this.gameService.gameOver;

  public constructor(private readonly gameService: GameService) { }

  public onCellClicked(index?: number) {
    this.gameService.markCell(index);
  }

  public getStyles(): Record<string, string> {
    return {
      'grid-template-columns': `repeat(${this.size()},1fr)`,
      'grid-template-rows': `repeat(${this.size()},1fr)`
    };
  }

}
