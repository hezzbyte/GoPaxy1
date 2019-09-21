// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.gopaxy.app', // App bundle ID
  name: 'GoPaxy', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: '',
        lastName: '',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
	view: {
		pushState :true,
		stackPages: true,            
	},
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

//Set for URL
var formURL = 'https://www.gopaxy.com/app1';

document.addEventListener('backbutton', backPressed, false);
function backPressed(){
        window.history.back();
}

function nformat(x){
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function loadlist(userID){
	var reqst = 'triplist';
	//app.request.get(formURL, {req: reqst, user: userID}, function (data) {
    //localStorage.tripList = data;
	//$$('.triplist').html(data); });	
}

function trans(){
	var reqst = 'trans';
	var userID = localStorage.appUserID;
	app.preloader.show();

	app.request.get(formURL, {req: reqst, user: userID}, function (data) {
	$$('.trans').html(data);  
	app.preloader.hide();
	});	
}


function withdrawfund(){
	var reqst = 'withdrawfund';
	var userID = localStorage.appUserID;
	var amount = parseInt($$('#withdrawfund [name="amount"]').val());

	$$('.wtnotice').html(''); 
	app.preloader.show();

	app.request.get(formURL, {req: reqst, user: userID, amnt: amount}, function (data) {
	$$('.wtnotice').html(data);  
	if(data == '<span class="green">Your withdrawal has been queued.</span>'){$$('#withdrawfund [name="amount"]').val('');
		//update wallet on app
		localStorage.appWallet = parseInt(localStorage.appWallet) - amount;
		loadContent();
		}
	app.preloader.hide();
	});	
}


function showwithdraw(){
	$$('.wbtn').hide();
	$$('.toshow').show();	
}


function openpasspart(tohide, toshow){
	$$(tohide).hide();
	$$(toshow).show();
}

function updatewall(){
	var reqst = 'updatewall';
	var userID = localStorage.appUserID;
	app.request.get(formURL, {req: reqst, user: userID}, function (data) {
		    localStorage.appWallet = data;
			$$('.appWallet').text('₦' + nformat(localStorage.appWallet));		
	});	
}


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


function loadContent(){
	$$('.appFullName').text(localStorage.appFullName);
	$$('.appWallet').text('₦' + nformat(localStorage.appWallet));
	$$('.appUserName').text(localStorage.appUserName);
	//$$('.appUserEmail').text(localStorage.appUserEmail);
	//$$('.appUserPhone').text(localStorage.appUserPhone);
}


$$(document).on('page:init', function (e) {
	loadContent();
});

$$(document).on('page:init', '.page[data-name="my-profile"]', function (e) {

  });

$$(document).on('page:init', '.page[data-name="wallet"]', function (e) {
	trans();
  });

$$(document).on('page:init', '.page[data-name="pay"]', function (e) {
	//payWithPaystack(); 
  });

function payWithPaystack(amount1, email1, phone1){
    var handler = PaystackPop.setup({
      key: 'pk_test_e953822127e2304620428f17063afd68e39779f0',
	  email: email1,
      amount: amount1*100,
      currency: "NGN",
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      metadata: {
         custom_fields: [
            {
                display_name: "Mobile Number",
                variable_name: "mobile_number",
                value: phone1
            }
         ]
      },
      callback: function(response){
var ref = response.reference;

if(ref != ''){
 app.preloader.show();  
 app.request.get(formURL, {reference: ref}, 

 function (data) {
	 
	app.dialog.alert(data);
	mainView.router.navigate('/');
	updatewall();
	app.preloader.hide();


}, function(){
	$$('.loginStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
});
}
			
      },
      onClose: function(){
		  	mainView.router.navigate('/fund-wallet/');
        	alert('Transaction was cancelled!');
      }
    });
    handler.openIframe();
  }

if(localStorage.loginstatus != "true"){
	$$('.view-main, .panel').hide();
  app.loginScreen.open('#my-login-screen');
}else{
	$$('.view-main, .panel').show();
	loadContent();
	(function loopingFunction() {
    loadlist(localStorage.appUserID);
    setTimeout(loopingFunction, 3000);
})();	
}

function logout(){
  localStorage.loginstatus = "false";
  app.loginScreen.open('#my-login-screen');
  app.dialog.alert('Successfully logged out');
}

function fundwallet(){
	var email = localStorage.appUserEmail;
	var phone = localStorage.appUserPhone;
	var amount = $$('.fundwall [name="amount"]').val();
	
	app.preloader.show();
	mainView.router.navigate('/pay/');
	payWithPaystack(amount, email, phone);
	app.preloader.hide();
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
 //app.dialog.alert(data.status);
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

// Register Screen
$$('#reg-screen .register-button').on('click', function () {
  var mobile = $$('#reg-screen [name="phone"]').val();
  var username = $$('#reg-screen [name="username"]').val();
  var password = $$('#reg-screen [name="password"]').val();
  var email = $$('#reg-screen [name="email"]').val();
  var reqst = 'register';
  
if(mobile != '' && username != '' && password != '' && email != ''){
 app.preloader.show();
  
app.request.get(formURL, {req: reqst, phone: mobile, user: username, mail: email, pass: password}, function (data) {
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

// Confirm user before transfer

$$('#transfer1 .trans1').on('click', function () {
  var userid = $$('#transfer1 [name="userid"]').val();
  var reqst = 'confirmID';
  
if(userid != '' ){
 app.preloader.show();
  
app.request.get(formURL, {req: reqst, user: userid}, function (data) {
	data = JSON.parse(data);
 //app.dialog.alert(data.status);
  if(data.status == 'failed'){
	$$('.tranStat').html('<span class="red">'+ data.error +'</span>');	
	app.preloader.hide();
  }
	else if(data.status == 'success'){
  //show amount field
	$$('.tranStat').html('<span class="green">'+ data.message +'</span>');
	app.preloader.hide();	

}
  else{	
	$$('.tranStat').html('<span class="red">Error! Unknown Error!</span>');	
	app.preloader.hide();
} 
  
}, function(){
	$$('.tranStat').html('<span class="red">Error! No internet connection.</span>');	
	app.preloader.hide();
}, {dataType: 'json'});
}
});
