import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SongService } from '../../services/song.service';
import { PhraseData } from '../../models/phrase-data.model'

@Component({
    selector: 'app-hover-lyrics',
    templateUrl: './hover-lyrics.component.html',
    styleUrls: ['./hover-lyrics.component.scss']
})

export class HoverLyricsComponent implements OnInit { 

    @Input() hover_data;

    public hoveredLyrics: Observable<PhraseData>;

    ngOnInit() {

    }
}