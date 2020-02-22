import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UploadService } from '../upload-service/upload.service';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { DataService } from '../services/data.service';
import { ModalBuyComponent } from '../modal-buy/modal-buy.component';

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
    // public uploadService: UploadService,
    // public dataService: DataService
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
      maxHeight: '80vh',
      maxWidth: '95vw',
      position: {
        'top': '15vh'
      }
    });
  }

  delete() {
    
    this.dialog.open(ModalBuyComponent, {
      data: {
        name: this.data.eventObj.name,
        message: 'delete',
        button_message: 'Delete',
        eventObj: this.data.eventObj,
        id: this.data.id,
        editButton: true,
        adminDelete: true
      },

    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
