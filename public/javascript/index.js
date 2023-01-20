// public/javascript/index.js
var context = new AudioContext();
var oscillators = {};
var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser");
}

function onMIDISuccess(midiData) {
  console.log(midiData);
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = onMIDImessage;
  }
}

function onMIDIFailure() {
  console.warn("Not finding a MIDI controller");
}

function toLetterNote(input) {
  const degree = input % 12;
  
  if (degree == 0) {
    return "C";
  } else if (degree == 1) {
    return "C#";
  } else if (degree == 2) {
    return "D";
  } else if (degree == 3) {
    return "D#";
  } else if (degree == 4) {
    return "E";
  } else if (degree == 5) {
    return "F";
  } else if (degree == 6) {
    return "F#";
  } else if (degree == 7) {
    return "G";
  } else if (degree == 8) {
    return "G#";
  } else if (degree == 9) {
    return "A";
  } else if (degree == 10) {
    return "A#";
  } else if (degree == 11) {
    return "B"
  } else {
    throw new Error("It shouldn't be possible to reach here");
  }
  
}

function toNumberNote(letterNote) {
  if (letterNote == "C") {
    return 0;
  } else if (letterNote == "C#" || letterNote == "Db") {
    return 1;
  } else if (letterNote == "D") {
    return 2;
  } else if (letterNote == "D#" || letterNote == "Eb") {
    return 3;
  } else if (letterNote == "E") {
    return 4;
  } else if (letterNote == "F") {
    return 5;
  } else if (letterNote == "F#" || letterNote == "Gb") {
    return 6;
  } else if (letterNote == "G") {
    return 7;
  } else if (letterNote == "G#" || letterNote == "Ab") {
    return 8;
  } else if (letterNote == "A") {
    return 9;
  } else if (letterNote == "A#" || letterNote == "Bb") {
    return 10;
  } else if (letterNote == "B") {
    return 11
  } else {
    throw new Error("It shouldn't be possible to reach here");
  }
}

function buildScale(rootNumber, steps) {
  let lastNote = rootNumber;
  let answer = [ lastNote ]
  
  steps.forEach(step => {
    lastNote += step;
    answer.push(lastNote);
  })

  return answer;
}

function getMajorScale(numberNote) {
  // W W H W W W H
  return buildScale(numberNote, [2, 2, 1, 2, 2, 2, 1])
}

function getNaturalMinorScale(numberNote) {
  // Major Scale but 3b 6b 7b
  return buildScale(numberNote, [2, 1, 2, 2, 1, 2, 2])
}

function getBluesScale(numberNote) {
  // Based on Major Scale: 1 3b 4 5b 5 7b
  return buildScale(numberNote, [3, 2, 1, 1, 3, 2])
}

function onMIDImessage(messageData) {
  var noteOn = messageData.data[0] 
  var note = messageData.data[1]
  var velocity = messageData.data[2];

  if (note === undefined) {
    // Something sent constantly by the midi that we don't care about
    return;
  }

  var letterNote = toLetterNote(note);

  var el = document.querySelector(`[data-note='${letterNote}']`)
  // Would use @noteOn instead of velocity... but noteOn is always 144 (on) for some midi keyboards
  if (velocity > 0) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
    addAnswer(letterNote)
  }
}

function addAnswer(note) {
  var newItem = document.createElement("li")
  newItem.appendChild(document.createTextNode(note));
  const el = document.getElementById("answer")

  if (el.children.length < 15) {
    el.append(newItem);
  }
}

function getExpectedAnswer() {
  let rootNote = document.getElementById("rootNote").value
  let scale = document.getElementById("scale").value
  let rootNoteNumber = toNumberNote(rootNote);
  let expectedAnswer = null;

  if (scale == "Major") {
    expectedAnswer = getMajorScale(rootNoteNumber);
  } else if (scale == "Natural Minor") {
    expectedAnswer = getNaturalMinorScale(rootNoteNumber);
  } else if (scale == "Blues") {
    expectedAnswer = getBluesScale(rootNoteNumber);
  } else { 
    throw new Error(`Scale '${scale}' is not implemented`);
  }

  let expectedAnswerInLetters = []
  expectedAnswer.forEach(noteNumber => {
    let letterNote = toLetterNote(noteNumber)
    expectedAnswerInLetters.push(letterNote);
  })

  return expectedAnswerInLetters
}

function compareNotes(scale1, scale2) {
  // Version 1 -- dumb check to be exactly the same
  let correct = true;
  if (scale1.length != scale2.length) {
    correct = false;
  }

  scale1.forEach((note, index) => {
    if (note != scale2[index]) {
      correct = false;
    }
  })

  return correct;
}

function checkAnswer() {
  let answer = []
  const el = document.getElementById("answer")
  const expectedAnswer = getExpectedAnswer()

  for (child of el.children) {
    answer.push(child.innerHTML);
  }

  console.log(answer);
  console.log(expectedAnswer);
  if (compareNotes(answer, expectedAnswer)) {
    document.getElementById("status").innerHTML = "Correct!"
  } else {
    document.getElementById("status").innerHTML = "Nope :("
  }
  
}

function clearAnswer() {
  document.getElementById("answer").replaceChildren();
  document.getElementById("status").innerHTML = "Waiting..."
}