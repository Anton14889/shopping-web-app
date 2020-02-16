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
 favoritSize: Number;

 constructor(data: DataService
  ) {
    data.changeEmitted$.subscribe(
     (dataServer: Data) => {
        this.cartSize = dataServer.cartSize;
        this.favoritSize = dataServer.favoritSize;
      });
  }
  

}
