import { Component, OnInit } from '@angular/core';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalBuyComponent } from '../modal-buy/modal-buy.component';
import { UploadService } from '../upload-service/upload.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private cartService: CartService,
    public dialog: MatDialog,
    private data: DataService,
    private uploadService: UploadService,
  ) { }

  dataServer: Subscription;
  allListSub: Subscription;
  cartList: Subscription;
  imgList: Subscription;

  user = {
    email: null
  };
  result = [];
  spinner = false;

  ngOnInit() {
    this.dataServer = this.data.changeEmitted$
      .subscribe(
        dataServer => {
          if (dataServer['email'] != this.user['email']) {
            this.user['email'] = dataServer['email'];
            this.allList()
          }
        });
    try {
      
    } catch (error) {
      console.warn('property not find')
    }
  }

  ngOnDestroy(): void {
    try {
      this.dataServer.unsubscribe();
      this.imgList.unsubscribe();
      this.cartList.unsubscribe();
      this.allListSub.unsubscribe();
    } catch (error) {

    }
  }

  delete(data, i) {
    this.result.splice(i, 1);
    this.cartService.deleteItem(this.user.email, `${data.id}`, data.name);
  }

  buy(data) {
    this.dialog.open(ModalBuyComponent, {
      data: {
        name: data.name
      }
    });
  }

  private allList() {
    let result = [];
    let dataObj = {};
    this.spinner = true;

    this.allListSub = this.cartService.tableList(this.user.email)
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(
        data => {
          if (data.empty) {
            this.allListSub.unsubscribe();
            this.spinner = false;
            return this.result = result;
          }

          data.forEach(doc => {

            this.cartList = this.cartService.searchById(doc.data()['id'])
              .pipe(
                distinctUntilChanged()
              ).subscribe(
                data => {

                  this.imgList = this.uploadService.downloadImage(data.payload.doc.data()['img'])
                    .pipe(
                      distinctUntilChanged()
                    )
                    .subscribe(
                      imgURL => {
                        dataObj = data.payload.doc.data();
                        dataObj['imgURL'] = imgURL;
                        result.push(dataObj)
                        this.spinner = false;
                      },
                      error => {
                        console.warn(error);
                        dataObj = data.payload.doc.data();
                        dataObj['imageError'] = 'error';
                        result.push(dataObj)
                        this.spinner = false;
                      }
                    )
                }
              )
          })
          this.result = result
        }, e => console.warn("tableList error")
      )
  }

}