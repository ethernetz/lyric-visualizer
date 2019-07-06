import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tutorial-component',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent implements OnInit {
    constructor(private router: Router){}

    public canContinue = false;

    ngOnInit() {
        const progressBar = document.getElementById('progress');
        const durationInSeconds = 15
        const duration = (durationInSeconds * 100) / 2;
        const progress = interval(20).pipe(
            map(progress => progress / duration),
            takeWhile(ratio => ratio <= 1)
        ).subscribe(
            ratio => { progressBar.style.width = ratio * 100 + '%' },
            error => { },
            () => {
                console.log('done!')
                this.canContinue = true
            }
        )
    }

    continue(){
        localStorage.setItem('new_user', 'false');
        this.router.navigate([''])
    }

}