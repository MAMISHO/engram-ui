import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private api = inject(ApiService);

  private searchTerm$ = new Subject<string>();
  private results$ = new BehaviorSubject<any[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading$.next(true)),
      switchMap(term => {
        if (!term.trim()) {
          return new Observable<any[]>(observer => observer.next([]));
        }
        return this.api.searchSessions(term);
      }),
      tap(() => this.loading$.next(false))
    ).subscribe(results => {
      this.results$.next(results);
    });
  }

  search(term: string) {
    this.searchTerm$.next(term);
  }

  getResults() {
    return this.results$.asObservable();
  }

  isLoading() {
    return this.loading$.asObservable();
  }
}
