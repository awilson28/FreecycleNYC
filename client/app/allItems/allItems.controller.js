'use strict';

angular.module('freeNycApp')
  .controller('AllitemsCtrl', function ($scope, offersOnlyFilter, wantedOnlyFilter, postService) {
	
	var vm = this; 
	$scope.keywords = ""; 
	$scope.keywordsArray = []; 

	initialize()

	$scope.address = []; 

	vm.submitKeywords = function(){
		postService.filterData($scope.keywords, function(results){
			$scope.allPosts = results
		})
	}


	vm.getWanteds = function(){
		postService.getData(function(results){
			$scope.address = [];
			$scope.allPosts = wantedOnlyFilter(results, 'postType');
			for (var i = 0; i < results.length; i++){
				$scope.address.push(results[i].crossStreets)
			}		
		})
	}

	vm.getOffereds = function(){
		postService.getData(function(results){
			$scope.address = [];
			$scope.allPosts = offersOnlyFilter(results, 'postType');
			for (var i = 0; i < results.length; i++){
				$scope.address.push(results[i].crossStreets)
			}		
		})
	}

	vm.getPosts = function(){
		postService.getData(function(results){
			$scope.address = [];
			$scope.allPosts = results;
			for (var i = 0; i < results.length; i++){
				$scope.address.push(results[i].crossStreets)
			}
		}); 
	}


	vm.deleteOption = function(id){
		postService.deletePost(id, function(){
			vm.getPosts()
		})
	}

	var geocoder;
	var map;

	function initialize() {
	  geocoder = new google.maps.Geocoder();
	  var latlng = new google.maps.LatLng(-34.397, 150.644);
	  var mapOptions = {
	    zoom: 8,
	    center: latlng, 
	    componentRestrictions: {locality: 'new york city' }
	  }
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}

	function codeAddress(address, postObj) {
	  // var address = document.getElementById('address').value;
	  //extends bounds 
	  var bounds = new google.maps.LatLngBounds();
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
	      bounds.extend(results[0].geometry.location)
	      var infowindow = new google.maps.InfoWindow({
	      	content: '<p>' + postObj.postTitle + '</p>'
	      })
	      
	      var marker = new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location	      
	      });

	       google.maps.event.addListener(marker, 'click', function() {
    				infowindow.open(map,marker);
  			});

	   }
	    // } else {
	    //   alert('Geocode was not successful for the following reason: ' + status);
	    // }
	  });
	  //doesn't relocate to the ocean's middle if array.length === 0 
	  if(!bounds.isEmpty()) {map.fitBounds(bounds);}
	}

	google.maps.event.addDomListener(window, 'load', initialize);


	
	function setMap(){
		for (var i = 0; i < $scope.allPosts.length; i++){
			codeAddress($scope.address[i], $scope.allPosts[i])
		}
	}

	vm.getPosts();

	setTimeout(function(){
		setMap()
	}, 100)	


  })
  .filter('offersOnly', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			if (items[i].postType === 'offered') {
  				console.log('item', items)
  				filtered.push(items[i])
  			}
  		}
  	return filtered;
  	}
  })
  .filter('wantedOnly', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			if (items[i].postType === 'wanted') {
  				console.log('item', items)
  				filtered.push(items[i])
  			}
  		}
  	return filtered;
  	}
  })
  .directive('ngEnter', function(){
  	return function(scope, element, attrs){
  		element.bind('keydown keypress', function(event){
  			if (event.which === 13){
  				scope.$apply(function(){
  					scope.$eval(attrs.ngEnter, {'event': event});
  				});
  				event.preventDefault();
  			}
  		});
  	};
  });
