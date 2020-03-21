//  CLIENT SIDE

$(document).ready(function(){


  /////////////////////////////////////////////////
  // setting up the game
  //////////////////////////////////////////////////
  // since both participants undergo the same trial
  // we'll need to set up the random variables once
  // and share them between the participants
  
  socket = io({reconnection: false}); // we pass here the global io variable (it comes from the views/group.ejs one of the scripts at the bottom of the file (socket.io.js))
  // getting trial data from server
  socket.on('trialDataBackToClient', data =>{
// debugger
    rules = data.rules;
    rand_trial = data.rand_trial;
    examples = data.examples;
    test_cases = data.test_cases;
    rule_names = data.rule_names;
    rand_counter = data.rand_counter;

    var iframe = document.getElementById("game_frame");
    document.getElementById('game').style.visibility = "visible";

    if (iframe) {
        var iframeContent = (iframe.contentWindow || iframe.contentDocument);
        try {
          iframeContent.Start(rules[rand_trial], examples, test_cases, rule_names[rand_trial], rand_counter);
        }
        catch(err) {

          location.reload();
        } // closing catch


  } // closing of if statement

  });

  /////////////////////////////////////////////////
  // IMPORTANT VARIABLES (need to make this clearer)
  //////////////////////////////////////////////////
  var group = $('#groupName').val(); // with this we get the group name we've assigned to channel (it is in the controllers/users.js: successRedirect)
  // we'll use it to communicate events only in that room using joint
  var username = $('#username').val(); // getting the useranme of the sender

  //////////////////////////////////////////////////
// grabing data from the canvas and adding a print screened image
  socket.on('canvasDataBackToClient', (data)=>{
    //debugger
    var image = document.getElementById('neighbour-image');
    image.src = data.message;
    image.style.display = "inline-block";
  });

  socket.on('connect', function(){ // this listens to the connect event each time a user is connected
  // emmitting joint events (event only to one room)
  var params = {
      room: group,
      username: username
    }

  socket.emit('join', params, function(){
      console.log('User '+params.username+' has joined room '+ params.room)
    });

  });



  socket.on('usersList', function(data){ // the users argument is from the client side the array of the users

    console.log(data);
    var users = data.users;
    console.log(users.length );
    if (users.length === 1){
      //// do nothing
    } else if (users.length === 2){

      StartIframe();
      var sender = document.getElementById("username").value;
      var room = document.getElementById("groupName").value;

      socket.emit('trialData', {rules, examples,
        test_cases, rule_names, rand_trial,
        rand_counter, sender, room});

      // parent.document.getElementById('game').style.visibility = "visible";
      // var iframe = document.getElementById("game_frame");
      // if (iframe) {
      //     var iframeContent = (iframe.contentWindow || iframe.contentDocument);
      //     iframeContent.Start(rules[rand_trial], examples, test_cases, rule_names[rand_trial], rand_counter);
      // }
    }
    params = data.params;
    users = data.users;

  }); // closing of usersList


  // emmiting an even from the client side to the server
  // keep in mind that each time u emit an event on the client side,
  // u have to go to the server side as well and listen for that event

  //////////////////////////////////////////////





  //////////////////////////////////////////////
  // MAIN STEPS INVOLVED IN THE TASK
  //////////////////////////////////////////////

  //////////////////////////////////////////////
  // 1 STEPPING THROUGH INSTRUCTIONS
  //////////////////////////////////////////////
  $('#ins_1_btn').click(function () {
    $('#ins_1').hide();
    $('#ins_2').show();
  });

  $('#ins_2_btn').click(function () {
    $('#ins_2').hide();
    $('#ins_3').show();
  });

  $('#ins_3_btn').click(function () {
    $('#ins_3').hide();
    $('#ins_4').show();
  });

  $('#ins_4_btn').click(function () {
    $('#ins_4').hide();
    $('#ins_5').show();
  });

  $('#ins_5_btn').click(function () {
    $('#ins_5').hide();
    $('#ins_6').show();
  });

  $('#ins_6_btn').click(function () {
    $('#ins_6').hide();
    $('#ins_7').show();
  });

  $('#ins_7_btn').click(function () {
    $('#ins_7').hide();
    $('#comprehension_quiz').show();
  });
  //////////////////////////////////////////////
  //////////////////////////////////////////////


  //////////////////////////////////////////////
  // 2 COMPREHENSION QUIZ
  //////////////////////////////////////////////
  var comp_checker = function() {
  	$('#done_comp').show();
  	//Pull the selected values
  	var q1 = $('#comprehension_q1').val();
  	var q2 = $('#comprehension_q2').val();
  	var q3 = $('#comprehension_q3').val();
  	var q4 = $('#comprehension_q4').val();
  	var q5 = $('#comprehension_q5').val();

     // correct answers
     answers = ["true", "false", "true", "false", "false"];

     if(q1 == answers[0] && q2 == answers[1] && q3 == answers[2] && q4 == answers[3] && q5 == answers[4]){
     		// enable subject to start experiment
        $('#comprehension_btn').hide();
        $('#start_btn').show();
        alert('You got everything correct! Press "Start" to begin the experiment.');
      } else {
      	// Throw them back to the start of the instructions
      	// Remove their answers and have them go through again
  		alert('You answered at least one question incorrectly! Please try again.');

      	$('#comprehension_q1').prop('selectedIndex', 0);
      	$('#comprehension_q2').prop('selectedIndex', 0);
      	$('#comprehension_q3').prop('selectedIndex', 0);
      	$('#comprehension_q4').prop('selectedIndex', 0);
      	$('#comprehension_q5').prop('selectedIndex', 0);
      	$('#start_btn').hide();
      	$('#comprehension_btn').show();
      	$('#ins_1').show();
  		  $('#comprehension_quiz').hide();
      };
  };

  $('#comprehension_btn').click(function () {
    comp_checker();
  });

  $('#start_btn').click(function () {
    $('#comprehension_quiz').hide();
    $('#game_frame').show();
  });
});
//////////////////////////////////////////////
//////////////////////////////////////////////
