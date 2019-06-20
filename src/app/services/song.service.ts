import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model'


@Injectable({providedIn: 'root'})
export class SongService{

    private song: Song;
    private songUpdated = new Subject<Song>();

    private songOptions: SongOption[];
    private songOptionsUpdated = new Subject<SongOption[]>();

    constructor(private http: HttpClient) {
    }
    
    getSong(selectedSong: SongOption) {
        this.http
        .get('https://api.lyrics.ovh/v1/' + selectedSong.artist + '/' + selectedSong.title)
        .subscribe((lyricsAsJSON) => {
            this.song = this.toSong(selectedSong, lyricsAsJSON);
            this.songUpdated.next(this.song);
            console.log(this.song)
        });
    }

    toSong(selectedSong: SongOption, lyricsAsJSON): Song {
        let song: Song = {
            metadata: selectedSong,
            lyrics: lyricsAsJSON.lyrics
        }
        return song;
    }

    getAutocomplete(terms: String) {
        this.http.get('http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + terms + '&limit=5&api_key=49386e5f87311a82ff3de554345a8053&format=json')
        .subscribe((songOptionsAsJSON: any) => {
            this.songOptions = this.toSongOptions(songOptionsAsJSON);
            this.songOptionsUpdated.next(this.songOptions);
        });
    }

    toSongOptions(songOptionsAsJSON): SongOption[]{
        let songOptions: SongOption[] = [];
        songOptionsAsJSON.results.trackmatches.track.forEach(songOptionData => {
           let songOption: SongOption = {
                title: songOptionData.name,
                artist: songOptionData.artist,
           };
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