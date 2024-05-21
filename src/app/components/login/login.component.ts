import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { ConvertService } from 'src/app/services/convert/convert.service';
import { Platforms } from "../../models/constants/general";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  step: number = 1 ;
  error: boolean = false;

  constructor(private authService: AuthService, private convertService: ConvertService, private activeRoute: ActivatedRoute){

  }

  ngOnInit(){

    this.checkSession();

    if (!sessionStorage.getItem(Platforms.SPOTIFY) || !sessionStorage.getItem(Platforms.YOUTUBE)) {
      //prompt to login to youtube
      this.activeRoute.queryParams.subscribe(params => {
        if (params['code']) {
  
          this.authService.retrieveToken(params['code'],localStorage.getItem('platform')!).subscribe((res)=> {
            
            switch (res.platform) {
              case Platforms.SPOTIFY:
                sessionStorage.setItem(Platforms.SPOTIFY,res.accessToken.access_token)
                sessionStorage.setItem(Platforms.SPOTIFY+"time",res.accessToken.expires_in.toString())
                if (sessionStorage.getItem(Platforms.YOUTUBE)) {
                  this.convertPlaylist()
                }
                else{
                  this.setStep(2);
                }
                break;
  
              case Platforms.YOUTUBE:
                sessionStorage.setItem(Platforms.YOUTUBE,res.accessToken.access_token)
                sessionStorage.setItem(Platforms.YOUTUBE+"time",res.accessToken.expires_in.toString())
                if (sessionStorage.getItem(Platforms.SPOTIFY)) {
                  this.convertPlaylist()
                }
                else{
                  this.setStep(1);
                }
                break;
            
              default:
                break;
            }
            
          });
        }
        
      });
  
    } 
  }
  
 
  convertPlaylist(){
    this.convertService.convertPlaylist(localStorage.getItem('url')!)
  }

  checkSession(){
    if (sessionStorage.getItem(Platforms.SPOTIFY) && sessionStorage.getItem(Platforms.YOUTUBE)) {
        // check if both tokens have been set
          this.convertPlaylist();
        }
  }

  login(platform: string){
    //check which platform has been chosen 
    localStorage.setItem('platform',platform);
    this.authService.login(platform);
    
  }

  setStep(step: number){
    this.step = step;
  }

}
