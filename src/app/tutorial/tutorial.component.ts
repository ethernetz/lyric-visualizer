import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { animations } from './animations'



@Component({
    selector: 'app-tutorial-component',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss'],
    animations: animations,
})


export class TutorialComponent {
    constructor(private router: Router) { this.getScreenSize() }

    screenHeight: number;
    screenWidth: number;
    public gridLeftMargin: number;
    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        this.gridLeftMargin = 0.4 * this.screenWidth - 0.6 * this.screenHeight / 2
    }

    public progress: number = 0;
    public buttonMessage: string = "Continue!"
    @ViewChild('continueButton', { static: false }) continueButton: ElementRef;
    continueObs: Observable<any>;


    buttonActive: boolean = false;
    vidInProgress: boolean = false;
    animEnd(x) {
        if (x.fromState != "void" && x.toState != "void") {
            this.buttonActive = true;
        }
    }


    ngAfterViewInit() {
        fromEvent(this.continueButton.nativeElement, 'click').pipe(
            tap(_ => { !this.vidInProgress ? this.progress++ : this.finishVid() }),
            tap(_ => this.vidInProgress = this.progress == 1),
            tap(_ => {
                this.buttonActive = false
            }),
            take(3)
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
        if (!this.showHowTo) {
            this.progress = 2
        }
    }

    checkForPause(video) {
        if (this.vidInProgress && video.currentTime >= 3.5) {
            video.pause();
            this.buttonActive = true;
        }
    }

    finishVid() {
        let video = document.getElementById('video') as HTMLVideoElement
        this.vidInProgress = false
        video.play()
    }
    public gridImgPosition = 'middle'
    handleVidEnd() {
        var vid = document.getElementById('video');
        var imgReplacement = document.getElementById('imgReplacement');
        vid.style.display = 'none';
        imgReplacement.style.display = 'block';
        this.progress++
    }
    public bulletStatus: string = 'hide'
    imgMoveLeftdone() {
        this.bulletStatus = 'show'
    }

    dropPointsDone() {
        setTimeout(() => {
            if (this.bulletStatus == 'show') {
                this.buttonMessage = "I'm ready!"
                this.buttonActive = true
            }
        }, 3000)
    }


}