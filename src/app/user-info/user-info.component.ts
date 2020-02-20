import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { AppComponent } from '../app.component';
import { Data } from '../services/data.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {

  constructor(
    private data: DataService,
    private appComponent: AppComponent
  ) { 
    this. data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer['user'];
      });
   }
   user = {
    email: null,
    displayName: null,
    photoURL: null,
    emailVerified: null,
    phoneNumber: null,
   };

   signOut() {
    this.appComponent.signOut()
  }


}
