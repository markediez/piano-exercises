class Note {
    constructor(letter, alias, number) {
        this.letter = letter;
        // Might not need alias...
        this.alias = alias; 
        this.number = number;
    }

    toString() {
        return this.letter;
    }

    toSharpString() {
        if (this.letter.includes('b')) {
            return this.alias;
        }

        return this.letter;
    }

    toFlatString() {
        if (this.letter.includes('#')) {
            return this.alias;
        }

        return this.letter;
    }

    equals(lhs) {
        return this.number == lhs.number;
    }
}

export const Notes = {
    "C": new Note("C", "C", 0),
    "C#": new Note("C#", "Db", 1),
    "Db": new Note("Db", "C#", 1),
    "D": new Note("D", "D", 2),
    "D#": new Note("D#", "Eb", 3),
    "Eb": new Note("Eb", "D#", 3),
    "E": new Note("E", "E", 4),
    "F": new Note("F", "F", 5),
    "F#": new Note("F#", "Gb", 6),
    "Gb": new Note("Gb", "F#", 6),
    "G": new Note("G", "G", 7),
    "G#": new Note("G#", "Ab", 8),
    "Ab": new Note("Ab", "G#", 8),
    "A": new Note("A", "A", 9),
    "A#": new Note("A#", "Bb", 10),
    "Bb": new Note("Bb", "A#", 10),
    "B": new Note("B", "B", 11)
}