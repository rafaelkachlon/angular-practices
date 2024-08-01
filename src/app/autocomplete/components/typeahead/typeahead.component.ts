import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, effect, input,
  InputSignal, model, ModelSignal, output, OutputEmitterRef, signal, WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './typeahead.component.html',
  styleUrl: './typeahead.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent {

  public data: InputSignal<string[]> = input<string[]>([]);
  public label: InputSignal<string> = input.required<string>();
  public maxResults: InputSignal<number> = input<number>(10);
  public result: ModelSignal<string> = model<string>('');
  public fetchFromServer: InputSignal<boolean> = input<boolean>(false);
  public results: WritableSignal<string[]> = signal([]);
  public focusedIndex: WritableSignal<number> = signal<number>(-1);

  public valueChange: OutputEmitterRef<string> = output<string>();

  public constructor() {
    effect(() => {
      if (this.fetchFromServer()) {
        this.results.set(this.data());
      }
    }, { allowSignalWrites: true });
  }

  public selectResult(result: string): void {
    this.result.set(result);
    this.results.set([]);
  }

  public filterResults(input: string): void {
    this.valueChange.emit(input);

    if (!this.fetchFromServer()) {
      const filteredResults = this.data()
        .filter((item) => item.toLowerCase().includes(input.toLowerCase()))
        .splice(0, this.maxResults());
      this.results.set(filteredResults);
    }
    this.focusedIndex.set(0);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const resultsArray: string[] = this.results();
    const length: number = resultsArray.length;

    if (event.key === 'ArrowDown') {
      this.focusedIndex.update(index => (index + 1) % length);
    } else if (event.key === 'ArrowUp') {
      this.focusedIndex.update(index => (index > 0 ? index - 1 : length - 1));
    } else if (event.key === 'Enter') {
      const focusedResult: string = resultsArray[this.focusedIndex()];
      if (focusedResult) {
        this.selectResult(focusedResult);
      }
    }
  }
}
