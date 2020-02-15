import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {

  constructor(
    private _data: DataService,
    private _appComponent: AppComponent
  ) { 
    this. _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer['user'];
      });
   }
   user = {};

   signOut() {
    this._appComponent.signOut()
  }


}
