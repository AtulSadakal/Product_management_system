
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularCRUD';

  displayedColumns: string[] = ['productName', 'category', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllProducts();
  }


  openDialog() {
    this.dialog.open(DialogComponent, {
    }).afterClosed().subscribe(val => {
      if (val == 'save') {
        this.getAllProducts()
      }
    })
  }

  getAllProducts() {
    this.api.getProduct(data).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error: () => {
          Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error While Fetching Data!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val == 'update') {
        this.getAllProducts()
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Product Deleted Successfully!!',
          showConfirmButton: false,
          timer: 1500
        })
        this.getAllProducts()
      }, error: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error While Deleting The Product!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}


function data(data: any) {
  throw new Error('Function not implemented.');
}

