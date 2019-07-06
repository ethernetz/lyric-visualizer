import { Subject, Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model'
import { PhraseData } from '../models/phrase-data.model'
import { encode, decode } from '../info/LZW'
import { SongStatistics } from '../models/song-statistics.model';


@Injectable({ providedIn: 'root' })
export class SongService {

    private song: Song;
    public songUpdated = new Subject<Song>();
    public songErrorSubject = new Subject<boolean>();

    private songInfo: SongOption;
    public songInfoUpdated = new BehaviorSubject<SongOption>(null);

    private songOptions: SongOption[];
    public songOptionsUpdated = new Subject<SongOption[]>();

    private albumArtUrl: string;
    public albumArtUrlUpdated = new BehaviorSubject<string>(null);

    public songStatisticsUpdated = new BehaviorSubject<SongStatistics>(null)
    private lyricsHoverSubject = new BehaviorSubject<PhraseData>(null);


    constructor(private http: HttpClient) {
    }

    //Get Lyrics
    getSong(selectedSong: SongOption) {
        this.songUpdated.next(null);;
        this.lyricsHoverSubject.next(null);
        this.songStatisticsUpdated.next(null);
        this.songErrorSubject.next(false);
        this.updateSongInfo(selectedSong);
        this.updateAlbumArtUrl(selectedSong);
        this.http
            .get('https://api.lyrics.ovh/v1/' + selectedSong.artist + '/' + selectedSong.title)
            .subscribe(
                lyricsAsJSON => {
                    this.song = this.toSong(selectedSong, lyricsAsJSON);
                    this.songUpdated.next(this.song);
                    this.songStatisticsUpdated.next(this.calculateStatistics(this.song.lyrics));
                },
                error => {
                    this.songErrorSubject.next(true)
                }
            );
    }
    getSongObservable() {
        return this.songUpdated.asObservable();
    }
    getSongErrorObservable() {
        return this.songErrorSubject.asObservable();
    }


    //Gets album art
    updateAlbumArtUrl(selectedSong: SongOption) {
        this.albumArtUrlUpdated.next(null);
        this.http.jsonp('https://api.deezer.com/search?output=jsonp&callback=JSONP_CALLBACK&limit=1&q=' + selectedSong.title + " " + selectedSong.artist, 'JSONP_CALLBACK')
            .subscribe((songOptionsAsJSON: any) => {
                this.albumArtUrl = songOptionsAsJSON.data[0].album.cover_medium;
                this.albumArtUrlUpdated.next(this.albumArtUrl);
            })
    }
    getSongAlbumUrlObservable() {
        return this.albumArtUrlUpdated.asObservable();
    }

    updateLyrics(phrase: PhraseData) {
        this.lyricsHoverSubject.next(phrase);
    }

    //Lookup song from searchbar and get songInfo
    getAutocomplete(terms: String) {
        this.http.get('https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + terms + '&limit=5&api_key=49386e5f87311a82ff3de554345a8053&format=json')
            .subscribe((songOptionsAsJSON: any) => {
                this.songOptions = this.toSongOptions(songOptionsAsJSON);
                this.songOptionsUpdated.next(this.songOptions);
            });
    }
    getAutocompleteListener() {
        return this.songOptionsUpdated.asObservable();
    }

    //Lookup song from url parameters and get songInfo
    songLookup(track: string, artist: string) {
        return this.http.get('https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + track + '&artist=' + artist + '&limit=1&api_key=49386e5f87311a82ff3de554345a8053&format=json')
            .map(res => {
                return this.toSongOptions(res)[0];
            })
    }
    updateSongInfo(selectedSong: SongOption) {
        this.songInfo = selectedSong;
        this.songInfoUpdated.next(this.songInfo);
    }
    getSongInfoObservable() {
        return this.songInfoUpdated.asObservable();
    }


    //Get hovered lyrics from graph
    getHoveredLyricsObservable() {
        return this.lyricsHoverSubject.asObservable();
    }

    //Handle lyric api response
    toSong(selectedSong: SongOption, lyricsAsJSON): Song {
        let lyricsFromResponse: string = lyricsAsJSON.lyrics;
        const formatted_lyrics = lyricsFromResponse
            .replace(/\s/g, " ")
            .replace(/[^a-zA-Z0-9' ]/g, "")
            .split(" ")
            .reduce((filtered, word) => {
                if (word !== "") {
                    filtered.push(word.trim());
                }
                return filtered;
            }, [])
            .join(" ")
        let song: Song = {
            metadata: selectedSong,
            lyrics: formatted_lyrics
        }
        return song;
    }

    //Handle song lookup api response
    toSongOptions(songOptionsAsJSON): SongOption[] {
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

    getSongStatisticsObservable() {
        return this.songStatisticsUpdated.asObservable();
    }

    calculateStatistics(lyrics: string): SongStatistics {
        let encoded_string = encode(this.song.lyrics);
        let decoded_string = decode(encoded_string);
        let repetition_percentage = Math.floor(100 - (encoded_string.length / decoded_string.length) * 100);
        console.log(repetition_percentage)
        let statistics: SongStatistics = {
            repetition_percentage: repetition_percentage
        }
        return statistics;
    }


}