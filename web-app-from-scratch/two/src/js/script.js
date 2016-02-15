(function() {
	'use strict';

	var main = document.querySelector('main');
	// Get handlebars template parts
	var templates = {
		songs: document.querySelector('#songs').innerHTML,
		searchform: document.querySelector('#search').innerHTML,
		noSearchResults: document.querySelector('#no-restult').innerHTML
	}

	var app = {
		init: function() {

			// call the routes.init
			routes.init();

		}
	}

	var routes = {
		init: function() {

			// routers for all the elements on the page
			routie({
				// if the url has no hash, set hash to search
				'': function() {
					routie('search');
				},
				'search': function() {
			    	var title = "Search";
			    	soundCloud.init(title);
			    },
				'all': function() {
			    	var title = "All songs";
			    	soundCloud.init(title);
			    }
			});

		}
	}

	var soundCloud = {
		init: function(title) {

			// soundcloud url data
			var sc = {
				BaseUrl: "https://api.soundcloud.com",
				tracks: "tracks?client_id=2fda30f3c5a939525422f47c385564ae",
				users: "users?client_id=2fda30f3c5a939525422f47c385564ae"
			}
			// Ajax call
			nanoajax.ajax({url: sc.BaseUrl + '/' + sc.tracks}, function(amount, data) {

				// store data
				var rawData = JSON.parse(data);

				// Choose wich template to render
				
				//Ik zou kijken of er een manier is om deze statements dynamisch samen te voegen tot 1 statement,
				//op die manier hoef je niet weer een if statement te schrijven als er nog een pagina bij komt
				//die data nodig heeft. Je zou hiervoor eventueel naar de _.uniqueId functionaliteit van underscore kunnen kijken.
				if ( title === "Search" ) {

					template.renderForm(rawData);

				}
				if ( title === "All songs" ) {

					template.render(rawData, templates.songs);

				}

			});

		}
	}

	// Render the templates
	var template = {
		render: function(data, htmlTemplate) {

			// Render template with handlebars
			var template = Handlebars.compile(htmlTemplate);
			var html = template(data);
			main.innerHTML = html;

			handle.detail();

		},
		renderForm: function(rawData) {

			// render the searchform template
			this.render(rawData, templates.searchform);
			// call the search
			handle.search(rawData);

		}
	}

	// data transformeren
	var handle = {
		search: function(rawData) {

			var submitButton = document.querySelector('#submit');
			submitButton.onclick = function() {
			
				var searchValue = document.querySelector('#song').value;

				var matchingData = [];

				_.filter(rawData, function(matched) {

					// if the title or genre of a object matches
				    if( matched.title && matched.title.match(searchValue) || matched.genre && matched.genre.match(searchValue)) {

				    	// push this data in the matchingdata array
						matchingData.push(matched);

				    }
				   
				});   

				// if there are search results
				if( matchingData.length ) {

					template.render(matchingData, templates.songs);	

				}
				// if there are no search results
				else {

					var message = {
						title: "no search results match";
					}
				
					template.render(message, templates.noSearchResults);						

				}

			}

		}, 
		detail: function() {

			var songs = document.querySelectorAll('.songs');

			// If there are songs shown
			if ( songs.length ) {

				// Prototype version
				// 		Make array
				// 		Loop through
				// 		.call: add data one by one
				// 		put data in the parameter songs
				[].forEach.call(songs, function(songs) {

					songs.onclick = function() {
						
						// Show detail items of this item on the page
						main.innerHTML = this.innerHTML;

					}

				});

			}

		}
	}

	// start the main app
	app.init();

})();
