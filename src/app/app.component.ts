import { Component } from '@angular/core';
import { AuthService } from './services/auth-google.service';

import { AuthWhithParolService } from './services/auth-parol.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  constructor(
    public auth: AuthService,
    public authService: AuthWhithParolService,
    private _data: DataService
  ){
    _data.changeEmitted$.subscribe(
      dataServer => {
          console.log(dataServer);
          this.user = dataServer.email;
      });
  }

user;


















  // registerForm =  new FormGroup({
  //   email: new FormControl('', Validators.required),
  //   password: new FormControl('',Validators.required)
  // })
  // errorMessage;
  // successMessage;

  // tryRegister(value){
  //   this.authService.SignUp(value)
  //   .then(res => {
  //     console.log(res);
  //     this.errorMessage = "";
  //     this.successMessage = "Your account has been created";
  //   }, err => {
  //     console.log(err);
  //     this.errorMessage = err.message;
  //     this.successMessage = "";
  //   })
  // }




}
