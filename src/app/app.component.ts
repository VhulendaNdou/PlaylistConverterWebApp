import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from './models/constants/general';
import { ConvertService } from './services/convert/convert.service';
import * as $ from 'jquery';
import * as Foundation from 'foundation-sites';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  
  title = 'Playlist-Converter';
  error: boolean = false;

  // Logout(){
  //   sessionStorage.clear();
  //   }

}
