import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadService } from '../upload-service/upload.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { AdminMobileEditComponent } from '../admin-mobile-edit/admin-mobile-edit.component';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';


export interface UserData {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  edit: string;
  delete: string;
}

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})

export class AdminTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'image', 'name', 'price', 'info/edit'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private id = -1;
  private names = {};
  editObj = {};

  addProduct = false;


  allListSub: Subscription;
  imgList: Subscription;
  dataServer: Subscription;

  editButton = false;
  emptyData = false;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private uploadService: UploadService,
    media: MediaMatcher,
    public dialog: MatDialog,
    private data: DataService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      this.displayedColumns.length === 4 ? this.displayedColumns = ['id', 'image', 'name', 'price', 'info/edit'] : this.displayedColumns = ['id', 'image', 'name', 'info/edit'];
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.allList();
    if (document.documentElement.clientWidth <= 768) {
      this.displayedColumns = ['id', 'image', 'name', 'info/edit'];
    }
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    try {
      this.imgList.unsubscribe();
      this.allListSub.unsubscribe();
      this.dataServer.unsubscribe();
    } catch (error) {

    }
  }
  openSubmitForm() {

    this.dialog.open(ModalDialogComponent, {
      data: {
        id: this.id,
        editButton: false,
        uniqueNames: this.names,
        eventObj: {
          img: ''
        }
      },
      maxHeight: '80vh',
      maxWidth: '95vw',
      position: {
        'top': '15vh'
      }
    });
    this.updateListAfterCloseDialog();
  }

  openInfo(e) {
    this.editObj = e;
    this.dialog.open(AdminMobileEditComponent, {
      data: {
        eventObj: e,
        uniqueNames: this.names,
        id: this.id,
        editButton: true,
      },
      maxWidth: '96vw',
      maxHeight: '90vh',
      position: {
        'top': '10vh'
      }
    });
    this.updateListAfterCloseDialog()
  }

  updateListAfterCloseDialog() {
    const dialog = this.dialog.afterAllClosed.subscribe(
      e => {
        this.dataServer = this.data.changeEmitted$
          .subscribe(
            dataServer => {
              if (dataServer['product']) {
                this.allList();
                setTimeout(() => {
                  this.data.emitProduct(false);
                  dialog.unsubscribe();
                }, 300);
              }
            }
          )
      }
    )
  }

  private allList() {
    let result = [];
    let objData = {};
    this.addProduct = true;

    this.allListSub = this.uploadService.tableList()
      .subscribe(
        data => {
          if (data.empty) {
            this.dataSource.data = result;
            this.emptyData = data.empty;
          }
          data.forEach(doc => {
            if (this.id < doc.data()['id']) {
              this.id = doc.data()['id']
            }
            this.uniqueNames(doc.data()['name'], true);
            this.emptyData = false;

            this.imgList = this.uploadService.downloadImage(doc.data()['img'])
              .subscribe(
                imgURL => {
                  objData = doc.data();
                  objData['imgURL'] = imgURL;
                  result.push(objData)
                  this.dataSource = new MatTableDataSource(result);
                  this.dataSource.paginator = this.paginator;

                  this.addProduct = false;

                },
                error => {
                  console.warn(error);
                  objData = doc.data();
                  objData['imageError'] = 'error';
                  result.push(objData)

                  this.dataSource.data = result;
                  this.addProduct = false;
                }
              )
          })

        }, e => console.warn("tableList error")
      );
  }

  uniqueNames(name, value) {
    this.names[name] = value;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


