import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

export interface ArrayResultService<T> {
  load(filter: any): Observable<T[]>
}

export class ArrayDataSource<T> implements DataSource<T> {

  private dataSubject = new BehaviorSubject<T[]>([])
  public length$ = new BehaviorSubject<number>(0)
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: ArrayResultService<T>) { }

  connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
    return this.dataSubject.asObservable()
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  load(filter: any): void {
    this.loadingSubject.next(true)

    this.service.load(filter)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: result => {
          console.dir(result)
          this.dataSubject.next(result)
          this.length$.next(result.length)
        }
      })
  }

}
