import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  data: any;
  
private emitChangeSource = new Subject<any>();

changeEmitted$ = this.emitChangeSource.asObservable();

emitChange(change: any) {
    this.emitChangeSource.next(change);
}




}
