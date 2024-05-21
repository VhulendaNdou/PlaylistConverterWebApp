import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConvertedPlaylist } from '../../models/converted-playlist';
import { Platforms } from '../../models/constants/general';
import { Router } from '@angular/router';
import { Song } from '../../models/song';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

  private playlist!: ConvertedPlaylist ;

  constructor(private client: HttpClient, private router: Router) { }

  getConvertedPlaylist( playlistID: string): Observable<ConvertedPlaylist>{
    let convertTo = localStorage.getItem(Platforms.CONVERTTO)!;
    let convertFrom = localStorage.getItem(Platforms.CONVERTFROM)!;
    let header = {'user-token' : `${sessionStorage.getItem(convertFrom)} ${sessionStorage.getItem(convertTo)}` };

    let body = {
      convertTo: localStorage.getItem(Platforms.CONVERTTO),
      convertFrom: localStorage.getItem(Platforms.CONVERTFROM),
      playlistID: playlistID,
    } 
    return this.client.post<ConvertedPlaylist>("http://localhost:8080/convert",body,{headers: header});
  }

  getPlaylist(): ConvertedPlaylist{
    return this.playlist;
  }

  setPlaylist(playlist: ConvertedPlaylist){
    this.playlist = playlist!;
    sessionStorage.removeItem("playlist");
    sessionStorage.setItem("playlist",JSON.stringify(this.playlist));
  }

  convertPlaylist(url: String ): ConvertedPlaylist {
    //extract playlist ID if youtube
    
    let playlistID: string
    switch (localStorage.getItem(Platforms.CONVERTFROM)) {
      case Platforms.YOUTUBE:
        playlistID = url.split('=')[1];
        console.log(playlistID);
        this.getConvertedPlaylist(playlistID)
        .subscribe((res)=>{
          this.playlist = res;
          sessionStorage.setItem("playlist",JSON.stringify(this.playlist))
          console.log(res);
          this.router.navigate(['/converter'])
        });
        break;

      case Platforms.SPOTIFY:
        let urlArray = url.split('/');
        playlistID  = urlArray.at(urlArray.length-1)!;
        
        this.getConvertedPlaylist(playlistID).subscribe((res)=>{
          //show converted playlist
          this.playlist = res;
          sessionStorage.setItem("playlist",JSON.stringify(this.playlist))
          this.router.navigate(['/converter'])
        });
        break;
    
      default:
        break;
    }

    return this.playlist;

  }

  removeSongFromPlaylist(song: Song, playlistId: string, snapshotId:string): Observable<string>{
    let platform = localStorage.getItem(Platforms.CONVERTTO)!;

    let header = {'user-token' : sessionStorage.getItem(platform)! };

    let body = {
      platform: platform,
      playlistID: playlistId,
      songID: song.id,
      snapshotID: snapshotId
    } 

    return this.client.post<string>("http://localhost:8080/removeSong",body,{headers: header,responseType: 'text' as 'json'});
  }

  searchSong(query :string ): Observable<Song>{
    let platform = localStorage.getItem(Platforms.CONVERTTO)!;

    let header = {'user-token' : sessionStorage.getItem(platform)! };

    let body = {
      platform: platform,
      query: query,
    } 

    return this.client.post<Song>("http://localhost:8080/searchSong",body,{headers: header});
  }

  addSong(song :Song, playlistId: string, snapshotId:string ): Observable<Song>{
    let platform = localStorage.getItem(Platforms.CONVERTTO)!;

    let header = {'user-token' : sessionStorage.getItem(platform)! };

    let body = {
      platform: platform,
      playlistID: playlistId,
      song: song,
      snapshotID: snapshotId

    } 

    return this.client.post<Song>("http://localhost:8080/addSong",body,{headers: header});
  }
}
