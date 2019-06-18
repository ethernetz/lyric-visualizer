import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model'



@Injectable({providedIn: 'root'})
export class SongService{

    private song: Array<Song>; //Add interface 
    private songUpdated = new Subject<Song>(); //Add correct interface

    constructor(private http: HttpClient) {}

    createHeaders(headers: HttpHeaders) {
        headers.append('Accept', 'application/xml');
    }
    
    getSong(artist: String, track: String) {
        let headers = new HttpHeaders();
        this.createHeaders(headers);
        this.http
        .get('https://api.lyrics.ovh/v1/' + artist + '/' + track)
        .subscribe((songAsJSON) => {
            console.log('test');
            console.log(songAsJSON);
        })

    }

    getAutocomplete(terms: String) {
        return this.http.get('http://api.deezer.com/search?limit=5&q=' + terms).pipe(map((res: Response) => res.json()));
    }


    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}