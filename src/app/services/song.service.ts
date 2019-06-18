import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model'


@Injectable({providedIn: 'root'})
export class SongService{

    private songUpdated = new Subject<Song>();

    private songOptions: SongOption[];
    private songOptionsUpdated = new Subject<SongOption[]>();

    constructor(private http: HttpClient) {
    }
    
    getSong(artist: String, track: String) {
        this.http
        .get('https://api.lyrics.ovh/v1/' + artist + '/' + track)
        .subscribe((songAsJSON) => {
            console.log(songAsJSON);
            // this.songUpdated.next(songAsJSON);
        });
    }

    getAutocomplete(terms: String) {
        this.http.jsonp('https://api.deezer.com/search?output=jsonp&callback=JSONP_CALLBACK&limit=5&q=' + terms, 'JSONP_CALLBACK')
        .subscribe((songOptionsData) => {
            this.songOptions = this.toSongOptions(songOptionsData);
            this.songOptionsUpdated.next(this.songOptions);
        });
    }

    toSongOptions(songOptionsData){
        let songOptions: SongOption[] = [];
        songOptionsData.data.forEach(songOptionData => {
            console.log(songOptionData)
           let songOption: SongOption = {
                title: songOptionData.title,
                artist: songOptionData.artist.name,
                album_title: songOptionData.album.title,
                album_art: songOptionData.album.cover_small,
           };
           console.log(songOption);           
           songOptions.push(songOption);
        });
        return songOptions;
    }

    getAutocompleteListener() {
        return this.songOptionsUpdated.asObservable();
    }


    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}