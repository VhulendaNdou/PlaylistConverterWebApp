import { Component, Input } from '@angular/core';
import { delay } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent {
  // @Input()
  message!: string;
  
  constructor() { }

  showAlert(message: string){
    console.log('error' );
    this.message = message;
    // delay(1000)
    // this.closeAlert();
  }


  
}
