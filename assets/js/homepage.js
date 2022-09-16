// Global variable capturing elements in html
var searchFormEl = $('#search-form');
var centuryButtonsEl = $('#century-buttons');
var artistInputEl = $('#artist');
var artworkContainerEl = $('#artwork-container');
var artistSearchTerm = $('#artist-search-term');

artworkContainerEl.on("click", "a", function (e) {
  $('#modalContent').html("")
  console.log(e.target);
  $('.modal').modal().modal("open");
  var target = e.target;
  if ($(target).attr('data-img-url')) {
    var images = $(target).attr('data-img-url');
    var imageStore = $('<img>');
    imageStore.attr('src', images);
    $('#modalContent').append(imageStore);
  } else {
    var noImageText = $('<p>');
    noImageText.text("Sorry! This artwork has no image to display!")
    $('#modalContent').append(noImageText);
  }

  var modalUrl = $(target).attr('data-art-url');
  var modalUrlEl = $('<a>');
  modalUrlEl.attr('href', modalUrl);
  modalUrlEl.attr('target', '_blank');
  modalUrlEl.text(modalUrl);

  $('#modalContent').append(modalUrlEl)
  var modalHeader = $(target).attr('data-artworkName');
  $('#modalHeader').text("View more info here!");
})

// 4.1 Define the function formSubmitHandler
var formSubmitHandler = function (event) {
  // Prevents the default behavior; for forms this prevents the page from reloading automatically
  event.preventDefault();

  // Create a vairable using jQuery, targeting id artist, getting its value and trimming any additional spaces
  var artist = $("#artist").val().trim();

  // if/else statement; if artist is truthy then execute this block
  if (artist) {
    // Starts the link to the API to get artist info
    getArtist(artist);

    // 4.3 Removes the value of the artist from the search box
    artistInputEl.val("");
  }
  // If you click without entering a name then the alert will pop up
  else {
    alert('Please enter an artist name');
  }
};

// 5.1 Defines the buttonCLickHandler function with a event object stored in it
var buttonClickHandler = function (event) {
  // Creates a variable which targets the event object and grabs the data-century attribute from the button
  var century = event.target.getAttribute('data-century');

  // If century is truthy, run this code block
  if (century) {
    // Calls the getCentury passing the century variable
    getCentury(century);
  }
};

// 4.2 Defining the getArtist function that will pass in the name of the artist
var getArtist = function (artist) {
  // This is the url where the request will be sent
  var apiUrl = "https://openaccess-api.clevelandart.org/api/artworks?artists=" + artist;

  // Creating another variable that is an object, saving the artist that was searched as the value for the savedArtist property
  var artistInput = {
    savedArtist: artist,
  }

  // Going to local storage and pulls the savedArtist, parses it into object notation or creates an empty array
  var savedArtist = JSON.parse(localStorage.getItem("savedArtist")) || [];

  // The savedArtist array will added to the front of the array
  savedArtist.unshift(artistInput);

  // This puts the updated artistInput array into the local storage
  localStorage.setItem("savedArtist", JSON.stringify(savedArtist));

  // Then we call renderSearches again so the new search displays immediately
  renderSearches();

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayArtwork(data, artist);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Cleveland API');
    });
};

