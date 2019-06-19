import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model';
import { SongService } from '../services/song.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent{

    private songSub: Subscription;
    song: Song = null;

    constructor(
        public songService: SongService
    ){}


    ngOnInit(){
        let starterSong: SongOption = {
            title: "Hymn for the Weekend",
            artist: "Coldplay",
            album_title: "A Head Full of Dreams",
            album_art: "https://e-cdns-images.dzcdn.net/images/cover/5df065fdcbaffd0f83d09789bad9d2db/250x250-000000-80-0-0.jpg"
        }
        this.songService.getSong(starterSong);

        this.songSub = this.songService
        .getSongUpdateListener()
        .subscribe((song: Song) => {
            this.song = song
        })
    }

}