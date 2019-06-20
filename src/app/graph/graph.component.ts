import { Component, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as scale from 'd3-scale';
import * as _ from 'lodash';

import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model';
import { SongService } from '../services/song.service';
import { Square } from '../models/square.model';
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
            album_title: "A Head Full of Dreams",
            album_art: "https://e-cdns-images.dzcdn.net/images/cover/5df065fdcbaffd0f83d09789bad9d2db/250x250-000000-80-0-0.jpg"
        }
        this.songService.getSong(starterSong);

        this.songSub = this.songService
        .getSongUpdateListener()
        .subscribe((song: Song) => {
            this.song = song
        })
    }
  
    ngAfterContentInit() {
        var margin = {
            top: 285,
            right: 0,
            bottom: 10,
            left: 285
        },
        width = 700,
        height = 700;
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
            let lyrics_matrix : Square[][] = [];
            let lyrics_map : Map<string, number[]> = new Map();
            let lyrics_set : Set<string> = new Set(_.uniq(lyrics));

            for (let i = 0; i < lyrics.length; i++) {
                lyrics_matrix[i] = [];
                for (let j = 0; j < lyrics.length; j++) {
                    lyrics_matrix[i][j] = new Square(i, j, false, lyrics[i]);
                }
            }

            lyrics_set.forEach((word, index) => {
                lyrics_map.set(word, lyrics.reduce((a, e, i) => (e === word) ? a.concat(i) : a, []));
            });

            lyrics_map.forEach((indicies, key) => {
                for (let i = 0; i < indicies.length; i++) {
                    for (let j = i; j < indicies.length; j++) {
                        lyrics_matrix[indicies[i]][indicies[j]].connection = true;
                        lyrics_matrix[indicies[j]][indicies[i]].connection = true;
                    }
                }
            });
            let size : number = lyrics.length;
            let matrixScale = d3.scaleBand().range([0, width]).domain(d3.range(size).map(number => number.toString()));
            var opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);
            var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            var rows = svg
                .selectAll(".row")
                .data(lyrics_matrix)
                .enter().append("g")
                .attr("class", "row")
                .attr("transform", (d, i) => {
                    return "translate(0," + matrixScale(i.toString()) + ")";
                });
                
            var squares = rows.selectAll(".cell")
                .data(d => d.filter(elem => elem.x >= elem.y))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", (d) => {
                    return matrixScale(d.y.toString())
                })
                .attr("width", matrixScale.bandwidth())
                .attr("height", matrixScale.bandwidth())
                .style("fill", d => {return lyrics[d.x] == lyrics[d.y] ? "red" : "grey"});

            // var columns = svg.selectAll(".column")
            //     .data(lyrics_matrix)
            //     .enter().append("g")
            //     .attr("class", "column")
            //     .attr("transform", (d, i) => {
            //         return "translate(" + matrixScale(i.toString()) + ")rotate(-90)";
            //     });
        });
    }
  

}