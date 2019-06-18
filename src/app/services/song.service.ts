import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';



@Injectable({providedIn: 'root'})
export class SongService{

    private songUpdated = new Subject(); //Add correct interface

    private songOptionsUpdated = new Subject();

    constructor(private http: HttpClient) {
    }
    
    getSong(artist: String, track: String) {
        this.http
        .get('https://api.lyrics.ovh/v1/' + artist + '/' + track)
        .subscribe((songAsJSON) => {
            console.log(songAsJSON);
            this.songUpdated.next(songAsJSON);
        });
    }

    getAutocomplete(terms: String) {
        this.http.jsonp('https://api.deezer.com/search?output=jsonp&callback=JSONP_CALLBACK&limit=5&q=' + terms, 'JSONP_CALLBACK')
        .subscribe((data) => {
            this.songOptionsUpdated.next(data);
            console.log(data);
            //new songoptions: songOptionType (from the model)  = name: data[0].name,
            //songOptionsUpdated.next(songOptions)
        });
    }

    getAutocompleteListener() {
        return this.songOptionsUpdated.asObservable();
    }


    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}