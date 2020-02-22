import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormBuilder } from '@angular/forms';
import { UploadService } from '../upload-service/upload.service';

import { smallImg } from '../imgSmall';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent {

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    private uploadService: UploadService,
    private dataService: DataService,
  ) {
    if (data.editButton) {
      this.editButton = data.editButton;
      this.names = data.uniqueNames;
      this.addProductForm.patchValue({ id: data.eventObj.id });
      this.addProductForm.patchValue({ name: data.eventObj.name });
      this.addProductForm.patchValue({ description: data.eventObj.description });
      this.addProductForm.patchValue({ price: data.eventObj.price });
      this.addProductForm.patchValue({ img: data.eventObj.img });
    } else {
      this.editButton = data.editButton;
      this.names = data.uniqueNames;
      this.addProductForm.reset();
      this.addProductForm.patchValue({ id: data.id });
    }

  }
  editButton;

  names;

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.pattern('^[0-9]+$'), Validators.required]],
    img: ['']
  })
  private saveIMGid = null;
  @ViewChild('file', { static: false }) file: ElementRef;

  get name() { return this.addProductForm.get('name'); }
  get description() { return this.addProductForm.get('description'); }
  get price() { return this.addProductForm.get('price'); }
  get img() { return this.addProductForm.get('img'); }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    //нельзя добавить новый продукт с существующим именем
    if (this.data.uniqueNames[this.name.value]) {
      return alert('Name already exists')
    }

    let data = {
      name: this.name.value,
      id: +this.data.id + 1,
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };

    this.uploadService.addItem(this.name.value, data);
    this.upload(this.file.nativeElement.files[0]);
    this.dataService.emitProduct(true);
    this.closeDialog();

  }


  onEdit() {

    let data = {
      name: this.name.value,
      id: this.data.eventObj['id'],
      description: this.description.value,
      price: +this.price.value,
      img: this.img.value,
    };

    //если новое имя и новая картинка или имя картинка и описание
    if (this.addProductForm.value.img != this.data.eventObj['img'] && this.addProductForm.value.name != this.data.eventObj['name']) {
      if (this.addProductForm.value.name != this.data.eventObj['name']) {
        // если новое имя существует
        if (this.data.uniqueNames[this.addProductForm.value.name]) {
          return alert('Name already exist')
        }
        this.closeDialog();
        return this.editImageEndName(data)
      }
    }
    //если новое имя
    if (this.addProductForm.value.name != this.data.eventObj['name']) {
      if (this.data.uniqueNames[this.addProductForm.value.name]) {
        return alert('Name already exist')
      }
      this.closeDialog();
      return this.editname(data);
    }
    //если новая картинка
    if (this.addProductForm.value.img != this.data.eventObj['img']) {
      this.closeDialog();
      return this.editImage(data);
    }
    this.closeDialog();
    return this.editDescription(data)
  }

  private editDescription(data) {
    this.uploadService.addItem(this.name.value, data);
    this.data.eventObj['name'] = data['name'];
    this.data.eventObj['description'] = data['description'];
    this.data.eventObj['price'] = data['price'];
  }

  private editImageEndName(data) {

    this.uploadService.deleteIMG(this.data.eventObj['img']);
    this.uploadService.deleteItem(this.data.eventObj['name']);
    this.uploadService.addItem(this.name.value, data);
    this.uniqueNames(this.data.eventObj['name'], false)

    this.data.eventObj['name'] = data['name'];
    this.data.eventObj['description'] = data['description'];
    this.data.eventObj['price'] = data['price'];

    this.upload(this.file.nativeElement.files[0]);
    return this.returnIMG(this.data.eventObj);
  }

  private editImage(data) {
    this.uploadService.deleteIMG(this.data.eventObj['img']);
    this.uploadService.addItem(this.name.value, data);

    this.data.eventObj['name'] = data['name'];
    this.data.eventObj['description'] = data['description'];
    this.data.eventObj['price'] = data['price'];
    
    this.upload(this.file.nativeElement.files[0]);
    return this.returnIMG(this.data.eventObj);
  }

  private editname(data) {
    this.uploadService.deleteItem(this.data.eventObj['name']);
    this.uploadService.addItem(this.name.value, data);
    this.uniqueNames(this.data.eventObj['name'], false)
    this.data.eventObj['name'] = data['name'];
    this.data.eventObj['description'] = data['description'];
    this.data.eventObj['price'] = data['price'];
  }


  private upload(file) {
    smallImg(file, 80, 500, Infinity, 0.9, blob => {
      this.uploadService.uploadImage(this.img.value, blob);

      //валидация картинки
      this.data.eventObj['img'] = this.img.value || null;
      this.addProductForm.reset();
    });
  }


  private returnIMG(dataObj) {
    this.data.eventObj['spinner'] = true;
    return setTimeout(() => {
      this.uploadService.downloadImage(this.saveIMGid)
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

  uniqueNames(name, value) {
    this.names[name] = value;
  }

  imgName() {
    const id = Math.random().toString(36).substring(2);
    this.addProductForm.patchValue({ img: id })
    this.saveIMGid = id;
  }
}
