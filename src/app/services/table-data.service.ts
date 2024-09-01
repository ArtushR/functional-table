import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import userData from './user-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private filterTerm: string = '';
  private pageIndex: number = 0;
  private pageSize: number = 5;

  constructor() {}

  loadData(): void {
    setTimeout(() => {
      this.updateData();
    }, Math.random() * 2000); //  random network delay
  }

  filterData(term: string): void {
    this.filterTerm = term;
    this.pageIndex = 0; // set to first page after filtering
    this.updateData();
  }

  changePage(pageIndex: number, pageSize: number): void {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.updateData();
  }

  private updateData(): void {
    let filteredData = userData;

    // apply filtering
    if (this.filterTerm) {
      filteredData = filteredData.filter(user =>
        Object.values(user).some(value =>
          String(value).toLowerCase().includes(this.filterTerm.toLowerCase())
        )
      );
    }

    //update total items after filtering
    this.totalItemsSubject.next(filteredData.length);

    // apply pagination
    const start = this.pageIndex * this.pageSize;
    const paginatedData = filteredData.slice(start, start + this.pageSize);

    this.dataSubject.next(paginatedData);
  }
}
