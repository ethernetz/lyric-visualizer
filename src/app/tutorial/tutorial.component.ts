import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { animations } from './animations'
import * as d3 from 'd3';
import { style } from 'd3';


@Component({
    selector: 'app-tutorial-component',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss'],
    animations: animations,
})


export class TutorialComponent {
    constructor(private router: Router) { }

    public progress: number = 0;
    public state = 'hide'
    @ViewChild('continueButton', { static: false }) continueButton: ElementRef;
    continueObs: Observable<any>;


    buttonActive: boolean = false;
    animEnd(x) {
        if (x.fromState != "void" && x.toState != "void") {
            this.buttonActive = true;
        }
    }


    ngAfterViewInit() {
        fromEvent(this.continueButton.nativeElement, 'click').pipe(
            map(_ => { this.progress++ }),
            tap(_ => {
                this.buttonActive = false
            }),
            take(5)
        ).subscribe(
            data => { },
            error => { },
            () => { this.router.navigate(['']) }
        );

    }

    public first_highlight: string = "closed"
    public first_text_highlight: string = "grey"
    first_fadeDropCompletion() {
        this.first_highlight = "open"
        this.first_text_highlight = "black"
    }

    public showHowTo: boolean = true
    second_raiseHighlightDone() {
        this.showHowTo = false;
        this.first_highlight = 'closed';
        this.first_text_highlight = 'grey';

    }


    second_closeHighlightDone(x) {
        if (x.fromState != "void" && x.toState != "void") {
            document.getElementById('notGraph').style.display = "none";
        }

    }

}