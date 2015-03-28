//create one of Tone's built-in synthesizers
//
$( document ).ready(function() {
	console.log( "Document ready!" );
    var socket = io.connect();
	console.log("Sockets on for client");

    var synth = new Tone.MonoSynth();
    var noteCount = 0;

    var score = {"synth": []};
    var receivedScoreCopy = null; // this is a backup copy of a received bottle's score for reverting from a bad recording
    var updateId = null;
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
		if (receivedScoreCopy) {
			score = receivedScoreCopy;
			noteCount = receivedScoreCopy.synth.length;

		}
		else {
			score = {"synth": []};
		}

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

		Tone.Transport.clearTimelines();
		Tone.Note.parseScore(score);
		$('.play-btn').addClass('playing');
		$('.play-btn').text('Playing');

		
		 //route all notes on the "synth" channel

		Tone.Note.route("synth", function(time, note){

	    	synth.triggerAttackRelease(note,"8n", time);
		});

		Tone.Transport.start();

	});


	$(".save-btn").on("click", function() {
		console.log('saving',score);
		if (updateId) {
			socket.emit('save',{type: score, updateId : updateId});
		} else {
			socket.emit('save',{type: score});
		}
		// socket.emit("save", score); // this will go inside the listener for a click on the SEND button
		score = {'synth':[]};
		$('#KeyRack').css('border-color', 'red');
		$('.avail-btn').removeAttr('disabled');
        $('.noavail-btn').attr('disabled', 'disabled');
	});


	$(".avail-btn").on('click', function() {
        socket.emit('avail');
        $('#KeyRack').css('border-color', 'green');
        $('.noavail-btn').removeAttr('disabled');
        $('.avail-btn').attr('disabled', 'disabled');
    });

    $(".noavail-btn").on('click', function() {
        socket.emit('notavail');
        $('#KeyRack').css('border-color', 'red');
        $('.avail-btn').removeAttr('disabled');
        $('.noavail-btn').attr('disabled', 'disabled');
    });


	socket.on("receive", function(receivedScore) {

		alert('you got a bottle id: ' + receivedScore._id);
		score = receivedScore.bottle;
		noteCount = receivedScore.bottle.synth.length;
		receivedScoreCopy = receivedScore.bottle;
		updateId = receivedScore._id;
	});
});
