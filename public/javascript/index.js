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

function onMIDImessage(messageData) {
  if (messageData.data == 254) {
    return;
  }
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData.data));
  newItem.className = 'user-midi';
  document.getElementById('midi-data').prepend(newItem);
}
