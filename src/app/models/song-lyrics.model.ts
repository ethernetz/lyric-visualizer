import { Link } from './link.model'

export class SongLyricsData {
    constructor(
        public lyrics: string,
        public lyrics_array: string[],
        public lyric_matrix: Link[],
        public lyric_frequency: Map<string, number>,
        public lyric_match_map: Map<string, string>
    ) { }
}