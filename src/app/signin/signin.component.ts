import { Component, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HostDirective } from '../template-shared/host.directive';
import { AdItem } from '../template-shared/ad-item';
import { AdComponent } from '../template-shared/ad.component';
import { TemplateSignComponent } from '../template-sign/template-sign.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  adItem: AdItem;

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.adItem = new AdItem(TemplateSignComponent, {
      signForm: this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.minLength(6), Validators.required]]
      }),
      buttonValue: 'Sign In',
      signMessage: 'Dont have an account? Sign Up',
      router: 'signUp',
      signin: true
    })
  }

  ngOnInit() {
    this.loadComponent();
  }


  @ViewChild(HostDirective, { static: true }) adHost: HostDirective;

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.adItem.component);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = this.adItem.data;
  }



}
