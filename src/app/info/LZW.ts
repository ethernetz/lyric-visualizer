
export function encode(lyrics: string) {
    lyrics = lyrics.replace(/\s/g, " ").replace(/[^a-zA-Z0-9' ]/g, "");
    let dict: Map<string, string> = new Map<string, string>();
    let data = (lyrics + "").split("");
    let output: Array<number> = new Array<number>();
    let string_output: Array<string> = new Array<string>();
    let currentChar: string;
    let phrase = data[0];
    let code: number = 256;
    for (var i = 1; i < data.length; i++) {
        currentChar = data[i];
        if (dict[phrase + currentChar] != null) {
            phrase += currentChar;
        } else {
            output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currentChar] = code;
            code++;
            phrase = currentChar;
        }
    }
    output.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i = 0; i < output.length; i++) {
        string_output.push(String.fromCharCode(output[i]));
    }
    return string_output.join("");
}

export function decode(lyrics: string) {
    let dict: Map<string, string> = new Map<string, string>();
    let data = (lyrics + "").split("");
    let currentChar: string;
    let oldPhrase: string = currentChar;
    let output: Array<string> = [currentChar];
    let code: number = 256;
    let phrase: string = data[0];
    for (var i = 1; i < data.length; i++) {
        var currentCode: number = data[i].charCodeAt(0);
        if (currentCode < 256) {
            phrase = data[i];
        } else {
            phrase = dict[currentCode] ? dict[currentCode] : (oldPhrase + currentChar);
        }
        output.push(phrase);
        currentChar = phrase.charAt(0);
        dict[code] = oldPhrase + currentChar;
        code++;
        oldPhrase = phrase;
    }
    return output.join("");
}