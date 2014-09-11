var express = require('express');
var pg = require('pg.js'); 
var conString = "postgres://gisuser:whatever@localhost:5432/gisdb";
var app = express();

app.use(express.static(__dirname = 'public'));

app.get('/postgis_viewer', function(req, res){
  	var db = new pg.Client(conString);
  	var content_type = "text/plain";
	
	var sql = "";
	if (!req.query.sql){
	    res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('No query was given');
		res.end();
	}
	else {
	    sql =  req.query.sql;
	}
	if (req.query.content_type){
	    content_type = req.query.content_type.toString();
	}
	
	db.connect(function(err) {
	  if(err) {
	  	console.error('could not connect to postgres', err);
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write(err.toString());
		res.end();
		db.end();	
	  }

	  db.query(sql.toString(), function(err, result){
		if(err) {
		  res.writeHead(500, {'Content-Type': 'text/plain'});
		  res.write(err.toString());
		  res.end();
		  db.end();
		}
		else if( result.rowCount > 0 ){
			res.writeHead(200, {'Content-Type': content_type});
			
			for(var columnName in result.rows[0]) {
                if (content_type.toString().indexOf('image') > -1 ){
                     res.write("data:" + content_type + ";base64," + result.rows[0][columnName].toString('base64'));
                }
                else {
                     res.write(result.rows[0][columnName] + '');
                 }
			}
		}
		else {
		  res.writeHead(500, {'Content-Type': 'text/plain'});
		  res.write('no results');
		}
		res.end();
		db.end();
	  });
	});
});

app.listen(3030);
console.log('listening on 3030');
