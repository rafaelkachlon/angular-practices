import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from '@angular/core';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, Subject, switchMap } from 'rxjs';
import { Country } from './models/country.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    TypeaheadComponent
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent {
  public offlineData: Signal<string[]> = this.initializeData();
  public offlineResult: WritableSignal<string> = signal<string>('');
  public onlineData: WritableSignal<string[]> = signal<string[]>([]);
  public onlineResult: WritableSignal<string> = signal<string>('');
  public fetchResultSubject: Subject<string> = new Subject();

  public constructor(private readonly http: HttpClient) {
    this.subscribeFetchSubject();
  }

  public onValueChange(input: string) {
    this.fetchResultSubject.next(input);
  }

  private initializeData(): Signal<string[]> {
    return toSignal(this.http.get<Country[]>('assets/countries/countries.json')
      .pipe(
        map((countries) => countries.map(c => c.name))
      ), { initialValue: [] });
  }

  private subscribeFetchSubject(): void {
    this.fetchResultSubject
      .pipe(
        debounceTime(300),
        switchMap((input: string) => {
          return this.http.get<Country[]>('assets/countries/countries.json')
            .pipe(
              // Demo server filtering
              map((countries) => countries.map(c => c.name).filter((item) => item.toLowerCase().includes(input.toLowerCase())).splice(0, 10))
            );
        }),
        takeUntilDestroyed()
      ).subscribe((res) => {
        this.onlineData.set(res);
      });
  }
}
