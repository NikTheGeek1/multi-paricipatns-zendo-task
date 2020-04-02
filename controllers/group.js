const Ips = require('../models/ips')

module.exports = function(_){

    return {
      SetRouting: function(router){
        router.get('/group/:name', this.groupPage); // the :name allows us to take is after the /    you can find it in controllers/users.js: successRedirect
      },
      groupPage: function(req, res){
        const room = req.params.name;
        // saving ip of the client
        const ipInfo = req.ipInfo.ip;
        const newIp = new Ips();
        newIp.ip = ipInfo;
        newIp.save(function(err) {
          if (err)return handleError(err);
        });
        res.render('group', {groupName:room, username: req.session.username});
      }
         }
}
