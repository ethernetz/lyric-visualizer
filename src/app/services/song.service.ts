import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.model';
import { bindNodeCallback } from 'rxjs/Observable/bindNodeCallback';
import { switchMap } from 'rxjs/operators';
import { parseString } from 'xml2js';



@Injectable({providedIn: 'root'})
export class SongService{

    private song: Song; //Add interface 
    private songUpdated = new Subject<Song>(); //Add correct interface

    constructor(private http: HttpClient) {}
    
    getSong(artist: String, track: String) {
        this.http
        .get('http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=michael%20jackson&song=bad')
        .pipe(switchMap(res => bindNodeCallback(parseString)(res)))
        .subscribe((songAsJSON) => {
            console.log('test');
            console.log(songAsJSON);
        })

    }


    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}