//create one of Tone's built-in synthesizers
//
$( document ).ready(function() {
    console.log( "ready!" );
    var synth = new Tone.MonoSynth();

	//connect the synth to the master output channel
	synth.toMaster();
	function Note(note,noteLength){
		this.note = note;
		this.noteLength = noteLength;
	}


	$('.play-btn').on('click', function(){
		console.log("PLAY");
		var noteArr = [new Note('C4',0.25), new Note('D4',0.25), new Note('E4',0.25) ];
		var count =0;
		noteArr.forEach(function(noteObj){
			count++;
			var note = noteObj.note;
			var noteLength = noteObj.noteLength;
			console.log(note,noteLength);

			synth.triggerAttackRelease(note, noteLength, count*noteLength*2);
		});
	});

	// Tone.Transport.setInterval(function(time){
 //    //trigger middle C for the duration of an 8th note
 //    	synth.triggerAttackRelease("C4", "8n", time);
	// }, "8n");


	var socket = io.connect();	
	
});
