import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SongService } from '../services/song.service';

@Component({
    selector: 'app-hover',
    templateUrl: './hover.component.html',
    styleUrls: ['./hover.component.scss']
})

export class HoverComponent implements OnInit {
    
    constructor(private songService: SongService) {}

    public hoveredLyrics: Observable<string>;

    ngOnInit() {
        this.hoveredLyrics = this.songService.getLyricsObservable();
    }
}