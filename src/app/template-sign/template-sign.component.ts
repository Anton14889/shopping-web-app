import { Component, OnInit, Input } from '@angular/core';
import { AuthWhithParolService } from '../services/auth-parol.service';

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
  ) {}

  ngOnInit() {
    this.signForm = this.data.signForm;
    this.buttonValue = this.data.buttonValue;
    this.signMessage = this.data.signMessage;
    this.rout = this.data.rout;
  }

  onSubmit() {
    if (this.data.signin) {
      this.authService.SignIn(this.email.value, this.password.value)
        .then(
          res => {
          },
          err => alert(err.message)
        )
    } else {
      this.authService.SignUp(this.email.value, this.password.value)
        .then(
          res => {
          },
          err => alert(err.message)
        )
    }
  }
  get email() { return this.signForm.get('email'); }
  get password() { return this.signForm.get('password'); }


  

}
