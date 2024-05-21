import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Spotify, Youtube } from "../../models/constants/Urls";
import { Platforms } from "../../models/constants/general";
import { Token } from '../../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) { }

  /**
   * Redirects window to the login page for user to enter login details for a specific platform
   * @param platform 
   */
  login(platform: string){
    switch (platform) {
      case Platforms.SPOTIFY:
        window.location.href = `${Spotify.Login}?client_id=${Spotify.ClientID}&response_type=code&redirect_uri=${encodeURI(Spotify.RedirectUri)}&scope=${Spotify.Scope[0]}%20${Spotify.Scope[1]}%20${Spotify.Scope[2]}%20${Spotify.Scope[3]}`;
        break;

      case Platforms.YOUTUBE:

        window.location.href = `${Youtube.Login}?client_id=${Youtube.ClientID}&redirect_uri=${encodeURI(Youtube.RedirectUri)}&response_type=code&scope=${Youtube.Scope[0]}%20${Youtube.Scope[1]}%20${Youtube.Scope[2]}%20${Youtube.Scope[3]}%20${Youtube.Scope[4]}%20${Youtube.Scope[5]}`;
        break;
    
      default:
        break;
    }
    
  }

  retrieveToken(code: string, platform: string): Observable<Token>{
    let header: HttpHeaders = new HttpHeaders() 
    header.append('Content-Type','application/json')
    let body = {
      code: code,
      platform: platform
    } 
    return this.client.post<Token>("http://localhost:8080/authorize",body,{headers: header});
  }


}
