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

function onMIDImessage(messageData) {
  if (messageData.data == 254) {
    return;
  }

  var noteOn = messageData.data[0] 
  var note = messageData.data[1]
  var velocity = messageData.data[2];

  var letterNote = toLetterNote(note);
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(letterNote));
  newItem.className = 'user-midi';
  document.getElementById('midi-data').prepend(newItem);
}
