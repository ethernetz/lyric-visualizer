import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model'


@Injectable({providedIn: 'root'})
export class SongService{

    private song: Song;
    private songUpdated = new Subject<Song>();

    private songInfo: SongOption;
    private songInfoUpdated = new BehaviorSubject<SongOption>(null);

    private songOptions: SongOption[];
    private songOptionsUpdated = new Subject<SongOption[]>();

    private albumArtUrl: string;
    private albumArtUrlUpdated = new BehaviorSubject<string>(null);


    constructor(private http: HttpClient) {
    }
    
    getSong(selectedSong: SongOption) {
        this.updateSongInfo(selectedSong);
        this.updateAlbumArtUrl(selectedSong)
        this.http
        .get('https://api.lyrics.ovh/v1/' + selectedSong.artist + '/' + selectedSong.title)
        .subscribe((lyricsAsJSON) => {
            this.song = this.toSong(selectedSong, lyricsAsJSON);
            this.songUpdated.next(this.song);
        });
    }

    getAutocomplete(terms: String) {
        this.http.get('http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + terms + '&limit=5&api_key=49386e5f87311a82ff3de554345a8053&format=json')
        .subscribe((songOptionsAsJSON: any) => {
            this.songOptions = this.toSongOptions(songOptionsAsJSON);
            this.songOptionsUpdated.next(this.songOptions);
        });
    }

    
    updateAlbumArtUrl(selectedSong: SongOption){
        this.albumArtUrlUpdated.next(null);
        this.http.jsonp('https://api.deezer.com/search?output=jsonp&callback=JSONP_CALLBACK&limit=1&q=' + selectedSong.title + " " + selectedSong.artist, 'JSONP_CALLBACK')
        .subscribe((songOptionsAsJSON: any) => {
            this.albumArtUrl = songOptionsAsJSON.data[0].album.cover_medium;
            this.albumArtUrlUpdated.next(this.albumArtUrl);
        })
    }    

    getSongAlbumUrlObservable(){
        return this.albumArtUrlUpdated.asObservable();
    }    
    
    updateSongInfo(selectedSong: SongOption){
        this.songInfo = selectedSong;
        this.songInfoUpdated.next(this.songInfo);
    }    

    getSongInfoObservable(){
        return this.songInfoUpdated.asObservable();
    }


    toSong(selectedSong: SongOption, lyricsAsJSON): Song {
        let song: Song = {
            metadata: selectedSong,
            lyrics: lyricsAsJSON.lyrics
        }
        return song;
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