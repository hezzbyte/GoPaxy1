// Dom7
var $$ = Dom7;


// Framework7 App main instance
var app  = new Framework7({
	
	on: {
    init() {
      
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("f9c6d067-9970-4ff0-8941-63e3b85b568f")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
	  
    },
  }
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


function trans(){
	var reqst = 'trans';
	var userID = localStorage.appUserID;
	app.preloader.show();
	app.request.get(formURL, {req: reqst, user: userID}, function (data) {
	$$('.trans').html(data);  
	app.preloader.hide();
	});	
}

//Function - switch a view/tab
function switchv(tohide, toshow){
	$$(tohide).hide();
	$$(toshow).show();
}

//Function - show updated wallet value
function updatewall(){
	var reqst = 'updatewall';
	var userID = localStorage.appUserID;
	app.request.get(formURL, {req: reqst, user: userID}, function (data) {
		    localStorage.appWallet = data;
			$$('.appWallet').text('₦' + nformat(localStorage.appWallet));		
	});	
}

//Load user details
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

