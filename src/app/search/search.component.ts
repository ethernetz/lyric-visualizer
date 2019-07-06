import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../services/song.service';
import { Subscription } from 'rxjs';
import { SongOption } from '../models/song-option.model'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

    myForm: FormGroup;


    public songOptions: SongOption[] = [];
    private songOptionsSub: Subscription;

    constructor(private fb: FormBuilder, private songService: SongService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {

        if (this.router.url.startsWith('/search/')) {
            this.route.params.subscribe(params => {
                this.songService.songLookup(params.song, params.artist).subscribe(song => {
                    this.fetchSong(song);
                });
            })
        } else {
            let starterSong: SongOption = {
                title: "Radioactive",
                artist: "Imagine Dragons"
            }
            this.fetchSong(starterSong);
        }


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
            if (this.searchbox.status == 'VALID') {
                for (var i = 0; i < this.songOptions.length; i++) {
                    if (this.searchbox.value == this.songOptions[i].title + " - by " + this.songOptions[i].artist) {
                        let artistParam = encodeURIComponent(this.songOptions[i].artist.trim())
                        let trackParam = encodeURIComponent(this.songOptions[i].title.trim())
                        this.router.navigate(['/search', artistParam, trackParam])
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
        this.songService.getSong(song);
    }

}   