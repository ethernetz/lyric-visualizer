import { Component, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as scale from 'd3-scale';
import * as _ from 'lodash';

import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model';
import { SongService } from '../services/song.service';
import { Link } from '../models/Link.model';
import { ScaleBand } from 'd3';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent {

    private songSub: Subscription;
    song: Song = null;

    constructor(
        public songService: SongService
    ){}


    ngOnInit() {
        let starterSong: SongOption = {
            title: "Hymn for the Weekend",
            artist: "Coldplay"
        }
        this.songService.getSong(starterSong);

        this.songSub = this.songService
        .getSongUpdateListener()
        .subscribe((song: Song) => {
            this.song = song
            d3.select("svg").remove();
            this.graphViz(this.song.lyrics);
        })
    }

    buildMatrix(lyrics : string[]) : Array<Link> {
        let lyrics_map : Map<string, number> = new Map();
        
        let matrix : Array<Link> = new Array();
        for (let i = 0; i < lyrics.length; i++) {
            for (let j = 0; j < lyrics.length; j++) {
                let link : Link = {
                    id: "(" + lyrics[i] + " " + i.toString() + ", " + lyrics[j] + " " + j.toString() + ")",
                    x: i.toString(),
                    y: j.toString(),
                    weight: "0"
                }
                if (lyrics[i].toUpperCase() === lyrics[j].toUpperCase()) {
                    if (lyrics_map.has(lyrics[i])) {
                        lyrics_map.set(lyrics[i], lyrics_map.get(lyrics[i]) + 1);
                    } else {
                        lyrics_map.set(lyrics[i], 2)
                    }
                    link.weight = lyrics_map.get(lyrics[i]).toString();
                }
                matrix.push(link);
            }
        }
        console.log(matrix);
        return matrix;
    }
  
    graphViz(lyrics : string) {
        var margin = {
            top: 285,
            right: 0,
            bottom: 10,
            left: 285
        },
        width = 900,
        height = 900;
        var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
        svg.append("rect")
            .attr("class", "background")
            .attr("width", width - margin.right)
            .attr("height", height - margin.top)
            .attr("transform", "translate(" + margin.right + "," + margin.top + ")");
        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

            let lyrics_array : string[] = lyrics.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ");

            let matrix : Link[] = this.buildMatrix(lyrics_array);
            

            const result = matrix.filter((element) => parseInt(element.weight));

            let matrixScale = d3.scaleLinear().domain([0, lyrics_array.length]).range([0, width])

            var selection = d3.select("svg")
                .append("g")
                .attr("id", "adjacencyG")
                .selectAll("rect")
                .data(result)
                .enter()
                .append("rect")
                .attr("width", matrixScale(1))
                .attr("height", matrixScale(1))
                selection
                .attr("x", function (d) {return matrixScale(parseInt(d.x))})
                .attr("y", function (d) {return matrixScale(parseInt(d.y))})
                .style("fill", "red")
                .style("fill-opacity", function (d) {return parseInt(d.weight) * .2})
    }
  

}