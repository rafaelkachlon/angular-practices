import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { GameService } from '../../game.service';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameScoreComponent {

  public totalWinsX: Signal<number> = this.gameService.totalWinsX.asReadonly();
  public totalWinsO: Signal<number> = this.gameService.totalWinsO.asReadonly();
  public totalDraws: Signal<number> = this.gameService.totalDraws.asReadonly();

  public constructor(private readonly gameService: GameService) { }
}
