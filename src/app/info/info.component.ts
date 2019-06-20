import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Song } from '../models/song.model';
import { Subscription } from 'rxjs';
import { select } from 'd3';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit{
    constructor(private songService: SongService){}

    public selectedSong: Song = null;
    public selectedSongSub: Subscription;
    
    ngOnInit(){
        this.selectedSongSub = this.songService
        .getSongUpdateListener()
        .subscribe((selectedSong: Song) => {
            console.log('yo!')
            this.selectedSong = selectedSong;
        })
    }

}