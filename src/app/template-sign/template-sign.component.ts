import { Component, OnInit, Input } from '@angular/core';
import { AuthWhithParolService } from '../services/auth-parol.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { of, from, timer, interval } from 'rxjs';

@Component({
  selector: 'app-template-sign',
  templateUrl: './template-sign.component.html',
  styleUrls: ['./template-sign.component.css']
})
export class TemplateSignComponent implements OnInit {

  @Input() data: any;

  signForm;
  buttonValue: string;
  signMessage: string;
  rout: string;

  constructor(
    public authService: AuthWhithParolService,
    private _data: DataService,
    private _router: Router,
    private _auth: AuthService,
  ) {

  }

  ngOnInit() {
    this.signForm = this.data.signForm;
    this.buttonValue = this.data.buttonValue;
    this.signMessage = this.data.signMessage;
    this.rout = this.data.rout;

    // this.checkAdmin();
  }

  onSubmit() {
    if (this.data.signin) {
      this.authService.SignIn(this.email.value, this.password.value)
        .then(
          res => {
            this._emitData(res)
          },
          err => alert(err.message)
        )
    } else {
      this.authService.SignUp(this.email.value, this.password.value)
        .then(
          res => {
            this._emitData(res)
          },
          err => alert(err.message)
        )
    }
  }

  private _emitData(res) {
    this._data.data = res.user;
    this._data.emitChange(res.user);
  }

  get email() { return this.signForm.get('email'); }
  get password() { return this.signForm.get('password'); }

  checkAdmin() {
    // if (value) {
    //   this._router.navigate(['admin']);
    // }

    




  }
    
  

}
