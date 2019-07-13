import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

    ngOnInit(): void {
        var string = "I'm a Barbie girl in a Barbie world".split(" ")
        var gridData = [];
        var size = 50;
        for(var i: number = 0; i < 8; i++) {
            gridData[i] = [];
            for(var j: number = 0; j< 8; j++) {
                gridData[i][j] = {
                    id: i * 10 + j + 1,
                    x: (j * 50) + 1 + 100,
                    y: (i * 50) + 1 + 100,
                    width: size,
                    height: size,
                    row_name: string[i],
                    col_name: string[j]
                }
                
            }
        }
        var x =  d3.scaleOrdinal().range([0, 8*50 + 1]);
        var grid = d3.select("#grid")
            .append("svg")
            .attr("width", "1000px")
            .attr("height", "1000px");
            
        var row = grid.selectAll(".row")
            .data(gridData)
            .enter().append("g")
            .attr("class", "row");

        var column = row.selectAll(".square")
            .data(function (d : any) { return d; })
            .enter().append("rect")
            .attr("class", "square")
            .attr("x", function (d : any) { return d.x; })
            .attr("y", function (d : any) { return d.y; })
            .attr("width", function (d : any) { return d.width; })
            .attr("height", function (d : any) { return d.height; })
            .style("fill", "#252425")
            .style("stroke", "grey");

        
    }

}