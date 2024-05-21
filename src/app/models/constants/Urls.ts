export class Youtube {
    static Login: string = "https://accounts.google.com/o/oauth2/v2/auth";
    static ClientID: string =  '1013077185211-cb23rcr525sj3n9mo7qgr6ls6ik51bug.apps.googleusercontent.com';
    static RedirectUri: string = 'http://localhost:4200/login';
    static Scope: string[] = ["https://www.googleapis.com/auth/youtube","https://www.googleapis.com/auth/youtube.upload","https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtubepartner","https://www.googleapis.com/auth/youtubepartner-channel-audit","https://www.googleapis.com/auth/youtube.force-ssl"];  

}

export class Spotify {
    static Login: string = "https://accounts.spotify.com/authorize";
    static ClientID: string =  'b3172745be3c4b20b667c2bb6eb56185';
    static RedirectUri: string = "http://localhost:4200/login";
    static Scope: string[] = ["user-read-private","user-read-email","playlist-modify-public","playlist-modify-private"];
    
 
}

// I forgot to mention that for the personal project video. I'm s 