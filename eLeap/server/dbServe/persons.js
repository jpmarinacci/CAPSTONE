var dbServer = require('../dbServer');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var persons = {
	signupPerson: function(request, response) { 'use strict';
		console.log('--- signupPerson route called ---');
		if(!request.body.email || !request.body.credential) {
			response.send({invalid:'invalid paramaters -- no email or credential'});
			return;
		}
		var hashedCredential = bcrypt.hashSync(request.body.credential, 10);
		var params = [
			hashedCredential,
			request.body.email,
			request.body.personName ? request.body.personName : null,
			request.body.phone ? request.body.phone : null,
			request.body.picURL ? request.body.picURL: null,
			request.body.roleId ? request.body.roleId : 1
		];
		
		console.log("calling sprocAddPer");
		dbServer.sproc("sprocAddPer", params, function(results) {
			if (results && results.error) {
				results.sprocThatErrored = "sprocAddPer";
				dbServer.processSprocError(results, response);
	    	} else {
	    		console.log("sproc Add per returned");
	    		console.log(results);
	    		
	    		//CanNotInsert:1064
	    		if(Array.isArray(results) && results[0]){
	    			if(Array.isArray(results[0])){
	    				var firstElement = results[0][0];
	    				if(firstElement.CanNotInsert) {
	    					console.log("success --- found the thing");
	    				}
	    			}
	    		}
	    		var person = results[0] ? results[0][0] || results[0]: {};
	    		if(person && person.personId) {
	    			delete person.credential;
	    			person.status = "success";
	    		}
    			console.log("sprocAddPer successful");
    			//add new cookie code here -- this overwrites the session on every user login
    			//this makes multiple user logins on the same server work incorrectly
    			session.email = person.email;
	            session.personId = person.personId;
	            session.isLoggedIn = true;
	    		console.log("added person to login session");
	    	
	    		response.send(person);
	    	}
		});
    },
        
    updatePerson: function(request, response) { 'use strict';
    	console.log("--- updatePerson route called ---");
    	if(!request.body.personId || !request.body.credential) {
			response.send({invalid:'invalid paramaters -- no personId or credential'});
			return;
		}
		var hashedCredential = bcrypt.hashSync(request.body.credential, 10);
		var params = [
			hashedCredential,
			request.body.email ? request.body.email: null,
			request.body.personId ? Number(request.body.personId): null,
			request.body.personName ? request.body.personName: null,
			request.body.phone ?  request.body.phone: null,
			request.body.picURL ? request.body.picURL: null,
			request.body.roleId ? request.body.roleId: 1,
			request.body.themeId ? request.body.themeId: null
		];
		
		console.log("calling sprocUpdatePer");
		dbServer.sproc("sprocUpdatePer", params, function(results) {
			if (results && results.error) {
				results.sprocThatErrored = "sprocUpdatePer";
				dbServer.processSprocError(results, response);
	    	} else {
	    		var person = results[0] ? results[0][0] || results[0]: {};
	    		if(person && person.personId) {
	    			delete person.credential;
	    			person.status = "success";
	    			console.log("sprocUpdatePer successful");
	    			console.log("personId: "+ person.personID);
	    		} else {
	    			console.log("sprocUpdatePer error:");
	    			console.log(results);
	    		}
	    		
	    		response.send(person);
	    	}
		});
	},
    
    getPerson: function(request, response) { 'use strict';
    	console.log("--- getPerson route called ---");
    	if(!request.body.personId) {
			response.send('invalid paramaters -- no email');
			return;
		}
		var params = [
			request.body.personId
		];
		
		console.log("calling sprocFindPerId");
		dbServer.sproc("sprocFindPerId", params, function(results) {
			if (results && results.error) {
				results.sprocThatErrored = "sprocUpdatePer";
				dbServer.processSprocError(results, response);
	    	} else {
	    		var returnResults = {};
	    		if(Array.isArray(results) && results[0]){
	    			if(Array.isArray(results[0])){
	    				var person = results[1][0];
	    				delete person.credential;
	    				returnResults = person;
			    		returnResults.status = "success";
			    		console.log("sprocFindPerId successful");
			    		console.log(returnResults);
	    			}
	    		} else {
	    			returnResults = {
		    			'status':'invalid'
		    		};
	    		}
	    		response.send(returnResults);
	    	}
		});
    },
	 
	getAllPersons: function(request, response) { 'use strict';
		console.log("--- getAllPersons route called ---");
		console.log("calling sprocAllPer");
		
		dbServer.sproc("sprocAllPer", [], function(results) {
			if (results && results.error) {
				results.sprocThatErrored = "sprocAllPer";
				dbServer.processSprocError(results, response);
	    	} else {
	    		var returnResults = results[0] || {};
	    		returnReuslts.status = "success";
	    		console.log("sprocAllPer successful");
	    		response.send(returnResults);
	    	}
		});
	}
};

module.exports = persons;

