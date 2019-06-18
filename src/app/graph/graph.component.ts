import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import * as d3 from "d3";


@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent {

    constructor(
  
        public songService: SongService
    ){}


    ngOnInit(){
        this.songService.getSong('Michael Jackson', 'Bad')
    }

}