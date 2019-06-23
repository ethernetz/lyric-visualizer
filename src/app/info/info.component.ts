import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { SongOption } from '../models/song-option.model';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit{
    constructor(private songService: SongService){}

    public selectedSongSub: Subscription;

    public songInfoObs: Observable<SongOption>;
    public songAlbumUrlObs: Observable<string>;

    public selectedSongAlbumArtUrl: string = null;
    public selectedSongAlbumArtUrlUpdated: Subscription;
    public defaultAlbumArtUrl: string = "https://ia802905.us.archive.org/29/items/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2-20937834816.jpg";
    
    ngOnInit(){
        this.songInfoObs = this.songService.getSongInfoObservable();
        this.songAlbumUrlObs = this.songService.getSongAlbumUrlObservable();
    
        
    }

}