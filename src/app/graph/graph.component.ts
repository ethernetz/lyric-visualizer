import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { Song } from '../models/song.model';
import { SongOption } from '../models/song-option.model';
import { SongService } from '../services/song.service';
import { Link } from '../models/link.model';

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
    ) { }


    ngOnInit() {
        let starterSong: SongOption = {
            title: "Testify",
            artist: "Rage Against the Machine"
        }
        this.songService.getSong(starterSong);
        this.songService.getAlbumArt(starterSong);

        this.songSub = this.songService
            .getSongUpdateListener()
            .subscribe((song: Song) => {
                this.song = song
                d3.select("svg").remove();
                this.graphViz(this.song.lyrics);
            })
    }

    buildMatrix(lyrics: string[]): any {
        let lyrics_map: Map<string, number> = new Map();
        let point_set: Set<string> = new Set();
        let matrix: Array<Link> = new Array();
        for (let i = 0; i < lyrics.length; i++) {
            for (let j = 0; j < lyrics.length; j++) {
                if (lyrics[i].toUpperCase() === lyrics[j].toUpperCase()) {
                    point_set.add(i + "," + j);
                    let link: Link = {
                        id: lyrics[i],
                        x: i.toString(),
                        y: j.toString(),
                        weight: "0"
                    }
                    if (lyrics_map.has(lyrics[i])) {
                        lyrics_map.set(lyrics[i], lyrics_map.get(lyrics[i]) + 1);
                    } else {
                        lyrics_map.set(lyrics[i], 2)
                    }
                    link.weight = lyrics_map.get(lyrics[i]).toString();
                    matrix.push(link);
                }
            }
        }
        return { matrix: matrix, map: lyrics_map, set: point_set };
    }

    createFilter(svg) {
        let wrapper = svg.append("g");

        //Container for the gradients
        var defs = wrapper.append("defs");

        //Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
        //Filter for the outside glow
        var filter = defs.append("filter")
            .attr("id", "glow")
            .attr("width", "1000%")
            .attr("height", "1000%")
            .attr("x", "-450%")
            .attr("y", "-450%");

        for (var i = 0; i < 1; i++) {
            filter.append("feGaussianBlur")
                .attr("class", "blur")
                .attr("stdDeviation", 20)
                .attr("result", "coloredBlur");
        }


        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }

    drawRectangles(lyrics_array_length : number, initialWidth : number, result : Link[]) {
        let matrixScale = d3.scaleLinear().domain([0, lyrics_array_length]).range([0, initialWidth])
        var selection = d3.select("g")
            .append("g")
            .attr("id", "adjacencyG")
            .selectAll("rect")
            .data(result)
            .enter()
            .append("rect")
            .attr("width", matrixScale(1))
            .attr("height", matrixScale(1))
            .attr("class", "test-shadow")
            .attr("x", function (d) { return matrixScale(parseInt(d.x)) })
            .attr("y", function (d) { return matrixScale(parseInt(d.y)) })
            .attr("class", "exampleGlow")
            .style("fill", (d) => {
                return this.weightToColor();
            });

        d3.selectAll(".exampleGlow").style("filter", "url(#glow)");
    }

    graphViz(lyrics: string) {
        //Create initial graph HTML elements
        let graphStyle = window.getComputedStyle(document.getElementById('graph'))
        var initialWidth = parseFloat(graphStyle.width);
        var height = "100%";
        var width = "100%";
        var svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height);

        //Analyze data recieved
        let lyrics_array: string[] = lyrics.split(/\s+/);
        var matrix_data = this.buildMatrix(lyrics_array);
        let matrix: Link[] = matrix_data.matrix;
        let lyrics_map: Map<string, number> = matrix_data.map;
        let point_set: Set<string> = matrix_data.set;
        const result : Link[] = matrix.filter((element) => {
            let upper_point = (parseInt(element.x) + 1) + "," + (parseInt(element.y) + 1);
            let lower_point = (parseInt(element.x) - 1) + "," + (parseInt(element.y) - 1);
            return (point_set.has(upper_point) || point_set.has(lower_point));
        });

        //Create color filter
        this.createFilter(svg);
        this.drawRectangles(lyrics_array.length, initialWidth, result)
    }

    weightToColor(): string {
        let index = Math.floor((Math.random() * 5));
        let color_array: Array<string> = ["#FAFE09", "#FF00FF", "#01F4FF", "#0CD8AB", "#FF8704"]
        return color_array[index];
    }

}