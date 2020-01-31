import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadService } from '../upload-service/upload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { interval, BehaviorSubject, AsyncSubject, EMPTY, timer } from 'rxjs';
import { tap, map, takeLast, catchError, retry, retryWhen, delayWhen } from 'rxjs/operators';


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
  @ViewChild('file', { static: false }) file: ElementRef;

  constructor(private _uploadService: UploadService,
    private fb: FormBuilder
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource([
    ]);
  }

  private id = -1;
  private names = {};
  private editObj;

  modal = true;
  editButton = false;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.allList();
    // this._uploadService.ff()
  }

  allList() {
    let result = [];
    let objData = {};

    this._uploadService.tableList()
      .subscribe(
        data => {
          data.forEach(doc => {
            if (this.id < doc.data()['id']) {
              this.id = doc.data()['id']
            }
            this.uniqueNames(doc.data()['name']);

            this._uploadService.downloadImage(doc.data()['img'])
              .subscribe(
                imgURL => {
                  objData = doc.data();
                  objData['imgURL'] = imgURL;
                  result.push(objData)
                  this.dataSource = new MatTableDataSource(result);
                },
                error => {
                  console.warn(error);

                  objData = doc.data();
                  result.push(objData)
                  this.dataSource = new MatTableDataSource(result);

                }
              )
          })

        }, e => console.warn("tableList error")
      );

  }


  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.pattern('^[0-9]+$'), Validators.required]],
    img: ['']
  })

  i;

  get name() { return this.addProductForm.get('name'); }
  get description() { return this.addProductForm.get('description'); }
  get price() { return this.addProductForm.get('price'); }
  get img() { return this.addProductForm.get('img'); }

  edit(e) {
    this.editButton = true;
    this.editObj = e;
    this.modal = !this.modal;

    this.addProductForm.patchValue({ id: e.id })
    this.addProductForm.patchValue({ name: e.name })
    this.addProductForm.patchValue({ description: e.description })
    this.addProductForm.patchValue({ price: e.price })
    this.addProductForm.patchValue({ img: e.img })
    console.log(e)
  }
  trackByFn(index, item) {
  
    return index;  
  }
  onSubmit() {
    //нельзя добавить новый продукт с существующим именем
    if (this.names[this.name.value]) {
      return alert('Name already exists')
    }
    let data = {
      name: this.name.value,
      id: +this.id + 1,
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };

    this._uploadService.addItem(this.name.value, data);
    this.upload(this.file.nativeElement.files[0]);
    this.allList();
  }

  onEdit() {
    this.editButton = false;
    this.modal = !this.modal;

    let data = {
      name: this.name.value,
      id: this.editObj.id,
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };
    //если новое имя и новая картинка
    if (this.addProductForm.value.img != this.editObj.img && this.addProductForm.value.name != this.editObj.name) {
      this._uploadService.deleteIMG(this.editObj.img);
      this._uploadService.deleteItem(this.editObj.name);
      this._uploadService.addItem(this.name.value, data);
      this.upload(this.file.nativeElement.files[0]);
      return this.allList();
    }
    //если новая картинка
    if (this.addProductForm.value.img != this.editObj.img) {
      console.log(this.addProductForm)
      this._uploadService.deleteIMG(this.editObj.img);
      this._uploadService.addItem(this.name.value, data);

      this.upload(this.file.nativeElement.files[0]);
          
        return setTimeout(() => {
          this._uploadService.downloadImage(this.i)
          .subscribe(
            imgURL => {
              this.editObj.imgURL = imgURL
              console.log(imgURL)
            },
            error => {
              this.editObj.imgURL = 'error'
              console.warn(error);
            }
          )
        }, 2000);
      
    }
    //если новое имя
    if (this.addProductForm.value.name != this.editObj.name) {
      this._uploadService.deleteItem(this.editObj.name)
      this._uploadService.addItem(this.name.value, data);
      return this.allList();
    }
    this._uploadService.addItem(this.name.value, data);
    this.allList();
  }

  delete(e) {
    this._uploadService.deleteItem(e.name);
    this._uploadService.deleteIMG(e.img);
    this.allList();
  }
  upload(file) {
    this._uploadService.uploadImage(this.img.value, file);
    this.addProductForm.reset();
  }

  private imgName() {
    const id = Math.random().toString(36).substring(2);
    this.addProductForm.patchValue({ img: id })
    this.i = id;
  }

  uniqueNames(name) {
    this.names[name] = true;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


