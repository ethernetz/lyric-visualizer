import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Song } from '../models/song.model';
import { SongService } from '../services/song.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent {

    private songSub: Subscription;
    song: Song = null;

    private sorted_lyrics_map;

    constructor(
        public songService: SongService
    ) { }


    ngOnInit() {
        this.songSub = this.songService
            .getSongUpdateListener()
            .subscribe((song: Song) => {
                this.song = song
            })
    }

    

}