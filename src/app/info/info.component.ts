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

    public selectedSongAlbumArtUrl: string = null;
    public selectedSongAlbumArtUrlUpdated: Subscription;
    public defaultAlbumArtUrl: string = "https://ia802905.us.archive.org/29/items/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2-20937834816.jpg";
    
    ngOnInit(){
        this.selectedSongSub = this.songService
        .getSongUpdateListener()
        .subscribe((selectedSong: Song) => {
            this.selectedSong = selectedSong;
        })

        this.selectedSongSub = this.songService
        .getAlbumArtUrlUpdateListener()
        .subscribe((selectedSongAlbumArtUrl: string) => {
            this.selectedSongAlbumArtUrl = selectedSongAlbumArtUrl;
        })
    }

}