import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { GameService } from '../../game.service';

@Component({
  selector: 'app-game-score',
  imports: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreComponent {

  public totalWinsX: Signal<number> = this.gameService.totalWinsX;
  public totalWinsO: Signal<number> = this.gameService.totalWinsO;
  public totalDraws: Signal<number> = this.gameService.totalDraws;

  public constructor(private readonly gameService: GameService) { }
}
