import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Subject } from 'rxjs/Subject'; 
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

    songs;

    lastKeypress: number = 0;

    private autoCompleteSub: Subscription;

    constructor(private songSearchService: SongService) {}


    ngOnInit(): void {
        this.songSearchService
            .getAutocomplete("Bad");
        this.autoCompleteSub = this.songSearchService.getAutocompleteListener().subscribe((data) => this.songs = data);
        
    }

    search($event) {
        if ($event.timeStamp - this.lastKeypress > 500) {
            this.songSearchService.getAutocomplete($event.target.value);
        }
        this.lastKeypress = $event.timeStamp;
    }

    fetchSong($event, song) {
        this.songSearchService.getSong(song.artist.name, song.title);
        console.log(song);
    }
    
}   