'use strict';

angular.module('freeNycApp')
  .controller('AllitemsCtrl', function ($http, $scope, $rootScope, Auth, socket, joinKeywordsFilter, offersOnlyFilter, $interval, wantedOnlyFilter, postService, messageService) {
	
	var vm = this; 
	$scope.keywords = ""; 
	$scope.messageArray = [];
	$scope.biddedOn = {};
	$scope.bidPressed = {};
	$scope.messageForm = {};
	$scope.temp = {start: 0, end: 10}
  // GMAPS INITIALIZATION
	initialize()

	//we can either retrieve the current user info once and save it in the database
	//or we can retrieve it each time in every control to avoid refresh loss 
	var foo = function(){
		if (Auth.getCurrentUser().name){
			$scope.user = Auth.getCurrentUser()._id; 
			$scope.userEmail = Auth.getCurrentUser().email; 
		}
	}
	
  foo(); 

  $rootScope.$on('user:loggedIn', function(){
    console.log('-------------------------')
    foo(); 
  })

	////abstracted post retrieval function for all posts, wanted posts, and offered posts
	vm.getPosts = function(type){
		postService.getData(function(results){
			if (type === 'none'){
				$scope.allPosts = results;
			}
			else if (type === 'wanted'){
				$scope.allPosts = wantedOnlyFilter(results, 'postType');
			}
			else if (type === 'offered'){
				$scope.allPosts = offersOnlyFilter(results, 'postType');
			}
			for (var i = 0, len = $scope.allPosts.length; i < len; i++){
				codeAddress($scope.allPosts[i])
			}
			$scope.currentPosts = $scope.allPosts.slice($scope.temp.start, $scope.temp.end)
		}); 
	}

	//activates keywords search 
	vm.submitKeywords = function(){
		postService.filterData($scope.keywords).then(function(results){
			$scope.allPosts = results;
			$scope.currentPosts = $scope.allPosts.slice($scope.temp.start, $scope.temp.end)
		})
	}

	//pagination function  --- NEEDS FIXING
	vm.changePage = function(item){
		if (item === 'previous'){
			$scope.temp.start -= 10; 
			$scope.temp.end -= 10;
		}
		else {
			$scope.temp.start += 10;
			$scope.temp.end += 10; 
		}
		$scope.currentPosts = $scope.allPosts.slice($scope.temp.start, $scope.temp.end)
	}


	//click event that triggers a put request to add the user to the bids array
	//click event that displays the message form for items on the home page - message sent with bid request
	vm.bidOnItem = function(id, userId, index){
		$scope.biddedOn[index] = true;
		$scope.messageForm[index] = true;
		postService.populatePost(id, function(result){
			console.log('bid', result);
		})
	}

	//click event that sends a message to the owner of the item 
	vm.sendMessage = function(recipient, index) {
		$scope.messageArray[index].recipient = recipient;
		//added this line because with sockets, we cannot access the current user id with req.user._id
		$scope.messageArray[index].sender = $scope.user; 
		$scope.messageArray[index].email = $scope.userEmail; 
		// console.log('recipient', recipient)
		// console.log('body', $scope.messageArray[index])
		messageService.convoId.convoId = $scope.messageArray[index].recipient + $scope.user;
		$scope.messageArray[index].roomId = messageService.convoId.convoId;
		// console.log('convo id: ', messageService.convoId.convoId)
		socket.socket.emit('sendMessage', $scope.messageArray[index])
		socket.socket.on('MessageSent', function(data){
			$scope.messageForm[index] = false; 
			$scope.bidPressed[index] = true; 
			// console.log('data: ', data)
		})
	}

	
	/////////////////////// GOOGLE MAPS FUNCTIONALITY ///////////////////////////

	var map;
	var prev_infoWindow = false;
	var bounds

	function initialize() {
		var latlng,
				mapOptions; 
	  latlng = new google.maps.LatLng(40.7142700, -74.0059700);
	  mapOptions = {
	    zoom: 16,
	    center: latlng, 
	    componentRestrictions: {locality: 'new york city' }
	  }
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  bounds = new google.maps.LatLngBounds();
	}



	function codeAddress(postObj) {
		var myLatLng, 
				postObjInfo, 
				infowindow,
				marker; 

  	myLatLng = new google.maps.LatLng(postObj.coordinates[0], postObj.coordinates[1])
    map.setCenter(myLatLng);

		if (postObj.coordinates.length > 0){
      bounds.extend(myLatLng);
      postObjInfo = '<p id="infoTip">' + postObj.postTitle + " at " + postObj.crossStreets + '</p>';
      infowindow = new google.maps.InfoWindow({
      	content: postObjInfo
      })
      
      marker = new google.maps.Marker({
          map: map,
          position: myLatLng      
      });

       google.maps.event.addListener(marker, 'click', function() {
       	if ( prev_infoWindow ) {
       		prev_infoWindow.close();
       	}
     		prev_infoWindow = infowindow;
				infowindow.open(map,marker);
			});
		}

	  //doesn't relocate to the ocean's middle if array.length === 0 
	  if(!bounds.isEmpty()) {map.fitBounds(bounds);}
	}

	google.maps.event.addDomListener(window, 'load', initialize);	

	vm.getPosts("none");

  })
  .filter('offersOnly', function(){
  	return function(items){
  		var filtered = [], 
  				len,
  				i; 
  		for (var i = 0, len = items.length; i < len; i++){
  			if (items[i].postType === 'offered'){
  				filtered.push(items[i])
  			}
  		}
  		return filtered; 
  	}
  })
  .filter('wantedOnly', function(){
  	return function(items){
  		var filtered = [], 
  				len,
  				i;
  		for (var i = 0, len = items.length; i < len; i++){
  			if (items[i].postType === 'wanted'){
  				filtered.push(items[i])
  			}
  		}
  		return filtered; 
  	}
  })
  .filter('joinKeywords', function(){
  	return function(items){
  		if (items != null){
  			return items.join(' ');
  		}
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
  })
  .filter('capitalize', function() {
  	return function(input) {
  		var filtered = []; 
    	if (input!=null){
				var words = input.split(" ")
				for (var i = 0; i < words.length; i++){
					if (words[i] === 'and'){
						words[i] = '&'
					}
					var newWord = words[i].substring(0, 1).toUpperCase() + words[i].substring(1)
					filtered.push(newWord)				
				}
			}
		return filtered.join(" "); 
		}
	})
  .filter('capitalizeFirst', function() {
  	return function(input) {
    	if (input!=null) {
	    	return input.substring(0,1).toUpperCase()+input.substring(1);	
    	}
 		}
	})
