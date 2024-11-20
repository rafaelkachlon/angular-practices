import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameService } from '../../game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-size-selection',
  imports: [FormsModule],
  templateUrl: './board-size-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardSizeSelectionComponent {
  private gameService: GameService = inject(GameService);
  public selectedSize = this.gameService.size;

  public changeSize(size: string): void {
    this.gameService.calculateWinningCombinations(Number(size));
  }
}
