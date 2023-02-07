// public/javascript/index.js
import { Piano, Scales, Modes } from './piano.js';
import { Notes } from './note.js';

// var context = new AudioContext();
// var oscillators = {};
var midi, data;
var piano = new Piano();

var PROMPT_NOTES = [];
var PROMPT_MODIFIERS = [];
var EXPECTED_ANSWER = [];
var CURRENT_ANSWER = [];

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
  let octaves = document.getElementById("octaves").value
  let descend = document.getElementById("descend").checked
  let rootNoteNumber = toNumberNote(rootNote);
  let expectedAnswer = null;
  let isFlat = rootNote.includes("b");

  if (scale == "Major") {
    expectedAnswer = piano.majorScale(rootNoteNumber, octaves, descend);
  } else if (scale == "Natural Minor") {
    expectedAnswer = piano.naturalMinorScale(rootNoteNumber, octaves, descend);
  } else if (scale == "Blues") {
    expectedAnswer = piano.bluesScale(rootNoteNumber, octaves, descend);
  } else if (scale == "Pentatonic") {
    expectedAnswer = piano.pentatonicScale(rootNoteNumber, octaves, descend);
  } else { 
    throw new Error(`Scale '${scale}' is not implemented`);
  }

  let expectedAnswerInLetters = []
  expectedAnswer.forEach(note => {
    if (isFlat) {
      expectedAnswerInLetters.push(note.toFlatString());
    } else {
      expectedAnswerInLetters.push(note.toSharpString());
    }
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

function addNotes(rootElement) {
  for (const key in Notes) {
    let value = Notes[key];
    let cbox = document.createElement("input");
    cbox.type = "checkbox";
    cbox.checked = false;
    cbox.value = value.toString();
    cbox.id = key;

    let cboxLabel = document.createElement("label");
    cboxLabel.htmlFor = key;
    cboxLabel.innerHTML = value.toString();
    
    
    rootElement.appendChild(cbox);
    rootElement.appendChild(cboxLabel);
  }
}

function addScales(rootElement) {
  for (const key in Scales) {
    let cbox = document.createElement("input");
    cbox.type = "checkbox";
    cbox.checked = false;
    cbox.value = key;
    cbox.id = key;

    let cboxLabel = document.createElement("label");
    cboxLabel.htmlFor = key;
    cboxLabel.innerHTML = key;
    
    
    rootElement.appendChild(cbox);
    rootElement.appendChild(cboxLabel);
  }
}

function addModes(rootElement) {
  for (const key in Modes) {
    let cbox = document.createElement("input");
    cbox.type = "checkbox";
    cbox.checked = false;
    cbox.value = key;
    cbox.id = key;

    let cboxLabel = document.createElement("label");
    cboxLabel.htmlFor = key;
    cboxLabel.innerHTML = key;
    
    
    rootElement.appendChild(cbox);
    rootElement.appendChild(cboxLabel);
  }
}

function nextPrompt() {
  let noteIndex = Math.floor(Math.random() * PROMPT_NOTES.length);
  let modifierIndex = Math.floor(Math.random() * PROMPT_MODIFIERS.length);
  let promptEl = document.getElementById("prompt");

  promptEl.dataset.note = PROMPT_NOTES[noteIndex];
  promptEl.dataset.type = PROMPT_MODIFIERS[modifierIndex];
  promptEl.innerHTML = `${promptEl.dataset.note} ${promptEl.dataset.type}`
}

function start() {
  const notes = document.getElementById("rootNotes").querySelectorAll('input[type="checkbox"]:checked');
  const scales = document.getElementById("scales").querySelectorAll('input[type="checkbox"]:checked');
  const modes = document.getElementById("modes").querySelectorAll('input[type="checkbox"]:checked');

  PROMPT_NOTES = []
  notes.forEach(note => PROMPT_NOTES.push(note.value));

  PROMPT_MODIFIERS = []
  scales.forEach(scale => PROMPT_MODIFIERS.push(scale.value));
  modes.forEach(mode => PROMPT_MODIFIERS.push(mode.value));

  nextPrompt();
}

window.start = start;
window.nextPrompt = nextPrompt;

window.onload = function() {
  addNotes(document.getElementById("rootNotes"));
  addScales(document.getElementById("scales"));
  addModes(document.getElementById("modes"));
}