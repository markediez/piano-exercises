// public/javascript/index.js
import { Piano, Patterns } from './piano.js';
import { Notes } from './note.js';

// var context = new AudioContext();
// var oscillators = {};
var midi, data;
var piano = new Piano();

var PROMPT_NOTES = [];
var PROMPT_MODIFIERS = [];
var EXPECTED_ANSWER = [];

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

function onMIDImessage(messageData) {
  var noteOn = messageData.data[0] 
  var input = messageData.data[1]
  var velocity = messageData.data[2];

  if (input === undefined) {
    // Something sent constantly by the midi that we don't care about
    return;
  }

  var note = piano.keys[input % 12];

  var el = document.querySelector(`[data-note='${note.letter}']`)
  // Would use @noteOn instead of velocity... but noteOn is always 144 (on) for some midi keyboards
  if (velocity > 0) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
    addAnswer(note)
  }
}

function clearAnswer() {
  const el = document.getElementById("answer");
  while (el.firstChild) {
    el.removeChild(el.lastChild);
  }
}

function addAnswer(note) {
  const el = document.getElementById("answer")
  if (el.children.length == EXPECTED_ANSWER.length) {
    nextPrompt();
    return;
  }
  const answerIndex = el.lastChild && el.lastChild.classList.contains("danger") ? el.children.length - 1 : el.children.length;
  const expectedNote = EXPECTED_ANSWER[answerIndex];
  
  var newItem = document.createElement("li")
  if (note.equals(expectedNote)) {
    newItem.appendChild(document.createTextNode(expectedNote.letter));
  } else {
    newItem.classList.add("danger");
    newItem.appendChild(document.createTextNode(note.letter));
  }

  if (el.lastChild && el.lastChild.classList.contains("danger")) {
    el.removeChild(el.lastChild)
  }
  el.append(newItem);
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

function addPatterns(rootElement) {
  for (const key in Patterns) {
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

function setExpected(note, pattern, octaves, descend) {
  EXPECTED_ANSWER = piano.buildScale(Notes[note].number, Patterns[pattern], octaves, descend);
}

function nextPrompt() {
  let noteIndex = Math.floor(Math.random() * PROMPT_NOTES.length);
  let modifierIndex = Math.floor(Math.random() * PROMPT_MODIFIERS.length);
  let promptEl = document.getElementById("prompt");
  let octaves = document.getElementById("octaves").value
  let descend = document.getElementById("descend").checked

  promptEl.dataset.note = PROMPT_NOTES[noteIndex];
  promptEl.dataset.pattern = PROMPT_MODIFIERS[modifierIndex];
  promptEl.innerHTML = `${promptEl.dataset.note} ${promptEl.dataset.pattern}`

  clearAnswer();
  setExpected(promptEl.dataset.note, promptEl.dataset.pattern, octaves, descend);
}

function start() {
  const notes = document.getElementById("rootNotes").querySelectorAll('input[type="checkbox"]:checked');
  const patterns = document.getElementById("patterns").querySelectorAll('input[type="checkbox"]:checked');

  PROMPT_NOTES = []
  notes.forEach(note => PROMPT_NOTES.push(note.value));

  PROMPT_MODIFIERS = []
  patterns.forEach(scale => PROMPT_MODIFIERS.push(scale.value));

  nextPrompt();
}

window.start = start;
window.nextPrompt = nextPrompt;

window.onload = function() {
  addNotes(document.getElementById("rootNotes"));
  addPatterns(document.getElementById("patterns"));
}