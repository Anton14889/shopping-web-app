import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UploadService } from '../upload-service/upload.service';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-mobile-edit',
  template: `
       <div class='card'>
       <app-card [data]="data.eventObj"
        [close_Button]='close_Button'
       [button_Left]='"Delete"'
       [button_Right]='"Edit"'
       (buttonRight)='edit()'
       (buttonLeft)='delete()'
       (closeButton)='closeDialog()'
       >   
           </app-card>
       </div>
  `,
  styleUrls: ['./admin-mobile-edit.component.css']
})
export class AdminMobileEditComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdminMobileEditComponent>,
    public dialog: MatDialog,
    public uploadService: UploadService,
    public dataService: DataService
  ) {

    this.names = data.uniqueNames;
  }

  names;
  close_Button = 'Close';

  edit() {
    this.dialog.open(ModalDialogComponent, {
      data: {
        eventObj: this.data.eventObj,
        uniqueNames: this.names,
        id: this.data.id,
        editButton: true,
      },
      maxHeight: '100vh'
    });
  }

  delete() {
    this.uploadService.deleteItem(this.data.eventObj.name);
    this.uploadService.deleteIMG(this.data.eventObj.img);
    //если удалил тогда уникальное имя больше не уникально
    this.uniqueNames(this.data.eventObj.name, false);
    this.dataService.emitProduct(true);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  uniqueNames(name, value) {
    this.names[name] = value;
  }

}
