import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SongService } from '../../services/song.service';
import { PhraseData } from '../../models/phrase-data.model'

@Component({
    selector: 'app-hover-data',
    templateUrl: './hover-data.component.html',
    styleUrls: ['./hover-data.component.scss']
})

export class HoverDataComponent implements OnInit {

    @Input() phrase_repetitions;

    public hoveredLyrics: Observable<PhraseData>;

    ngOnInit() {

    }
}