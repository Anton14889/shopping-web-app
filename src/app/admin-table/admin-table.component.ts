import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadService } from '../upload-service/upload.service';
import { FormBuilder, Validators } from '@angular/forms';

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
  private editObj = {};
  private saveIMGid = null;

  modal = true;
  editButton = false;
  emptyData = false;
  addedProduct = false;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.allList();
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



  onSubmit() {
    //нельзя добавить новый продукт с существующим именем
    if (this.names[this.name.value]) {
      return alert('Name already exists')
    }
    this.addedProduct = true;
    let data = {
      name: this.name.value,
      id: +this.id + 1,
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };

    this._uploadService.addItem(this.name.value, data);
    this.upload(this.file.nativeElement.files[0]);

    setTimeout(() => {
      this.allList();
      this.img.reset();
      this.addedProduct = false;
    }, 1500);
    this.modal = !this.modal;
  }

  openSubmitForm() {
    this.addProductForm.reset();
    this.modal = !this.modal;
    this.editButton = false;
  }

  onEdit() {

    let data = {
      name: this.name.value,
      id: this.editObj['id'],
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };


    //если новое имя и новая картинка или имя картинка и описание
    if (this.addProductForm.value.img != this.editObj['img'] && this.addProductForm.value.name != this.editObj['name']) {
      if (this.addProductForm.value.name != this.editObj['name']) {
        // если новое имя существует
        if (this.names[this.addProductForm.value.name]) {
          return alert('Name already exist')
        }
        this.modal = !this.modal;
        return this.editImageEndName(data)
      }
    }
     //если новое имя
     if (this.addProductForm.value.name != this.editObj['name']) {
      if (this.names[this.addProductForm.value.name]) {
        return alert('Name already exist')
      }
      this.modal = !this.modal;
      return this.editname(data);
    }
    //если новая картинка
    if (this.addProductForm.value.img != this.editObj['img']) {
      this.modal = !this.modal;
      return this.editImage(data);
    }

    this.modal = !this.modal;
    return this.editDescription(data)
  }

  //сохраняем event обьект, переносим значения в форму
  edit(e) {
    this.editButton = true;
    this.editObj = e;
    this.modal = !this.modal;
    this.addProductForm.patchValue({ id: e.id });
    this.addProductForm.patchValue({ name: e.name });
    this.addProductForm.patchValue({ description: e.description });
    this.addProductForm.patchValue({ price: e.price });
    this.addProductForm.patchValue({ img: e.img });
  }

  delete(e) {
    this._uploadService.deleteItem(e.name);
    this._uploadService.deleteIMG(e.img);
    this.uniqueNames(e.name, false);

    setTimeout(() => {
      this.allList();
    }, 1500);
  }

  private allList() {
    let result = [];
    let objData = {};

    const list = this._uploadService.tableList()
      .subscribe(
        data => {
          if (data.empty) {
            this.dataSource = new MatTableDataSource([]);
            this.emptyData = data.empty;
          }
          data.forEach(doc => {
            if (this.id < doc.data()['id']) {
              this.id = doc.data()['id']
            }
            this.uniqueNames(doc.data()['name'], true);
            this.emptyData = false;
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
                  objData['imageError'] = 'error';
                  result.push(objData)
                  this.dataSource = new MatTableDataSource(result);

                }
              )
          })

        }, e => console.warn("tableList error")
      );
  }

  private editDescription(data) {
    this._uploadService.addItem(this.name.value, data);
    this.editObj['name'] = data['name'];
    this.editObj['description'] = data['description'];
    this.editObj['price'] = data['price'];
  }

  private editImageEndName(data) {

    this._uploadService.deleteIMG(this.editObj['img']);
    this._uploadService.deleteItem(this.editObj['name']);
    this._uploadService.addItem(this.name.value, data);

    this.editObj['name'] = data['name'];
    this.editObj['description'] = data['description'];
    this.editObj['price'] = data['price'];

    this.upload(this.file.nativeElement.files[0]);

    return this.returnIMG(this.editObj);
  }

  private editImage(data) {
    this._uploadService.deleteIMG(this.editObj['img']);
    this._uploadService.addItem(this.name.value, data);
    this.upload(this.file.nativeElement.files[0]);
    return this.returnIMG(this.editObj);
  }

  private editname(data) {
    this._uploadService.deleteItem(this.editObj['name']);
    this._uploadService.addItem(this.name.value, data);
    this.editObj['name'] = data['name'];
    this.editObj['description'] = data['description'];
    this.editObj['price'] = data['price'];
  }

  private returnIMG(dataObj) {
    this.editObj['spinner'] = true;
    return setTimeout(() => {
      this._uploadService.downloadImage(this.saveIMGid)
        .subscribe(
          imgURL => {
            dataObj['imgURL'] = imgURL;
            dataObj['spinner'] = false;
            dataObj['imageError'] = null;
          },
          error => {

            dataObj['imageError'] = 'error';
            console.warn(error);
          }
        )
    }, 2000);
  }

  private upload(file) {
    this._uploadService.uploadImage(this.img.value, file);
    this.editObj['img'] = this.img.value || null;
    this.addProductForm.reset();
  }

  imgName() {
    const id = Math.random().toString(36).substring(2);
    this.addProductForm.patchValue({ img: id })
    this.saveIMGid = id;
  }

  uniqueNames(name, value) {
    this.names[name] = value;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


