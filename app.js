var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util')
    http = require('http')
    fs   = require('fs-extra'),
    qt   = require('quickthumb'),
    Firebase = require('firebase');


// Use quickthumb
/*app.use(qt.static(__dirname + '/'));

app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });

  form.on('end', function(fields, files) {
    var temp_path = this.openedFiles[0].path;
    var file_name = this.openedFiles[0].name;
    var new_location = 'uploads/';

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
});*/

// Create the "uploads" folder if it doesn't exist
fs.exists(__dirname + '/uploads', function (exists) {
    if (!exists) {
        console.log('Creating directory ' + __dirname + '/uploads');
        fs.mkdir(__dirname + '/uploads', function (err) {
            if (err) {
                console.log('Error creating ' + __dirname + '/uploads');
                process.exit(1);
            }
        })
    }
});

// Show the upload form	
app.get('/', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  /* Display the file upload form. */
  //form = '<form action="/upload" enctype="multipart/form-data" method="post">'+ '<input name="title" type="text" />' + '<input multiple="multiple" name="upload" type="file" />' + '<input type="submit" value="Upload" />'+ '</form>';
  form = '<form action="/images" enctype="multipart/form-data" method="post">'+ '<input name="title" type="text" />' + '<input multiple="multiple" name="upload" type="file" />' + '<input type="submit" value="Upload" />'+ '</form>';
  res.end(form); 
});

app.post('/images', addImage); // endpoint to post new images
app.get('/images', getImages); // endpoint to get list of images
 

function getImages (req, res, next) {
    console.log('Picture request' + req);

    var myRootRef = new Firebase('https://iona-wedding.firebaseio.com/images');
    myRootRef.set("hello world!");
};

function addImage (req, res, next) {

console.log("upload");


  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {

    var file = files.upload,
        filePath = file.path,
        fileName = file.name,
        lastIndex = filePath.lastIndexOf("/"),
        tmpFileName = filePath.substr(lastIndex + 1);

    console.log(fileName);

    var myRootRef = new Firebase('https://iona-wedding.firebaseio.com/images');
    myRootRef.push('{fileName: '+tmpFileName+'}');

    console.log(tmpFileName);
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('<img src="http://localhost/mobile/PictureFeed/dev/uploadapp/uploads/'+fileName+'"/>');

  });


  form.on('end', function(fields, files) {

    var temp_path = this.openedFiles[0].path;
    //var file_name = tmpFileName;
    var file_name = this.openedFiles[0].name;
    var new_location = 'uploads/';

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
};


app.listen(8080, function () { console.log('Listening to port 8080'); });