// 5.2 Defining a function getCentury passing in a century parameter
var getCentury = function (century) {
  // Here we have variables for every century API call
  var twentyOneUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_after=2000';
  var twentyUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=2000&created_after=1900';
  var nineteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1900&created_after=1800';
  var eighteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1800&created_after=1700';

  // If the century parameter is equal to this string 
  if (century === "21st Century") {
    // Then fetch the twentyOneUrl and a promise is passed. The promise has a function that returns a response object
    fetch(twentyOneUrl).then(function (response) {
      // If the response returned is ok, do this code block
      if (response.ok) {
        // The response is turned into object notation, then another promis is passed with a function that returns data
        response.json().then(function (data) {
          console.log(data);
          // Calling the displayArtwork function and passing the data returned and the century parameter from earlier as a the arguments for the function
          displayArtwork(data, century);
        });
      } // If the response is bad then alert the response status text
      else {
        alert('Error: ' + response.statusText);
      }
    });
  } else if (century === "20th Century") {
    fetch(twentyUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayArtwork(data, century);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  } else if (century === "19th Century") {
    fetch(nineteenUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayArtwork(data, century);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  } else if (century === "18th Century") {
    fetch(eighteenUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayArtwork(data, century);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    });
  }
}

// 5.3 Defining a function names dsiplayArtwork taking in the parameters artwork and searchTerm
var displayArtwork = function (artwork, searchTerm) {
  // Looks for artworkContainer and clears the html
  artworkContainerEl.html('');
  console.log(artwork.data.length);
  // If statements saying if its not receieving any data then do next line
  if (artwork.data.length === 0) {
    // Displays this test if no data
    artworkContainerEl.text('No artwork found. Check your spelling or try another artist!');
    // Return out of the function afterwards
    return;
  }

  // Display the search term from the user input
  artistSearchTerm.text(searchTerm);

  // Takes the result of the getRandomArtwork function passing in the artowrk.data array and the number of items we want (20) then stores it in a variable
  var shuffledArtworkArray = getRandomArtwork(artwork.data, 20)

  // Run a for loop for the array just created
  for (var i = 0; i < shuffledArtworkArray.length; i++) {
    // Looks for the title property in all of the array objects inside the shuffled artowrk array stores it in variable
    var artworkName = shuffledArtworkArray[i].title;
    var artPage = shuffledArtworkArray[i].url;

    // Creating an anchor tag 
    if (shuffledArtworkArray[i].images) {
      var imageUrl = shuffledArtworkArray[i].images.web.url;
      var artWorkEl = $(`<a class="waves-effect waves-light btn modal-trigger" data-artworkName="${artworkName}" data-img-url="${imageUrl}" data-art-url="${artPage}">`);
    } else {
      var artWorkEl = $(`<a class="waves-effect waves-light btn modal-trigger" data-artworkName="${artworkName}" data-art-url="${artPage}">`);
    }

    // Creating a button dynamically over the next 3 lines
    var favBtn = $('<button>');
    //to do change the heart button inline with the title name and paste to the right of artEl
    favBtn.addClass('btn btn-success col-1');
    favBtn.text(`❤️`);
    // add materialize to these <a> elements

    // Adds classes to anchor element
    artWorkEl.addClass('list-item flex-row justify-space-between align-center d-flex');
    //  add links to <a> elements

    // creating a span element
    var titleEl = $('<span>');
    titleEl.addClass('col-11')
    // Displays the name of the artwork piece
    titleEl.text(artworkName);

    // Puts the button to the title element
    // Puts the title element to the artWork element on the DOM
    artWorkEl.append(titleEl);
    artWorkEl.append(favBtn);
    // Put the artwork element on the artwork container
    artworkContainerEl.append(artWorkEl);

    // $('.modal').modal();
  }
};

// 1.1 This function puts locally stored searches onto the page
// Puts search history into the page
var renderSearches = function () {
  // This line grabs the searchhistory ID and clears the element
  $('#searchHistory').html("");
  // This creates a variable that either stores the local "savedArtist" item or creates an empty array
  var savedArtist = JSON.parse(localStorage.getItem("savedArtist")) || [];

  // This for loop goes through the length of the savedArtist array
  for (i = 0; i < savedArtist.length; i++) {
    // For each array object a button element is created
    var savedArtistListItem = $('<button>');
    // Classes are added to the button element
    savedArtistListItem.addClass("btn btn-secondary")
    // For the button you make the text the property value corresponding to savedArtist
    savedArtistListItem.text(savedArtist[i].savedArtist);
    // Grabbing the id search history and appending savedArtistListItem button
    $('#searchHistory').append(savedArtistListItem);
  }
}

// 2.1 Defining the renderFavorites function
var renderFavorites = function () {
  // Targeting the id favorites element and emptying out any html inside of it
  $('#Favorites').html("");
  // Finds a key value pair that matches savedArt, then parses it into JSON objects or makes an empty array if no key value pair is there 
  var savedFavorites = JSON.parse(localStorage.getItem("savedArt")) || [];

  // For loop going through savedFavorites array
  for (i = 0; i < savedFavorites.length; i++) {
    // Creates a button for each array element
    var savedArtListItem = $('<button>');
    // Add classes to the button
    savedArtListItem.addClass("btn btn-secondary")
    // Making the text of the button equal to the savedArt property value in the array object
    savedArtListItem.text(savedFavorites[i].savedArt);
    // Targets the favorites id in the html and appends the button with the searched value on it
    $('#Favorites').append(savedArtListItem);
  }
}

function getRandomArtwork(array, num) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

// 1. This function executes first
renderSearches();

// 2. This function executes second
renderFavorites();

// 3. The page waits for either of these events to happen and will execute the function
// 4. When you click submit the search we go to the formSubmitHandler function
searchFormEl.on('submit', formSubmitHandler);

// 5. Takes the century button from the top of the pages, adds a click event to it and calls the buttonClickHandler function
centuryButtonsEl.on('click', buttonClickHandler);

// 6. Waits for users to click on the search history buttons
// This is an event delegation function that looks for a button to be clicked in the search history id
$('#searchHistory').on("click", "button", function (e) {
  // This variable references the specific button that was clicked
  var historyEl = e.target
  // Runs the getArtist function passing the name of the button
  getArtist($(historyEl).text())
})

// 7. Waits for users to click on the favorite buttons
// This is an event delegation function that looks for a button to be clicked in the search history id
$('#artwork-container').on("click", "button", function (e) {
  console.log(e);
  // Create a variable targetting the heart button
  var favoriteEl = e.target;
  // Create another variable taking the text from the target element parent
  var favTitle = $(favoriteEl).parent().text();
  // Creating a object caleed favInput which has the savedArt property with a value of the favTitle variable
  var favInput = {
    savedArt: favTitle,
  }
  // Creates an array taken from local storage that stores local data or an empty array
  var savedArt = JSON.parse(localStorage.getItem("savedArt")) || [];

  // Puts the last favorite at the beginning of the array
  savedArt.unshift(favInput);
  // Saves the array to local storage under savedArt
  localStorage.setItem("savedArt", JSON.stringify(savedArt));
  //put renderFavorites function in this event clicker for the dynamically created
  renderFavorites();
})

