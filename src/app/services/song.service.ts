import { Subject } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';


export class SongService{

    private song; //Add interface 
    private songUpdated = new Subject<String>(); //Add correct interface

    constructor(private http: HttpClient) {}
    
    getSong(artist: String, track: String){
        this.http.get<>('http://localhost3000/artist?track')
        .subscribe((songAsXml) => {
            songAsXml.convertToJSon()
            this.song = songAsJsonNow; 
            this.songUpdated.next(this.song);
        });
    }



    getSongUpdateListener() {
        return this.songUpdated.asObservable();
    }




}