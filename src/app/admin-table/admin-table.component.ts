import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UploadService } from '../upload-service/upload.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { AdminMobileEditComponent } from '../admin-mobile-edit/admin-mobile-edit.component';
import { Subscription } from 'rxjs';

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

export class AdminTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'image', 'name', 'description', 'price', 'edit'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private id = -1;
  private names = {};
  editObj = {};


  allListSub: Subscription;
  imgList: Subscription;

  editButton = false;
  emptyData = false;

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private uploadService: UploadService,
    media: MediaMatcher,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      this.displayedColumns.length === 4 ? this.displayedColumns = ['id', 'image', 'name', 'description', 'price', 'edit'] : this.displayedColumns = ['id', 'image', 'name', 'info/edit'];
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
      maxHeight: '100vh'
    });
    this.updateListAfterCloseDialog();
  }

  edit(e) {
    this.editObj = e;
    this.dialog.open(ModalDialogComponent, {
      data: {
        eventObj: e,
        uniqueNames: this.names,
        id: this.id,
        editButton: true,
      },
      maxHeight: '100vh'
    });
  }

  info(e) {
    this.editObj = e;
    this.dialog.open(AdminMobileEditComponent, {
      data: {
        eventObj: e,
        uniqueNames: this.names,
        id: this.id,
        editButton: true,
      },
      maxHeight: '100vh'
    });
  }

  updateListAfterCloseDialog() {
    const dialog = this.dialog.afterAllClosed.subscribe(
      e => {
        setTimeout(() => {
          this.allList();
          dialog.unsubscribe()
        }, 1500);
      }
    )
  }

  private allList() {
    let result = [];
    let objData = {};

    this.allListSub = this.uploadService.tableList()
      .subscribe(
        data => {
          if (data.empty) {
            this.dataSource = new MatTableDataSource([]);
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
                },
                error => {
                  console.warn(error);
                  objData = doc.data();
                  objData['imageError'] = 'error';
                  result.push(objData)
                  this.dataSource = new MatTableDataSource(result);

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


