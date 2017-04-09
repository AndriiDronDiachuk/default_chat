var socket = null;
var currentUser = null;

var $username = $('#username-box');
var $login = $('#login');
var $container = $('#container');
var $settings = $('#settings');
var userList = $('#user');
var $message = $('#speech-msg');
var $messages = $('#messages');

$('#form-username').submit(function(event) {
  event.preventDefault();

  if ($username.val() == '')
    return;

  socket = io();

  socket.emit('user changed', $username.val());
  currentUser = $username.val();
  $username.val('');
  $login.slideUp('fast');
  $container.slideDown('fast');
  $settings.slideDown('fast')
  $message.focus();

  socket.on('user changed', function (data) {
    var list = '';

    data.users = data.users.filter(function(index) {
      return index != currentUser;
    });

    if (data.users.length > 0) {
      for (var  i = 0; i < data.users.length; i++){
        list+= '<li class="list-group-item list-group-item-success text-center center-block">'+data.users[i]+'</li>';
      }
    }
    if (list == '')
      list+= '<li class="list-group-item list-group-item-danger text-center center-block">You are alone here</li>';

    userList.html(list);
    list = '';
  });

  socket.on('send message', function (data) {
    $messages.append('<li class="list-group-item"><b>'+data.from+': </b>'+data.message+'</li>');
  });


});


$('#inputbox').submit(function(event) {
  event.preventDefault();
  $messages.append('<li class="list-group-item"><b>'+currentUser+': </b>'+$message.val()+'</li>');
  var sendObj = {
    from: currentUser,
    message: $message.val()
  };
  //console.log(sendObj);
  socket.emit('send message', sendObj);
  $message.val('');

  $('#send-punch').click(function(){
    var punch = $('#message').val();
    $('#punches').append(`
      <li class="list-group-item">${punch}</li>
    `);
    var txtToSpeech = responsiveVoice.speak("" + punch + "");
    //console.log(txtToSpeech);

  });

});


var supportMsg = document.getElementById('msg');

// Get the 'speak' button
var button = document.getElementById('speak');

// Get the text input element.
var speechMsgInput = document.getElementById('speech-msg');

// Get the voice select element.
var voiceSelect = document.getElementById('voice');

// Get the attribute controls.
var volumeInput = document.getElementById('volume');
var rateInput = document.getElementById('rate');
var pitchInput = document.getElementById('pitch');


// Fetch the list of voices and populate the voice options.
function loadVoices() {
  // Fetch the available voices.
	var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
	voices.forEach(function(voice, i) {
    // Create a new option element.
		var option = document.createElement('option');
    
    // Set the options value and text.
		option.value = voice.name;
		option.innerHTML = voice.name;
		  
    // Add the option to the voice selector.
		voiceSelect.appendChild(option);
	});
}

// Execute loadVoices.
loadVoices();

// Chrome loads voices asynchronously.
window.speechSynthesis.onvoiceschanged = function(e) {
  loadVoices();
};


// Create a new utterance for the specified text and add it to
// the queue.
function speak(text) {
  // Create a new instance of SpeechSynthesisUtterance.
	var msg = new SpeechSynthesisUtterance();
  
  // Set the text.
	msg.text = text;
  
  // Set the attributes.
	msg.volume = parseFloat(volumeInput.value);
	msg.rate = parseFloat(rateInput.value);
	msg.pitch = parseFloat(pitchInput.value);
  
  // If a voice has been selected, find the voice and set the
  // utterance instance's voice attribute.
	if (voiceSelect.value) {
		msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelect.value; })[0];
	}
  
  // Queue this utterance.
	window.speechSynthesis.speak(msg);
}

var button = document.getElementById('speak');

// Set up an event listener for when the 'speak' button is clicked.
button.addEventListener('click', function(e) {
	if (speechMsgInput.value.length > 0) {
		speak(speechMsgInput.value);
    console.log(speak(speechMsgInput.value));
    var audio = document.getElementById('beat');
    if (audio.paused){
      audio.play();
    }
    else{
      audio.pause();
      audio.currentTime = 0;
    }
	}
});

