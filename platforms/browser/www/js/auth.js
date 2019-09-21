//Check session and open dashboard
if(localStorage.loginstatus != "true"){
	$$('.view-main, .panel').hide();
  app.loginScreen.open('#my-login-screen');
}else{
	$$('.view-main, .panel').show();
	loadContent();
	//(function loopingFunction() {
    //setTimeout(loopingFunction, 3000);
	//})();	
}

// set new password
$$('#my-login-screen .newpass-btn').on('click', function () {
  var pin = $$('#my-login-screen [name="pin"]').val();
  var username = $$('#my-login-screen [name="useremail"]').val();
  var pass1 = $$('#my-login-screen [name="pass1"]').val();
  var pass2 = $$('#my-login-screen [name="pass2"]').val();
  var reqst = 'newpass';

if(username != ''){
 app.preloader.show();  
 app.request.get(formURL, {req: reqst, code: pin, dpass1: pass1, dpass2: pass2, user: username}, 

 function (data) {
if(data == '1'){
	$$('.loginStat').html('<span class="green">New password successfully set.</span>');	
	$$('.newpass').hide();
	$$('.loginface').show();
 	app.preloader.hide();
}
else if(data != ''){
	$$('.loginStat').html(data);	
	app.preloader.hide();
  }		
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
});
}
});


// Password reset Screen
$$('#my-login-screen .passreset-btn').on('click', function () {
  var username = $$('#my-login-screen [name="useremail"]').val();
  var reqst = 'passreset';

if(username != ''){
 app.preloader.show();  
 app.request.get(formURL, {req: reqst, user: username}, 

 function (data) {
if(data == '1'){
	$$('.loginStat').html('<span class="green">Please check your mail for a password reset code</span>');	
	$$('.passreset').hide();
	$$('.newpass').show();
 	app.preloader.hide();
}
else if(data != ''){
	$$('.loginStat').html(data);	
	app.preloader.hide();
  }		
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
});

}
});


// Login Screen
$$('#my-login-screen .login-button').on('click', function () {

  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  var reqst = 'login';
if(username != '' && password != ''){
	app.preloader.show();
	app.request.get(formURL, {req: reqst, user: username, pass: password}, function (data) {
	data = JSON.parse(data);
  if(data.status == 'failed'){
	$$('.loginStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
  // Close login screen
	$$('.view-main, .panel').show();
	localStorage.loginstatus = "true";
    localStorage.appFullName = data.fullName;
    localStorage.appWallet = data.wallet;
    localStorage.appUserName = data.userName;
    localStorage.appUserEmail = data.email;
    localStorage.appUserPhone = data.phone;
    localStorage.appUserID = data.userID;
	app.loginScreen.close('#my-login-screen');	
	loadContent();
	$$('.loginStat').html('');
	app.preloader.hide();
	


}
  else{	
	$$('.loginStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});

}
});


// Verify Phone Number
$$('#phone-verify .verify-button').on('click', function () {
  var mobile = $$('#phone-verify [name="phone"]').val();
  var code = $$('#phone-verify [name="code"]').val();
  var reqst = 'verifyphone';
  
if(mobile != '' && code != ''){
 app.preloader.show();
  
app.request.get(formURL, {req: reqst, phone: mobile, dcode: code}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.verifyStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
		
		
  //Log user in ...  redirect to homepage

	$$('#phone-screen').hide();
	$$('.loginface').show();

	$$('.view-main, .panel').show();
	localStorage.loginstatus = "true";
    localStorage.appFullName = data.fullName;
    localStorage.appWallet = data.wallet;
    localStorage.appUserName = data.userName;
    localStorage.appUserEmail = data.email;
    localStorage.appUserPhone = data.phone;
    localStorage.appUserID = data.userID;
	app.loginScreen.close('#my-login-screen');	
	loadContent();
	$$('.loginStat').html('');
	app.preloader.hide();
	
	
}
  else{	
	$$('.verifyStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.regStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});
}
});



// Register
$$('#reg-screen .register-button').on('click', function () {
  var mobile = $$('#reg-screen [name="phone"]').val();
  var username = $$('#reg-screen [name="username"]').val();
  var password = $$('#reg-screen [name="password"]').val();
  var email = $$('#reg-screen [name="email"]').val();
  var name1 = $$('#reg-screen [name="name1"]').val();
  var name2 = $$('#reg-screen [name="name2"]').val();
  var reqst = 'register';
  
if(mobile != '' && username != '' && password != '' && email != '' && name1 != '' && name2 != ''){
 app.preloader.show();
  
app.request.get(formURL, {req: reqst, phone: mobile, user: username, mail: email, firstname: name1, lastname: name2, pass: password}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.regStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
  //redirect to login
  
	localStorage.veriPhone = mobile;
	$$('#reg-screen [name="phone"]').val('');
	$$('#reg-screen [name="username"]').val('');
	$$('#reg-screen [name="password"]').val('');
  
	//$$('.verifyStat').html('<span class="green">'+ data.message +'</span>');
	$$('#reg-screen').hide();
	$$('#phone-verify').show();
	
	$$('#phone-verify [name="phone"]').val(mobile);
	app.preloader.hide();	
	
	
}
  else{	
	$$('.regStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.regStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});
}
});

//Change password
function changepassword(){
	var pass1 = $$('#chnpass [name="pass1"]').val();
	var pass2 = $$('#chnpass [name="pass2"]').val();
	var pass3 = $$('#chnpass [name="pass3"]').val();
	var reqst = 'changepass';
	var userID = localStorage.appUserID;
	$$('.chbt').hide(); 
	$$('.chnBTN').html(''); 
	 app.preloader.show();

	app.request.get(formURL, {req: reqst, user: userID, pass1: pass1, pass2: pass2, pass3: pass3}, function (data) {
	$$('.chnBTN').html(data); 
		if(data != '<span class="green">Password successfully changed</span>'){$$('.chbt').show();}
	app.preloader.hide();
	});	
}

//Log user out
function logout(){
  localStorage.loginstatus = "false";
  app.loginScreen.open('#my-login-screen');
  app.dialog.alert('Successfully logged out');
}

