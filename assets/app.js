//---------------------------------------------------------------------------------
// DISPLAYS INITIAL MAP
var map;
// var geocoder;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 5,
		center: new google.maps.LatLng(39.82, -98.57),
		mapTypeId: 'terrain'
	});
	// geocoder = new google.maps.Geocoder();
}

//-----------------------------------------------------------------------------------
//CREATING SOME GLOBAL VARIABLES
var zipCode = '';
var marketId = '';

//------------------------------------------------------------------------------------------------
//CLICKING ON THE SUBMIT BUTTON AND PASSING ZIP ARGUMENT IN THE GETMARKETIDFROMZIPCODE FUNCTION
$(document).on('click', '#submit', function(event) {
	event.preventDefault();
	zipCode = $('#autocomplete-input').val().trim();
	$('#autocomplete-input').html('').val(''); //EMPTY THE ZIP CODE FIELD
	getMarketIdFromZipCode(zipCode);
});

//------------------------------------------------------------------------------------------------------
//CLICKING THE MARKET NAME
//AND GETTING DETAILS BY CALLING GETMARKETDETAILS FUNCTION BY PASSING
//THE ID OBTAINED FROM THE GETMARKETIDFROMZIPCODE FUNCTION
$(document).on('click', '.market-list', function(event) {
	event.preventDefault();
	marketId = $(this).attr('id');
	getMarketDetails(marketId);
});

function searchResultsHandler(response) {
	//RESULTS OBJECT FROM THE AJAX RESPONSE IS BEING DEFINED IN RESULTS VARIABLE
	var results = response.results;

	// var listingNumber = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	//LOOPING THROUGH EVERY RESULT AND GETTING THE ID AND MARKET NAME
	for (var i = 0; i < 10; i++) {
		id = results[i].id;
		name = results[i].marketname;

		console.log(id + name);

		//PRINTING 10 NAMES ON HTML
		var listItem = $('<li>');
		listItem.attr('id', id);
		listItem.addClass('market-list');
		listItem.attr('listing-number', i);
		listItem.text(name);

		$('#marketList').append(listItem);

		getMarketDetails(id);
	} //END OF FOR LOOP
}

//SEARCH FARMERS MARKETS BY ZIPCODE API AND GET ID AND MARKETNAME
function getMarketIdFromZipCode(zip) {
	var id = '';
	var name = '';
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip,
		dataType: 'jsonp',
		jsonpCallback: 'searchResultsHandler'
	}); //END OF AJAX CALL
}

function detailResultHandler(detailResults) {
	for (var key in detailResults) {
		//variables to hold results of second usda API call.  Results printed to HTML in onclick event
		var address = detailResults.marketdetails.Address;
		var gLink = detailResults.marketdetails.GoogleLink;
		var schedule = detailResults.marketdetails.Schedule;
		var products = detailResults.marketdetails.Products;
		console.log('address', address);

		// geocodeAddress(new google.maps.Geocoder(), map, address);

		// // var thisID = ($(this).id());
		// $('#marketList').html(
		// 	"<a target='_blank' href= " +
		// 		gLink +
		// 		'>Google Link</a>' +
		// 		'<p> Address: ' +
		// 		address +
		// 		'</p>' +
		// 		'<p> Schedule: ' +
		// 		schedule +
		// 		'</p>' +
		// 		'<p> Products: ' +
		// 		products +
		// 		'</p>'
		// );
	} //end for loop
}
//--------------------------------------------------------------------------------------------------------------------------
//PASSING MARKET ID INTO THE FUNCTION BELOW TO GET THE OTHER DEATAILS
function getMarketDetails(argID) {
	//$('#marketList').html('');
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		// submit a get request to the restful service mktDetail.
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + argID,
		dataType: 'jsonp',
		jsonpCallback: 'detailResultHandler'
	}); //end ajax call
} //end getSecondResults function

//--------------------------------------------------------------------------------------------------
// PUTS A MARKER IN RELATION TO EACH NAME OF EACH MARKET
function geocodeAddress(geocoder, resultsMap, address) {
	geocoder.geocode({ address: address }, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		} else {
			console.log('Geocode was not successful for the following reason: ' + status);
		}
	});
}
