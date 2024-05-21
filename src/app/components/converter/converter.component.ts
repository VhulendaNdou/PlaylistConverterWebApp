import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { General, Platforms } from 'src/app/models/constants/general';
import { ConvertedPlaylist } from 'src/app/models/converted-playlist';
import { Song } from 'src/app/models/song';
import { ConvertService } from 'src/app/services/convert/convert.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.sass']
})
export class ConverterComponent implements OnInit{
  form : FormGroup;
  playlist: ConvertedPlaylist | undefined;
  song: Song | undefined;
  convertedTo: string | null = localStorage.getItem(Platforms.CONVERTTO);
  error: boolean =false;

  
  
  constructor(formbuilder : FormBuilder,private convertService: ConvertService, private router: Router){
    this.form = formbuilder.group({
      query : new FormControl("",Validators.required)
    }) 
  }

  ngOnInit(): void {
      this.playlist = this.convertService.getPlaylist();
      console.log(this.playlist)
      if (this.playlist != undefined) {
         
        //  this.convertService.setPlaylist
      }
      else{
        this.playlist = JSON.parse(sessionStorage.getItem("playlist")!);
        // alert("There aren't any songs in the playlist. Convert a new playlist");
        // this.router.navigate(["/home"])
      }
     
  }

  removeSong(song: Song ){
    if (this.playlist) {
    
      if (this.playlist?.songList.length! > 0) {
        console.log(this.playlist);
        this.convertService.removeSongFromPlaylist(song, this.playlist.playlistID, this.playlist.snapshotID).subscribe((res)=>{

            this.playlist?.songList.forEach( (currentSong,index) =>{
              
              if (currentSong.id == song.id) {
                console.log("song removed")
                this.playlist?.songList.splice(index,1);              
              }
            })
            this.convertService.setPlaylist(this.playlist!);

        });
      }
      else{
        alert("There aren't any songs in the playlist. Convert a new playlist");
        this.router.navigate(["/home"])
      }
    }
    else{
      alert("Playlist was not converted. Try again")
      this.router.navigate(["/home"])
    }

    
  }


  convertPage(): boolean{
    if(this.router.url.includes(General.CONVERTER)){
        return true;
      }
    return false;
  }

  isFormValid(): boolean{
    if(this.form.controls[General.QUERY].value ){
      return true;
    }
    return false;
  }

  onSubmission(){
    if(this.isFormValid()){
      let query = this.form.controls[General.QUERY].value;
      this.convertService.searchSong(query).subscribe(res =>{

        this.song = res; 
        const message = document.getElementById('songname');
        if (this.song.artistName != null) {
          message!.textContent = this.song.songName+" by "+ this.song.artistName;
        }
        else{
          message!.textContent = this.song.songName;
        }
        
        let element: any = $('#searchResults');
        const myReveal = new Foundation.Reveal(element);
        myReveal.open();
      });
    }
  }

  addSong(song: Song){
    if (this.playlist) {
     this.convertService.addSong(song, this.playlist.playlistID, this.playlist.snapshotID)
      .subscribe(res => {
        this.playlist?.songList.push(res);
        this.convertService.setPlaylist(this.playlist!);

      });
      
      
    }

    // let element: any = $('#searchResults');
    // const myReveal = new Foundation.Reveal(element);
    // myReveal.close();

    // let overlay: any = $('.reveal-overlay').get().pop();

    //window.location.reload()

  }

  
}
