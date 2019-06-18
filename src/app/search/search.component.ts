import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Subject } from 'rxjs/Subject'; 


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

    songs;

    constructor(private songSearchService: SongService) {}


    ngOnInit(): void {
        this.songSearchService
            .getAutocomplete("Bad")
            .subscribe(songs => this.songs = songs);
    }

    search($event) {
        this.songSearchService.getAutocomplete($event.target.value);
    }
    
}