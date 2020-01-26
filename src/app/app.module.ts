import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { TemplateSignComponent } from './template-sign/template-sign.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { HostDirective } from './template-shared/host.directive';
import { AdminProductsComponent } from './admin-products/admin-products.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    TemplateSignComponent,
    HostDirective,
    AdminProductsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    //firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    //material
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent],
  entryComponents: [ TemplateSignComponent ],
})
export class AppModule { }
