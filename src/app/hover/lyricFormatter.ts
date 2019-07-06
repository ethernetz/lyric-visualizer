import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "lyricFormatter"})
export class LyricFormatter implements PipeTransform {
    transform(lyrics : string) {
        let word_array : Array<string> = lyrics.split(" ");
        let currentBar : string = "";
        let phrases : Array<String> = new Array<string>();
        if (word_array.length > 30) {
            return ""
        }
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
        return phrases
    }
}