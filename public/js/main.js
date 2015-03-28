//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

//connect the synth to the master output channel
synth.toMaster();

// // 1. AUTO PLAY A NOTE EVERY QUARTER NOTE
// //create a callback which is invoked every quarter note
// Tone.Transport.setInterval(function(time){
//     //trigger middle C for the duration of an 8th note
//     synth.triggerAttackRelease("C4", "8n", time);
// }, "4n");

// //start the transport
// Tone.Transport.start();

//trigger the start of a note.
// synth.triggerAttack("C4");



// // 2. CONSOLE FUN: use the commands below in your browser console to trigger and release notes
// synth.triggerAttack("C4");
// synth.triggerRelease();

// // OR
// synth.triggerAttackRelease("C4", 0.25);

var socket = io.connect();
socket.emit('createBottle', { data : [{"note":"C4","noteLength":0.25},{"note":"D4","noteLength":0.25},{"note":"E4","noteLength":0.25}] });