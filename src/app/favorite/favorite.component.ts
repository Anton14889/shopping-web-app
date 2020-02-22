import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { FavoritesService } from '../user-services/favorites.service';
import { ModalBuyComponent } from '../modal-buy/modal-buy.component';
import { UploadService } from '../upload-service/upload.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit, OnDestroy {

  constructor(
    private favoritService: FavoritesService,
    private uploadService: UploadService,
    public dialog: MatDialog,
    private data: DataService,
  ) { }

  dataServer: Subscription;
  allListSub: Subscription;
  favoritList: Subscription;
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
      this.favoritList.unsubscribe();
      this.allListSub.unsubscribe();
    } catch (error) {

    }
  }

  delete(data, i) {
    this.result.splice(i, 1);
    this.favoritService.deleteItem(this.user.email, `${data.id}`, data.name);
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
    
    this.allListSub = this.favoritService.tableList(this.user.email)
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

            this.favoritList = this.favoritService.searchById(doc.data()['id'])
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
        }, e => {
          this.spinner = false;
          console.warn("tableList error")
        }
      )
  }


}
