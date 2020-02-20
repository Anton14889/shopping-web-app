import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore'; // << Note AngularFirestoreModule !!!
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AngularFireStorageModule } from '@angular/fire/storage';

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
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';


import { HostDirective } from './template-shared/host.directive';
import { AdminProductsComponent } from './admin-products/admin-products.component';

import { AdminModule } from './admin/admin.module';
import { ProductsComponent } from './products/products.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { CartComponent } from './cart/cart.component';
import { AdminTableComponent } from './admin-table/admin-table.component';
import { CardComponent } from './card/card.component';
import { ModalBuyComponent } from './modal-buy/modal-buy.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { AdminMobileEditComponent } from './admin-mobile-edit/admin-mobile-edit.component';
import { ToastrComponent } from './toastr/toastr.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {MatSnackBarModule} from "@angular/material"

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    TemplateSignComponent,
    HostDirective,
    AdminProductsComponent,
    ProductsComponent,
    FavoriteComponent,
    CartComponent,
    AdminTableComponent,
    CardComponent,
    ModalBuyComponent,
    UserInfoComponent,
    ModalDialogComponent,
    AdminMobileEditComponent,
    ToastrComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    //firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    //material
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSidenavModule,
    MatDialogModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  providers: [AngularFirestore,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 1000}}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ TemplateSignComponent, ModalBuyComponent, ModalDialogComponent, AdminMobileEditComponent, ToastrComponent ],
})

export class AppModule { }
