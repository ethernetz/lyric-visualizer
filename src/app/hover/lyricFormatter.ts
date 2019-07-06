import { Pipe, PipeTransform } from '@angular/core';
import { PhraseData } from '../models/phrase-data.model';

@Pipe({name: "lyricFormatter"})
export class LyricFormatter implements PipeTransform {
    transform(lyrics : PhraseData) {
        if (!lyrics) {
            return false;
        }
        let word_array : Array<string> = lyrics.phrase.split(" ");
        let currentBar : string = "";
        let phrases : Array<String> = new Array<string>();
        for (var i = 0; i < word_array.length; i++) {
            if (word_array[i].trim() === "") {
                continue;
            }
            if (word_array[i][0].toUpperCase() === word_array[i][0] && word_array[i].length >= 4) {
                phrases.push(currentBar);
                currentBar = "";
            }
            currentBar += word_array[i] + " ";
            
        }
        phrases.push(currentBar);
        return {bars : phrases, phrase_data: lyrics}
    }
}