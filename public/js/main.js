//create one of Tone's built-in synthesizers
//
$( document ).ready(function() {

    var synth = new Tone.MonoSynth();
    var noteCount = 0;

    var score = {"synth": []};


	//connect the synth to the master output channel
	synth.toMaster();


	function Note(note,noteLength){
		this.note = note;
		this.noteLength = noteLength;
	}

	$('.record-btn').on('click',function(){
		$('li').addClass('recording');
		$('.record-btn').addClass('recording');
		$('.record-btn').text('Recording');
	});

	$('.stop-btn').on('click',function(){
		$('.record-btn').removeClass('recording');
		$('.record-btn').text('Record');
		$('.play-btn').removeClass('playing');
		$('.play-btn').text('Play');
		Tone.Transport.stop();

	});

	$('.revert-btn').on('click',function(){
		score = {"synth": []};
		Tone.Transport.clearTimelines();

	});

	$('li').on('click', function(){

		if($(this).hasClass('recording')){
			var note = $(this).attr('id');

			score.synth.push(['0:'+noteCount++,note]);
		}

		});




	$('.play-btn').on('click',function(){
		 //parse the score into Notes
		Tone.Note.parseScore(score);
		$('.play-btn').addClass('playing');
		$('.play-btn').text('Playing');

		 //route all notes on the "synth" channel
		Tone.Note.route("synth", function(time, note){

	    	synth.triggerAttackRelease(note,"8n", time);
		});
		Tone.Transport.start();

	});


	});


	// 1. AUTO PLAY A NOTE EVERY QUARTER NOTE
	//create a callback which is invoked every quarter note



	// // 2. CONSOLE FUN: use the commands below in your browser console to trigger and release notes
	// synth.triggerAttack("C4");
	// synth.triggerRelease();

	// // OR
	//synth.triggerAttackRelease("C4", 0.25);


