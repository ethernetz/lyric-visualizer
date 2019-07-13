import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { animations } from './animations'

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

    public first_highlight: string = "closed"
    public first_text_highlight: string = "grey"
    first_fadeDropCompletion(){
        this.first_highlight = "open"
        this.first_text_highlight = "black"
    }



    ngAfterViewInit() {
        fromEvent(this.continueButton.nativeElement, 'click').pipe(
            map(_ => { this.progress++ }),
            take(5)
        ).subscribe(
            data => {},
            error => { },
            () => { this.router.navigate(['']) }
        );

    }


}