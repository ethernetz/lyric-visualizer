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
            debounceTime(300),
        ).subscribe(searchterm => {
            if(this.searchbox.status == 'VALID'){
                for(var i = 0; i < this.songOptions.length; i++){
                    if(this.searchbox.value == this.songOptions[i].title + " - by " + this.songOptions[i].artist){
                        this.fetchSong(this.songOptions[i]);
                    }
                }
                this.search(searchterm);
            } else {
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

    fetchSong(song) {
        console.log('fetching...')
        this.selectedAutocomplete = true;
        // this.myForm.setValue({searchbox: song.title});
        this.clearSearchResults();
        this.songService.getSong(song);
        this.songService.getAlbumArt(song);
    }
    
}   