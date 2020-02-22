import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  template: `
  <div 
    class="text-center"
  >
  {{ data }}
  </div>
  `
})
export class ToastrComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

}
