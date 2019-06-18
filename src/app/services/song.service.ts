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
            console.log(this.song);
        });
    }

    toSong(selectedSong: SongOption, lyricsAsJSON): Song {
        let song: Song = {
            title: selectedSong.title,
            artist: selectedSong.artist,
            album_title: selectedSong.album_title,
            album_art: selectedSong.album_art,
            lyrics: lyricsAsJSON.lyrics
        }
        return song;
    }

    getAutocomplete(terms: String) {
        this.http.jsonp('https://api.deezer.com/search?output=jsonp&callback=JSONP_CALLBACK&limit=5&q=' + terms, 'JSONP_CALLBACK')
        .subscribe((songOptionsAsJSON) => {
            this.songOptions = this.toSongOptions(songOptionsAsJSON);
            this.songOptionsUpdated.next(this.songOptions);
        });
    }

    toSongOptions(songOptionsAsJSON): SongOption[]{
        let songOptions: SongOption[] = [];
        songOptionsAsJSON.data.forEach(songOptionData => {
           let songOption: SongOption = {
                title: songOptionData.title,
                artist: songOptionData.artist.name,
                album_title: songOptionData.album.title,
                album_art: songOptionData.album.cover_small,
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