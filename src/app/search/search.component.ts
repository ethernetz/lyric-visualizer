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
    private selectedAutocomplete: boolean = false;

    private timeSinceLastKeypress: number = 0;

    constructor(private fb: FormBuilder, private songService: SongService) {}

    ngOnInit(){
        this.songOptionsSub = this.songService
        .getAutocompleteListener()
        .subscribe((songOptions: SongOption[]) => {
            this.songOptions = songOptions;
        })

        this.myForm = this.fb.group({
            searchbox: ['', [Validators.required, Validators.min(1)]]
        });

        this.searchbox.valueChanges.pipe(
            debounceTime(50),
        ).subscribe(searchterm => {
            if(this.searchbox.status == 'VALID' && !this.selectedAutocomplete){
                this.search(searchterm);
            } else {
                this.selectedAutocomplete = false;
                this.clearSearchResults()
            }
        })
    }

    get searchbox() {
        return this.myForm.get('searchbox');
       } 

    search(searchterm: string) {
        this.songService.getAutocomplete(searchterm);
    }

    clearSearchResults() {
        this.songOptions = [];
    }

    fetchSong($event, song) {
        this.selectedAutocomplete = true;
        this.myForm.setValue({searchbox: song.title});
        this.clearSearchResults();
        this.songService.getSong(song);
        this.songService.getAlbumArt(song);
    }
    
}   