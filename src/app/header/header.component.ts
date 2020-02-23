import { Component, Input, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Data } from '../services/data.model';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() user;
  @Input() routAdminUser;
  cartSize: Number;
  favoritSize: Number;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpen = true;
  mode = 'side';
  width = false;

  constructor(
    data: DataService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    data.changeEmitted$.subscribe(
      (dataServer: Data) => {
        this.cartSize = dataServer.cartSize;
        this.favoritSize = dataServer.favoritSize;
      });


    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => {
      this.isOpen = !this.isOpen;
      this.mode === 'over' ? this.mode = 'side' : this.mode = 'over';
      this.width === true ? this.width = false : this.width = true;
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    if (document.documentElement.clientWidth <= 768) {
      this.isOpen = false;
      this.mode = 'over';
      this.width = true;
    }
  }

  @ViewChild('drawer', {static: false}) drawer;

  close() {
    if (this.width) {
      this.drawer.close();
      document.documentElement.style.overflow = "auto";
    }
    
  }

  open() {
    this.drawer.open();
    document.documentElement.style.overflow = "hidden";
  }


}
