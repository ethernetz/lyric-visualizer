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
    ) { }


    ngOnInit() {
        let starterSong: SongOption = {
            title: "Hymn for the Weekend",
            artist: "Coldplay"
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

        let matrix: Array<Link> = new Array();
        for (let i = 0; i < lyrics.length; i++) {
            for (let j = 0; j < lyrics.length; j++) {
                let link: Link = {
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
        return {matrix: matrix, map: lyrics_map};
    }

    graphViz(lyrics: string) {

        let graphStyle = window.getComputedStyle(document.getElementById('graph'))
        var initialWidth = parseFloat(graphStyle.width);

        var height = "100%"; 
        var width = "100%";


        var svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height);

        let lyrics_array: string[] = lyrics.split(/\s+/);

        var matrix_data = this.buildMatrix(lyrics_array);
        let matrix: Link[] = matrix_data.matrix;

        let wrapper = svg.append("g");

        //Container for the gradients
        var defs = wrapper.append("defs");

        //Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
        //Filter for the outside glow
        var filter = defs.append("filter")
            .attr("id", "glow")
            .attr("width", "300%")
            .attr("height", "300%");


        filter.append("feGaussianBlur")
            .style("fill", "green")
            .attr("class", "blur")
            .attr("stdDeviation", "6")
            .attr("result", "coloredBlur");

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        const result = matrix.filter((element) => parseInt(element.weight));

        let matrixScale = d3.scaleLinear().domain([0, lyrics_array.length]).range([0, initialWidth])
        // console.log(d3.select('body').select('svg').node().getBBox())

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
        selection
            .attr("x", function (d) { return matrixScale(parseInt(d.x)) })
            .attr("y", function (d) { return matrixScale(parseInt(d.y)) })
            .attr("class", "exampleGlow")
            .style("fill", (d) => {
                return this.weightToColor();
            })




        d3.selectAll(".exampleGlow")
            .style("filter", "url(#glow)")
    }

    weightToColor() : string {
        let index = Math.floor((Math.random() * 5));
        let color_array : Array<string> = ["#FAFE09", "#FF00FF", "#01F4FF", "#0CD8AB", "#FF8704"]
        return color_array[index];
    }

}