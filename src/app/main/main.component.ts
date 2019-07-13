import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

    screenHeight: number;
    screenWidth: number;

    constructor() {
        this.getScreenSize();
    }

    ngOnInit(): void {
        var string = "I'm a Barbie girl in a Barbie world".split(" ")
        var gridData = [];
        var size = 60;
        for (var i: number = 0; i < 8; i++) {
            gridData[i] = [];
            for (var j: number = 0; j < 8; j++) {
                gridData[i][j] = {
                    id: i * 8 + j + 1,
                    i: i,
                    j: j,
                    x: (j * size) + 1 + 20,
                    y: (i * size) + 1 + 20,
                    width: size,
                    height: size,
                    row_name: string[i],
                    col_name: string[j]
                }

            }
        }

        var grid = d3.select("#grid")
            .append("svg")
            .attr("width", "590px")
            .attr("height", "590px")
            .attr("id", "grid-svg");

        //var filter = d3.select("#grid-svg").append("defs").append("filter").append("feFlood").attr("flood-color", "yellow").append("feComposite").attr()

        var row = grid.selectAll(".row")
            .data(gridData)
            .enter().append("g")
            .attr("class", "row");

        var column = row.selectAll(".square")
            .data(function (d: any) { return d; })
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", function (d: any) { return d.x; })
            .attr("y", function (d: any) { return d.y; })
            .attr("width", function (d: any) { return d.width; })
            .attr("height", function (d: any) { return d.height; })
            .style("fill", (d : any) => {
                if (d.i === d.j && (d.row_name != "a" || d.row_name == "Barbie")) {
                    return "grey"
                } else if (d.row_name === "Barbie" && d.col_name === "Barbie") {
                    return "#eb6774"
                } else if (d.col_name === "a" && d.row_name === "a") {
                    return "#34c8e9"
                } else {
                    return "#252425"
                }
            })
            .style("stroke", "grey");

        row.append("text").attr("x", 0).attr("y", 0).attr("dy", ".32em").attr("text-anchor", "middle").text((d, i) => { return d[i].row_name }).attr("style", (d, i) => {
            return `transform: translate(7px, ${d[i].y + 30}px)rotate(90deg); fill:white; font: 18px sans-serif;`;
        });

        row.append("text").attr("x", 0).attr("y", 0).attr("dy", ".32em").attr("text-anchor", "middle").text((d : any, i) => { return d[i].col_name }).attr("style", (d, i : any) => {
            return `transform: translate(${d[i].x + 30}px, 7px); fill:white; font: 18px sans-serif;`;
        });
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        console.log(this.screenHeight, this.screenWidth);
    }

}