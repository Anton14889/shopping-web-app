import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadService } from '../upload-service/upload.service';
import { FormBuilder, Validators } from '@angular/forms';

import { AsyncSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserData {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  edit: string;
  delete: string;
}

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})

export class AdminTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'image', 'name', 'description', 'price', 'edit', 'delete'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _uploadService: UploadService,
    private fb: FormBuilder
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource([
    ]);
  }

  modal = true;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this._uploadService.tableList();

    const o = interval(500)
      .subscribe(
        data => {
          if (this._uploadService.result) {
            o.unsubscribe();
            this.dataSource = new MatTableDataSource(
              this._uploadService.result
            );
            console.log(this._uploadService.result)
          }

        }
      )
  }


  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.pattern('^[0-9]+$'), Validators.required]],
    img: ['']
  })

  get name() { return this.addProductForm.get('name'); }
  get description() { return this.addProductForm.get('description'); }
  get price() { return this.addProductForm.get('price'); }
  get img() { return this.addProductForm.get('img'); }






  onEdit(e) {

    this.addProductForm.patchValue({ name: e.name })
    this.addProductForm.patchValue({ description: e.description })
    this.addProductForm.patchValue({ price: e.price })
    this.addProductForm.patchValue({ img: e.img })

    console.log(this.addProductForm.value)
    console.log(this.img)

    if (this.addProductForm.value.img != this.img) {
      alert('changed image')
    }








    this.modal = !this.modal;
    // this._uploadService.addItem(this.name.value, data);

  }



  onSubmit() {
    //нельзя добавить новый продукт с существующим именем
    if (this._uploadService.names[this.name.value]) {
      return alert('Name already exists')
    }
    let data = {
      name: this.name.value,
      id: this.dataSource.data.length,
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };

    this._uploadService.addItem(this.name.value, data);

  }


  upload(file) {
    this._uploadService.uploadImage(this.img.value, file.files[0]);
    this.addProductForm.reset();

    // setTimeout(() => {
    //   this._uploadService.tableList();

    // }, 500);
  }

  imgName() {
    const id = Math.random().toString(36).substring(2);
    this.addProductForm.patchValue({ img: id })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


