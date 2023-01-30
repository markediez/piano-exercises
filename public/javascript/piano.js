import { Notes } from './note.js'

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

    #buildScale(noteIndex, steps, octaves=1, descend=false) {
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

    majorScale(numberNote, octaves, descend) {
        // W W H W W W H
        return this.#buildScale(numberNote, [2, 2, 1, 2, 2, 2, 1], octaves, descend)
    }

    naturalMinorScale(numberNote, octaves, descend) {
        // Major Scale but 3b 6b 7b
        return this.#buildScale(numberNote, [2, 1, 2, 2, 1, 2, 2], octaves, descend)
    }

    bluesScale(numberNote, octaves, descend) {
        // Based on Major Scale: 1 3b 4 5b 5 7b
        return this.#buildScale(numberNote, [3, 2, 1, 1, 3, 2], octaves, descend)
    }

    pentatonicScale(numberNote, octaves, descend) {
        // 1 3 4 5 6
        return this.#buildScale(numberNote, [4, 1, 2, 2, 3], octaves, descend)
    }
}