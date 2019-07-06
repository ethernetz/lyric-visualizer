import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tutorial-component',
    templateUrl: './tutorial.component.html',
    styleUrls: []
})


export class TutorialComponent implements OnInit{

    ngOnInit(){
        localStorage.setItem('new_user', 'false');
    }

}