import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Link } from '../../models/link.model';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SongLyricsData } from '../../models/song-lyrics.model';
import { PhraseData } from '../../models/phrase-data.model';
import { SongService } from '../../services/song.service';

@Component({
    selector: 'app-graph-display',
    templateUrl: './graph-display.component.html'
})

export class GraphDisplayComponent implements OnInit {

    public lyric_data: SongLyricsData;

    constructor(private songService: SongService) {}

    @Input() lyrics: string;
    private sorted_lyrics_map;

    ngOnInit() {
        d3.select("svg").remove();
        this.graphViz(this.lyrics);
    }

    ngOnChanges(changes: SimpleChanges) {
        d3.select("svg").remove();
        this.graphViz(changes.lyrics.currentValue);
    }

    graphViz(lyrics: string) {
        //Create initial graph HTML elements
        let graphStyle = window.getComputedStyle(document.getElementById('graph'))
        var initialWidth = parseFloat(graphStyle.width);
        var height = "100%";
        var width = "100%";
        var svg = d3.select("#graph-display").append("svg").attr("width", width).attr("height", height).call(d3.zoom().scaleExtent([1, 2]).on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }));

        //Analyze data recieved
        let lyrics_array: string[] = lyrics.split(/\s+/);
        var matrix_data = this.buildMatrix(lyrics_array);
        let matrix: Link[] = matrix_data.matrix;
        let lyrics_map: Map<string, number> = matrix_data.map;
        this.sorted_lyrics_map = new Map([...lyrics_map.entries()].sort((a, b) => b[1] - a[1]));
        let point_map: Map<string, string> = matrix_data.point_map;
        const result: Link[] = matrix.filter((element) => {
            let upper_point = (parseInt(element.x) + 1) + "," + (parseInt(element.y) + 1);
            let lower_point = (parseInt(element.x) - 1) + "," + (parseInt(element.y) - 1);
            return (point_map.has(upper_point) || point_map.has(lower_point));
        });

        this.lyric_data = new SongLyricsData(lyrics, lyrics_array, result, lyrics_map, point_map);


        //Create color filter
        this.createFilter(svg);
        this.drawRectangles(initialWidth);
    }

    getDiagonalPhrase(point: string): string {
        let phrase: Array<string> = new Array();
        let x: number = parseInt(point.split(",")[0]);
        let y: number = parseInt(point.split(",")[1]);
        while (this.lyric_data.lyric_match_map.has(x + "," + y)) {
            phrase.push(this.lyric_data.lyric_match_map.get(x + "," + y));
            x--;
            y--;
        }

        let phrase_string: string = "";
        for (let i = phrase.length - 1; i >= 0; i--) {
            phrase_string += phrase[i];
            phrase_string += " ";
        }
        x = parseInt(point.split(",")[0]) + 1;
        y = parseInt(point.split(",")[1]) + 1;
        while (this.lyric_data.lyric_match_map.has(x + "," + y)) {
            phrase_string += this.lyric_data.lyric_match_map.get(x + "," + y);
            phrase_string += " ";
            x++;
            y++;
        }
        return phrase_string.trim();
    }

    getRepetitions(phrase: string): number {
        let length = phrase.split(" ").length;
        let repetitions: number = 0;
        this.lyric_data.lyrics_array.forEach((word, index) => {
            if (index + length >= this.lyric_data.lyrics_array.length) {
                return;
            }
            let string_comp : string = this.lyric_data.lyrics_array
            .slice(index, index + length)
            .join(" ").toLowerCase();
            if (string_comp === phrase.toLowerCase()) {
                repetitions++;
            }
             
        });
        return repetitions;
    }

    buildMatrix(lyrics: string[]): any {
        let lyrics_map: Map<string, number> = new Map();
        let point_map: Map<string, string> = new Map();
        let matrix: Array<Link> = new Array();
        for (let i = 0; i < lyrics.length; i++) {
            if (lyrics_map.has(lyrics[i])) {
                lyrics_map.set(lyrics[i], lyrics_map.get(lyrics[i]) + 1);
            } else {
                lyrics_map.set(lyrics[i], 1);
            }
            for (let j = 0; j < lyrics.length; j++) {
                if (lyrics[i].toUpperCase() === lyrics[j].toUpperCase()) {
                    point_map.set(i + "," + j, lyrics[i]);
                    let link: Link = {
                        id: lyrics[i],
                        x: i.toString(),
                        y: j.toString(),
                        weight: "0"
                    }
                    link.weight = lyrics_map.get(lyrics[i]).toString();
                    matrix.push(link);
                }
            }
        }
        return { matrix: matrix, map: lyrics_map, point_map: point_map };
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
                .attr("stdDeviation", 1)
                .attr("result", "coloredBlur");
        }

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }

    drawRectangles(initialWidth: number) {
        var tooltip = d3.select("#graph")
            .append("div")
            .attr('class', 'tooltip');
        let matrixScale = d3.scaleLinear().domain([0, this.lyric_data.lyrics_array.length]).range([0, initialWidth])
        var selection = d3.select("g")
            .append("g")
            .attr("id", "adjacencyG")
            .selectAll("rect")
            .data(this.lyric_data.lyric_matrix)
            .enter()
            .append("rect")
            .attr("width", matrixScale(1))
            .attr("height", matrixScale(1))
            .attr("class", "test-shadow")
            .attr("x", function (d) { return matrixScale(parseInt(d.x)) })
            .attr("y", function (d) { return matrixScale(parseInt(d.y)) })
            .attr("class", "exampleGlow")
            .style("fill", (d) => {
                return this.idToColor(d.id);
            }).on("mouseover", (d) => {
                let phrase : string = this.getDiagonalPhrase(d.x + "," + d.y);
                let repetitions = this.getRepetitions(phrase);
                
                if (d.x !== d.y) {
                    this.songService.updateLyrics(new PhraseData(phrase, repetitions, d.id));
                }
                return null;
            })

            // we move tooltip during of "mousemove"

            .on("mousemove", function () {

                // eslint-disable-next-line no-restricted-globals
                return tooltip.style("top", (d3.event.pageY - 50) + "px")
                    // eslint-disable-next-line no-restricted-globals
                    .style("left", d3.event.pageX + "px");
            })

            // we hide our tooltip on "mouseout"

            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        d3.selectAll(".exampleGlow").style("filter", "url(#glow)");
    }

    idToColor(id: string): string {
        let i = 0;
        let color: string = null;
        this.sorted_lyrics_map.forEach((value: number, key: string) => {
            if (key == id && i < 3) {
                let color_array: Array<string> = ["#FF00FF", "#01F4FF", "#0CD8AB", "#FF8704"]
                color = color_array[i];
            }
            i++;
        })
        return color ? color : "#FAFE09";
    }
}