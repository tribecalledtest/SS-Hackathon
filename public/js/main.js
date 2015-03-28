//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

//connect the synth to the master output channel
synth.toMaster();

//create a callback which is invoked every quarter note
Tone.Transport.setInterval(function(time){
    //trigger middle C for the duration of an 8th note
    synth.triggerAttackRelease("C4", "8n", time);
}, "4n");

//start the transport
Tone.Transport.start();