import { Component } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';

import { Song } from '../models/song.model';
import { SongService } from '../services/song.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent {

    private songObs: Observable<Song>;
    private songErrorObs: Observable<boolean>;

    constructor(public songService: SongService){}


    ngOnInit() {
        this.songObs = this.songService.getSongObservable();
        this.songErrorObs = this.songService.getSongErrorObservable()
    }

    

}