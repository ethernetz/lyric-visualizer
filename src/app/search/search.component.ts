import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Subject } from 'rxjs/Subject'; 
import { Subscription } from 'rxjs';
import { Song } from '../models/song.model'
import { SongOption } from '../models/song-option.model'

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit{

    private songOptions: SongOption[] = [];
    private songOptionsSub: Subscription;

    private timeSinceLastKeypress: number = 0;

    constructor(private songService: SongService) {}

    ngOnInit(){
        this.songOptionsSub = this.songService
        .getAutocompleteListener()
        .subscribe((songOptions: SongOption[]) => {
            this.songOptions = songOptions;
        })
    }

    search($keypress) {
        if ($keypress.timeStamp - this.timeSinceLastKeypress >= 0 ) {
            this.songService.getAutocomplete($keypress.target.value);
        }
        this.timeSinceLastKeypress = $keypress.timeStamp;
    }

    fetchSong($event, song) {
        this.songService.getSong(song);
        console.log(song);
    }
    
}   