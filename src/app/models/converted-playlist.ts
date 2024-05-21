import { Song } from "./song";

export interface ConvertedPlaylist {
    playlistID: string;
    snapshotID: string;
    songList: Array<Song>;
}
