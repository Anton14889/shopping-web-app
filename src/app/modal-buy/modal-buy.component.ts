import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { UploadService } from '../upload-service/upload.service';

@Component({
  template: `
  <h1 mat-dialog-title>
  
  Do you want {{data.message}}
  <br>
  {{data.name}} ?</h1>

<div mat-dialog-actions>
  <button mat-button (click)="closeDialog()">No</button>
  <ng-container *ngIf="data.adminDelete">
  <button mat-button (click)="deleteAdmin()">{{data.button_message}}</button>
  </ng-container>
  <ng-container *ngIf="!data.adminDelete">
  <button mat-button (click)="closeDialog()">{{data.button_message}}</button>
  </ng-container>
  
</div>
`
})
export class ModalBuyComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalBuyComponent>,
    private uploadService: UploadService,
    private dataService: DataService,
    public dialog: MatDialog,
  ) { }
 
  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteAdmin() {
    this.uploadService.deleteItem(this.data.eventObj.name);
    this.uploadService.deleteIMG(this.data.eventObj.img);
   
    this.dataService.emitProduct(true);
    this.dialog.closeAll()
  }
 
}
