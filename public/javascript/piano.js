import { Notes } from './note.js'

export const Patterns = {
    // W W H W W W H
    Major: [2, 2, 1, 2, 2, 2, 1],
    // major but 3b 6b 7b
    NaturalMinor: [2, 1, 2, 2, 1, 2, 2],
    // major but 1 3b 4 5b 5 7b
    MinorBlues: [3, 2, 1, 1, 3, 2],
    // major but 1 3 4 5 6
    Pentatonic: [4, 1, 2, 2, 3],

    // Natural Minor
    Aeolian: [2, 1, 2, 2, 1, 2, 2]
}

export class Piano {
    constructor() {
        this.keys = [
            Notes.C,
            Notes.CSharp,
            Notes.D,
            Notes.DSharp,
            Notes.E,
            Notes.F,
            Notes.FSharp,
            Notes.G,
            Notes.GSharp,
            Notes.A,
            Notes.ASharp,
            Notes.B
        ]
    }

    buildScale(noteIndex, steps, octaves=1, descend=false) {
        let lastNoteIndex = noteIndex;
        let answer = [ this.keys[lastNoteIndex] ]
        
        for (let i = 0; i < octaves; i++) {
            steps.forEach(step => {
                lastNoteIndex += step;
                lastNoteIndex %= 12;
                answer.push(this.keys[lastNoteIndex]);
            })
        }

        if (descend) {
            const descendingSteps = steps.slice().reverse();
        
            for (let i = 0; i < octaves; i++) {
                descendingSteps.forEach(step => {
                    lastNoteIndex -= step;
                    if (lastNoteIndex < 0) {
                        lastNoteIndex += 12;
                    }

                    lastNoteIndex %= 12;
                    answer.push(this.keys[lastNoteIndex]);
                })
            }
        }
    
        return answer;
    }
}