'use strict'
const User = require('../models/user'); // fetching the userSchema in the user model
//const {Users} = require('../helpers/usersInGroup'); // EJ6 destructoring to get the Users class
//const users = new Users();
// in here we'll have some functions that will pertain
// to the users. Like for signing up, retrieving and adding
// data to the database etc

// we'll also set up the routes here like the post routes, the get routes
// and probably more

// this will make the function available to other files
module.exports = function(_, generateRoom){

    return {
      SetRouting: function(router){
        router.get('/signup', this.getSignUp);  // the get method requests a representation of the specified resource. here: '/'
        //groupName = "help";
        router.post('/signup', this.postSignUp)
      },

      getSignUp:function(req, res){
        //console.log(req.flash('error')) // this shouldn't be an empty list, check this when u can
        return res.render('signup', {messages: req.flash('error'), hasErrors: req.flash('error').length > 0}) // renders a file from the views folder along side with an object
      },
      postSignUp: function(req, res){
        const newUser = new User();

        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.username;
        newUser.password = new Date();

        newUser.save(function(err) {
          if (err)return handleError(err);
        });

        // check how many participants are in the current room
        var roomsOjb = io.sockets.adapter.rooms;
        var allRooms = Object.keys(roomsOjb);
        var rooms = [];
        allRooms.forEach(function(el, i){
          if(el.length === 5){rooms.push(el)}
        });

        var booleanRooms = [];// an arrary with true and false
        _.forEach(rooms, function(room, i) {
        var clients = io.sockets.adapter.rooms[room];
        if(clients.length === 1){
            booleanRooms.push(true); // true if there is only 1 participant in the room
          }else if (clients.length === 2){
            booleanRooms.push(false); // false if there are 2 participants in the room
          }
        });

        const idx_av_room = booleanRooms.indexOf(true); // idex of available room
        console.log(roomsOjb);
        console.log("rooms: "+rooms +"\nbooleanRooms: "+booleanRooms+"\nidx_av_room: "+idx_av_room);
        if (idx_av_room === -1){ // if there is no available room, create one
            var room = generateRoom.makeroom(5);
        }else{// if there is an available room
          var room = rooms[idx_av_room];
        }
        req.session.username = req.body.username;
        return  res.redirect('/group/'+room);
      }
    }

}
