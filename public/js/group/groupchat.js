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
    posit_ix = data.posit_ix;

    var iframe = document.getElementById("game_frame");
    document.getElementById('game').style.visibility = "visible";
    document.getElementById('waiting_area').style.display = "none";

    if (iframe) {
        var iframeContent = (iframe.contentWindow || iframe.contentDocument);
        try {
          iframeContent.Start(rules[rand_trial], examples, test_cases, rule_names[rand_trial], rand_counter, posit_ix);
        }
        catch(err) {

          location.reload();
        } // closing catch


  } // closing of if statement

  // send the name of the first player to the second player
  socket.emit('user1Name', {username: data.sender, room: data.room});

  });


  // listening for player's 1 username (only player two receives it)
  socket.on('user1NameToUser2', name => {
    otherUser = name;// this is the name of the other player, we need to
    // define it here so we can have it later on
    parent.document.getElementById("user2-other-name").innerHTML = name;
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
    who_finished = data.who_finished;
    if (who_finished.length === 1){
      // put image of what the player did to the OTHER section of user 2
      var otherImageUser2 = document.getElementById('other-image-user2');
      otherImageUser2.src = data.message;
      document.getElementById('images-user2').style.display = "block";
    }
    if (who_finished.length === 2){
      // put image of what they did to the OTHER section of user 1
      var otherImageUser1 = document.getElementById('other-image-user1');
      otherImageUser1.src = data.message;
      // hide waiting area
      document.getElementById('waiting-area-after-trial').style.display = "none";

      // make the division with the appropriate images visible
      document.getElementById('images-user1').style.display = "block";
      // also make the whole division for the images visible
      document.getElementById('images-div').style.display = "inline-block";

    }

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
    var users = data.users;
    if (users.length === 1){
      document.getElementById('game').style.visibility = "hidden";
      document.getElementById('waiting_area').style.display = "block";
      // refreshing iframe too so we will start from the beginning
      var iframe = document.getElementById("game_frame");
      var iframeContent = (iframe.contentWindow || iframe.contentDocument);
      iframeContent.location.reload();
    } else if (users.length === 2){
      // only player 1 will ever reach that point
      // if there are two users, get the data game for the trial
      // and emmit it back to the server
      StartIframe(); // getting data
      // these are data from inside zendo. The randomised positions of the prior posterior answers
      var posit_ix = [8,9,10,11,12,13,14,15];
      var posit_ix = _.shuffle(posit_ix);

      var sender = document.getElementById("username").value;
      var room = document.getElementById("groupName").value;

      otherUser = sender; // this is the name of the other player, we need to
      // define it here so we can have it later on
      // playing sound
      var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
      $.notify("User: " +data.params.username+ "has just joined in!", "success");
      snd.play();
      parent.document.getElementById("user1-other-name").innerHTML = data.params.username;


      socket.emit('trialData', {rules, examples,
        test_cases, rule_names, rand_trial,
        rand_counter, posit_ix, sender, room});
    }//closing of else if
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
