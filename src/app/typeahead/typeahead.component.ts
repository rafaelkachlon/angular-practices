import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Country } from './models/country.model';
@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './typeahead.component.html',
  styleUrl: './typeahead.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeaheadComponent {
  public resultsMaxCount: number = 10;
  public result: WritableSignal<string> = signal<string>('');
  public data: Signal<string[]> = this.initializeData();
  public results: WritableSignal<string[]> = signal([]);
  public focusedIndex: WritableSignal<number> = signal<number>(-1);

  constructor(private readonly http: HttpClient) { }

  public selectResult(result: string) {
    this.result.set(result);
    this.results.set([]);
  }

  public filterResults(input: string) {
    this.results.set(this.data().filter((item) => item.toLowerCase().includes(input.toLowerCase())).splice(0, this.resultsMaxCount));
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

  private initializeData(): Signal<string[]> {
    return toSignal(this.http.get<Country[]>('assets/countries/countries.json')
      .pipe(
        map((countries) => countries.map(c => c.name))
      ), { initialValue: [] });
  }
}
