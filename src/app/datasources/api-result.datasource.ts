import { BehaviorSubject, Observable, finalize } from "rxjs";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";

export interface ApiResult<T> {
  data: T[]
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
  sortColumn: string
  sortOrder: string
  filterColumn: string
  filterQuery: string
}

export interface ApiResultService<T> {
  load(filter: any): Observable<ApiResult<T>>
}

export class ApiResultDataSource<T> implements DataSource<T> {

  private dataSubject = new BehaviorSubject<T[]>([])
  public length$ = new BehaviorSubject<number>(0)
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(private service: ApiResultService<T>) { }

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
          this.dataSubject.next(result.data)
          this.length$.next(result.totalCount)
        },
        error: e => {
          console.dir(e)
        }
      })
  }

}
