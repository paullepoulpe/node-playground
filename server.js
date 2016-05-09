var express = require('express');
var fs = require("fs");

var app = express();
app.use(express.static('public'));

var usersFile = __dirname + "/data/" + "users.json";

app.get('/listUsers', function (req, res) {
    fs.readFile(usersFile, 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
});

app.get('/addUser', function (req, res) {

    var user = {
        "name": req.query.name,
        "password": req.query.password,
        "profession": req.query.profession
    };

    // First read existing users.
    fs.readFile(usersFile, 'utf8', function (err, data) {
        data = JSON.parse(data);
        var id = 1;
        while (data.hasOwnProperty("user" + id)) {
            id++
        }

        user.id = id;

        data["user" + id] = user;

        fs.writeFile(usersFile, JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log(err);
                res.end('Error : ' + err);
                return;
            }
            console.log('Sucessfully added user!');
            res.end(JSON.stringify(data));
        });
    });
});


app.get('/deleteUser', function (req, res) {

    // First read existing users.
    fs.readFile(usersFile, 'utf8', function (err, data) {
        data = JSON.parse(data);

        delete data["user" + 2];

        fs.writeFile(usersFile, JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log(err);
                res.end('Error : ' + err);
                return;
            }
            console.log('Sucessfully deleted user!');
            res.end(JSON.stringify(data));
        });


    });
});

app.get('/:id', function (req, res) {
    // First read existing users.
    fs.readFile(usersFile, 'utf8', function (err, data) {
        users = JSON.parse(data);
        var user = users["user" + req.params.id];
        console.log(user);
        res.end(JSON.stringify(user));
    });
});


var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});