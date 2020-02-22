import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

@Input() data;
@Input() button_Left;
@Input() button_Right;
@Input() close_Button;

@Input() id;
@Input() idText;
@Output() idEvent = new EventEmitter();

@Output() buttonLeft = new EventEmitter();
@Output() buttonRight = new EventEmitter();
@Output() closeButton = new EventEmitter();

clickLeft(val) {
  this.buttonLeft.emit(val);
}
clickRight(val) {
  this.buttonRight.emit(val);
}
clickCloseButton(val) {
  this.closeButton.emit(val);
}
clickIdEvent(val) {
  this.idEvent.emit(val);
}

}
