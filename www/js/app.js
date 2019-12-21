// Dom7
var $$ = Dom7;
/*
 $$(document).on('deviceready',function(){ 
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("f9c6d067-9970-4ff0-8941-63e3b85b568f")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
 })*/


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


function payrequest() {
		
	  cordova.plugins.barcodeScanner.scan(
      function (result) {
	  
	if(result.text != ''){
	app.preloader.show();
	app.request.get(formURL, {req: 'payRequest', bcode: result.text}, function (data) {
	console.log(data);
	data = JSON.parse(data);
	console.log(data);
	
	$$('.newInvoice .productName').val(data.product);
	$$('.newInvoice .productPrice').val(data.price);
	$$('.newInvoice .productID').val(data.productID);
	$$('.newInvoice .quantity').val('1');
	
	app.preloader.hide();
	
  if(data.status == 'failed'){
	app.dialog.alert( data.error);
	app.preloader.hide();
  }
	else if(data.status == 'success'){

}
  else{	
	alert('Error! Unknown Error!');	
	app.preloader.hide();
} 
  
}, function(){
	alert('Error! No internet connection.');	
	app.preloader.hide();
}, {dataType: 'json'});

		}else{
			alert("Scanning canceled");
			
		}
	  	
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          //formats : "QR_CODE,UPC_A,UPC_E, EAN_8", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );
		
      }
	  
	  
	  
	  
$$(document).on('page:init', function (e) {
	
	loadContent();
});

$$(document).on('page:init', '.page[data-name="my-profile"]', function (e) {

  });
  
$$(document).on('page:init', '.page[data-name="transfer"]', function (e) {
	$$('.tr-de').hide();
    //app.dialog.alert('Hello World!');

  });

$$(document).on('page:init', '.page[data-name="wallet"]', function (e) {
	trans();
  });

