import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
  <h1 mat-dialog-title>
  
  Do you want to buy
  <br>
  {{data.name}} ?</h1>

<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No</button>
  <button mat-button cdkFocusInitial>Buy</button>
</div>
`
})
export class ModalBuyComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ModalBuyComponent>,
) { }

onNoClick(): void {
  this.dialogRef.close();
}
}
