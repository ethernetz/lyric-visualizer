import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';
import { bindNodeCallback } from 'rxjs/Observable/bindNodeCallback';
import { switchMap } from 'rxjs/operators';
import { parseString } from 'xml2js';



@Injectable({providedIn: 'root'})
export class SongService{

    private song: Song; //Add interface 
    private songUpdated = new Subject<Song>(); //Add correct interface

    constructor(private http: HttpClient) {}

    createHeaders(headers: HttpHeaders) {
        headers.append('Accept', 'application/xml');
    }
    
    getSong(artist: String, track: String) {
        let headers = new HttpHeaders();
        this.createHeaders(headers);
        this.http
        .get('https://api.lyrics.ovh/v1/Michael Jackson/Bad')
        .subscribe((songAsJSON) => {
            console.log('test');
            console.log(songAsJSON);
        })

    }


    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}