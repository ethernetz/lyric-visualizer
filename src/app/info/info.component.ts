import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../services/song.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { SongOption } from '../models/song-option.model';
import { PhraseData } from '../models/phrase-data.model';
import { SongStatistics } from '../models/song-statistics.model';
import data from './songs.json';
import { faRandom, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit {
    constructor(private songService: SongService, private router: Router) { 
        this.changeLabel = true;
    }

    public changeLabel : boolean;
    public selectedSongSub: Subscription;
    public faRandom : IconDefinition = faRandom;
    public songInfoObs: Observable<SongOption>;
    public songAlbumUrlObs: Observable<string>;
    public songStatisticsObs: Observable<SongStatistics>

    public selectedSongAlbumArtUrl: string = null;
    public selectedSongAlbumArtUrlUpdated: Subscription;
    public defaultAlbumArtUrl: string = "https://ia802905.us.archive.org/29/items/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2/mbid-5e11c177-cc2c-4986-9332-26d7ef1285c2-20937834816.jpg";

    public hoveredLyrics: Observable<PhraseData>;

    ngOnInit() {
        this.songInfoObs = this.songService.getSongInfoObservable();
        this.songAlbumUrlObs = this.songService.getSongAlbumUrlObservable();
        this.songStatisticsObs = this.songService.getSongStatisticsObservable();
        this.hoveredLyrics = this.songService.getHoveredLyricsObservable();
    }

    fetchRandomSong() {
        let track : string[] = data.songs[Math.floor(Math.random()*data.songs.length)].split(";");
        let artistParam = encodeURIComponent(track[0])
                        let trackParam = encodeURIComponent(track[1])
                        this.router.navigate(['/search', artistParam, trackParam])
    }

}