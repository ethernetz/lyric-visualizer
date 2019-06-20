import { Component, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../services/song.service';
import { Subject } from 'rxjs/Subject'; 
import { Subscription } from 'rxjs';
import { Song } from '../models/song.model'
import { SongOption } from '../models/song-option.model'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit{

    myForm: FormGroup;
    
    private songOptions: SongOption[] = [];
    private songOptionsSub: Subscription;

    private timeSinceLastKeypress: number = 0;

    constructor(private fb: FormBuilder, private songService: SongService) {}

    ngOnInit(){
        this.songOptionsSub = this.songService
        .getAutocompleteListener()
        .subscribe((songOptions: SongOption[]) => {
            this.songOptions = songOptions;
        })

        this.myForm = this.fb.group({
            searcbox: ['', [Validators.required, Validators.min(1)]]
        });

        this.searcbox.valueChanges.pipe(
            debounceTime(300),
        ).subscribe(searchterm => {
            if(this.searcbox.status == 'VALID'){
                this.search(searchterm);
            } else {
                this.clearSearchResults()
            }
        })
    }

    get searcbox() {
        return this.myForm.get('searcbox');
       } 

    search(searchterm: string) {
        this.songService.getAutocomplete(searchterm);
    }

    clearSearchResults() {
        this.songOptions = [];
    }

    fetchSong($event, song) {
        this.songService.getSong(song);
        console.log(song);
    }
    
}   