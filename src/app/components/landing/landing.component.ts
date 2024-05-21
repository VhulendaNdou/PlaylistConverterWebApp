import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platforms } from 'src/app/models/constants/general';
import { ConvertService } from 'src/app/services/convert/convert.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.sass']
})
export class LandingComponent {


  form : FormGroup;
  isPlatformsEqual = false;

  
  constructor(formbuilder : FormBuilder,private router: Router, private convertService: ConvertService){
    this.form = formbuilder.group({
      url : new FormControl("",Validators.required),
      convertTo : new FormControl("",Validators.required),
      convertFrom : new FormControl("",Validators.required),

    }) 
  }

  urlRequiredError() : boolean{
    if(this.form.controls[Platforms.URL].dirty && this.form.controls[Platforms.URL].value == ""){
      return true;
    }

    return false;
  }

  isFormValid(): boolean{
    if(this.form.controls[Platforms.URL].value && this.form.controls[Platforms.CONVERTFROM].value && this.form.controls[Platforms.CONVERTTO].value ){
      return true;
    }
    return false;
  }


  onSubmission(){
    if(this.isFormValid()){
      let convertTo: string = this.form.controls[Platforms.CONVERTTO].value;
      let convertFrom: string = this.form.controls[Platforms.CONVERTFROM].value;
      localStorage.setItem(Platforms.CONVERTTO,convertTo );
      localStorage.setItem(Platforms.CONVERTFROM, convertFrom );
      
      
      if (convertTo != convertFrom ) {
        
        this.isPlatformsEqual = false;
        if (sessionStorage.getItem(Platforms.SPOTIFY) && sessionStorage.getItem(Platforms.YOUTUBE) ) {// if token is set
          this.convertService.convertPlaylist(this.form.controls[Platforms.URL].value)
        }
        else{
          localStorage.setItem(Platforms.URL, this.form.controls[Platforms.URL].value);
          this.router.navigate(['/login']) 
        }
        
        
      } else {
        this.isPlatformsEqual = true;
      }
       
    }
    
    
  }



}
