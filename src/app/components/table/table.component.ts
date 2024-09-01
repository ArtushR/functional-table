import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from "../../services/table-data.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['status', 'picture', 'user', 'email', 'address', 'company', 'tags', 'favoriteFruit'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  private totalItems: number = 0;
  private columnVisibility: { [key: string]: boolean } = {
    status: true,
    user: true,
    picture: true,
    email: true,
    address: true,
    company: true,
    tags: true,
    favoriteFruit: true,
  };

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.data$.subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort!;

    });

    this.dataService.totalItems$.subscribe(total => {
      this.totalItems = total;
      if (this.paginator) {
        this.paginator.length = total;
      }
    });

    this.dataService.loadData();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataService.filterData(filterValue);
  }

  pageChange(event: { pageIndex: number; pageSize: number; }): void {
    this.dataService.changePage(event.pageIndex, event.pageSize);
  }

  toggleColumnVisibility(column: string): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
    this.updateDisplayedColumns();
  }

  // Check if a column is visible
  isColumnVisible(column: string): boolean {
    return this.columnVisibility[column];
  }

  isAnyColumnHidden(): boolean {
    return Object.values(this.columnVisibility).some(visible => !visible);
  }

  showAllColumns(): void {
    Object.keys(this.columnVisibility).forEach(column => this.columnVisibility[column] = true);
    this.updateDisplayedColumns();
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = Object.keys(this.columnVisibility).filter(column => this.columnVisibility[column]);
  }
}
