//Function - payWithPaystack
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

//Fund User Wallet
function fundwallet(){
	var email = localStorage.appUserEmail;
	var phone = localStorage.appUserPhone;
	var amount = $$('.fundwall [name="amount"]').val();
	
	app.preloader.show();
	mainView.router.navigate('/pay/');
	payWithPaystack(amount, email, phone);
	app.preloader.hide();
}


//Function - Withdraw fund to bank account
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


// Confirm user before transfer
function checkuser() {
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
	$$('.trans1').hide();
	$$('.trans2').show();
	
	$$('.transfername').html('<span class="green">'+ data.fullName +'</span>');
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
}