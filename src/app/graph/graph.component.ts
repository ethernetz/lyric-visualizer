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

export class GraphComponent implements AfterContentInit {

    private songSub: Subscription;
    song: Song = null;

    constructor(
        public songService: SongService
    ){}


    ngOnInit() {
        let starterSong: SongOption = {
            title: "Hymn for the Weekend",
            artist: "Coldplay",
            // album_title: "A Head Full of Dreams",
            // album_art: "https://e-cdns-images.dzcdn.net/images/cover/5df065fdcbaffd0f83d09789bad9d2db/250x250-000000-80-0-0.jpg"
        }
        this.songService.getSong(starterSong);

        this.songSub = this.songService
        .getSongUpdateListener()
        .subscribe((song: Song) => {
            this.song = song
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
  
    ngAfterContentInit() {
        var margin = {
            top: 285,
            right: 0,
            bottom: 10,
            left: 285
        },
        width = window.innerWidth,
        height = window.innerHeight;
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

        d3.json("assets/data.json").then((data : Song) => {
            let lyrics : string[] = data.lyrics.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ");
            console.log(lyrics.length);

            let matrix : Link[] = this.buildMatrix(lyrics);
            
            console.log(matrix.length)
            const result = matrix.filter((element) => parseInt(element.weight));
            console.log(result.length)

            var selection = d3.select("svg")
                .append("g")
                .attr("id", "adjacencyG")
                .selectAll("rect")
                .data(result)
                .enter()
                .append("rect")
                .attr("width", 3)
                .attr("height", 3);
                selection
                .attr("x", function (d) {return parseInt(d.x) * 3})
                .attr("y", function (d) {return parseInt(d.y) * 3})
                .style("fill", "red")
                .style("fill-opacity", function (d) {return parseInt(d.weight) * .2})
       });
    }
  

}