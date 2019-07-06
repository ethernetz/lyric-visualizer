import { Pipe, PipeTransform } from '@angular/core';
import { PhraseData } from '../../models/phrase-data.model';
import * as _ from 'lodash';

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
            if (word_array[i][0].toUpperCase() === word_array[i][0] && this.shouldBreak(word_array[i])) {
                phrases.push(currentBar);
                currentBar = "";
            }
            currentBar += word_array[i] + " ";
            
        }
        phrases.push(currentBar);
        return {bars : phrases, phrase_data: lyrics}
    }

    shouldBreak(word : string): boolean {
        let words : string[] = ["i'm", "i", "i'll"];
        for (var i = 0; i < words.length; i++) {
            if (words[i] === word.toLowerCase()) {
                return false;
            }
        }
        return true;
    }
}