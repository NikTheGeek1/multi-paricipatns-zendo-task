// SERVER SIDE
module.exports = function(io, Users){
  // bringing in the users class with all the methods to remove, add etc uers from the user list
  users = new Users(); // the new keyword creates a new constructor (instance in python lang?)
  user_names = {}

  who_finished = {};



  // inside the following connection we put every event that we listen or send
  io.on('connection', socket => {// that enables the server to lister to the connections event

    //////////////////////////////////////////
    // Getting trial data from client
    /////////////////////////////////////////
    socket.on('trialData', data => {
      const room = data.room;
      who_finished[room] = []; // initialising here the who_finished array to use it later at the canvas message
      io.to(room).emit('trialDataBackToClient', data);
    });
    /////////////////////////////////////////

// receive dataURL for the screenshot on the server side and emit it privately
    socket.on('canvasData', (data)=>{
          trial_num = data.trial_num;
          const sender = data.sender;
          const message = data.dataURL;
          const room = data.room;
          // adding who finished in the room
          who_finished[room].push(sender);
          if (who_finished[room].length === 2){
            who_finished[room] = [];
          }
          var who_finished_inRoom = who_finished[room];
          socket.broadcast.to(room).emit('canvasDataBackToClient',{
                  // who finished
                  who_finished: who_finished_inRoom,
                  //The sender's username
                  sender : data.sender,
                  //Message sent to receiver
                  message : message
              });



      });





    // listenning to the joint event coming from the client
    socket.on('join', (params, callback) => { // event is the data sent from the event called join
      socket.join(params.room);// this method allows users to connect to a particular channel, takes argument room name
      users.AddUserData(socket.id, params.username, params.room);
      console.log('User '+params.username+' has joined room '+ params.room); // this will be displayed to the terminal
      socket.broadcast.to(params.room).emit('usersList', {params:params, users:users.GetUsersList(params.room)}); // sending the userlist to the client from getting it using the function defined in the Users class



      callback(); // this callback is neccessary because when we sent the message from
      // the client side, we also added a function ('join', params, function) so
      // the callback reflects that function
    });

    socket.on('storeData', data =>{
      // store to mongoDB
      console.log("Got the data");
    });
  // creating a listenning event that every time a user disconnects, then the
  // function from the User class RemoveUser is going to be triggered and Remove user data
  socket.on('disconnect', () => {
    var user = users.RemoveUser(socket.id);
    if(user){
      console.log(io.sockets.adapter.rooms);
      console.log("User disconnected ");
      io.to(user.room).emit('usersList', {params:'', users:users.GetUsersList(user.room)}); // getting the user list using the function defined in the Users class
    }
  });
  });
}
