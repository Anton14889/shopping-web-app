import { Component, Input, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { Data } from '../services/data.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

 @Input() user;
 @Input() routAdminUser;
 cartSize: Number;

 constructor(_data: DataService
  ) {
    _data.changeEmitted$.subscribe(
     (dataServer: Data) => {
        this.cartSize = dataServer.cartItems;
      });
  }
  

}
