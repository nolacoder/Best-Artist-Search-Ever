// Global variable capturing elements in html
var searchFormEl = $('#search-form');
var centuryButtonsEl = $('#century-buttons');
var artistInputEl = $('#artist');
var artworkContainerEl = $('#artwork-container');
var artistSearchTerm = $('#artist-search-term');

artworkContainerEl.on("click", "a", function (e) {
  $('#modalContent').html("")
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
  modalUrlEl.text("View more info here!");

  $('#modalContent').append(modalUrlEl)
  var modalHeader = $(target).attr('data-artworkName');
  $('#modalHeader').text(modalHeader);
})

// 4.1 Define the function formSubmitHandler
var formSubmitHandler = function (event) {
 
  event.preventDefault();
  
  var artist = $("#artist").val().trim();

  if (artist) {
    
    getArtist(artist);

    artistInputEl.val("");
  }
};

// 5.1 Defines the buttonCLickHandler function with a event object stored in it
var buttonClickHandler = function (event) {
  
  var century = event.target.getAttribute('data-century');

  // If century is truthy, run this code block
  if (century) {
    // Calls the getCentury passing the century variable
    getCentury(century);
  }
};

// 4.2 Defining the getArtist function that will pass in the name of the artist
var getArtist = function (artist) {
  
  var apiUrl = "https://cors.sh/playground/" + "https://openaccess-api.clevelandart.org/api/artworks?artists=" + artist;

  var artistInput = {
    savedArtist: artist,
  }

  var savedArtist = JSON.parse(localStorage.getItem("savedArtist")) || [];
 
  savedArtist.unshift(artistInput);

  localStorage.setItem("savedArtist", JSON.stringify(savedArtist));

  
  renderSearches();

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayArtwork(data, artist);
        });
      } 
    });
};

// 5.2 Defining a function getCentury passing in a century parameter
var getCentury = function (century) {
  // Here we have variables for every century API call
  var twentyOneUrl = 'https://cors.sh/playground/' + 'https://openaccess-api.clevelandart.org/api/artworks?created_after=2000';
  var twentyUrl = 'https://cors.sh/playground/' + 'https://openaccess-api.clevelandart.org/api/artworks?created_before=2000&created_after=1900';
  var nineteenUrl = 'https://cors.sh/playground/' + 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1900&created_after=1800';
  var eighteenUrl = 'https://cors.sh/playground/' + 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1800&created_after=1700';

  if (century === "21st Century") {
    fetch(twentyOneUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayArtwork(data, century);
        });
      }
    });
  } else if (century === "20th Century") {
    fetch(twentyUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
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
          displayArtwork(data, century);
        });
      } 
    });
  }
}

// 5.3 Defining a function names dsiplayArtwork taking in the parameters artwork and searchTerm
var displayArtwork = function (artwork, searchTerm) {
  artworkContainerEl.html('');
  if (artwork.data.length === 0) {
    artworkContainerEl.text('No artwork found. Check your spelling or try another artist!');
    return;
  }

  artistSearchTerm.text(searchTerm);

  var shuffledArtworkArray = getRandomArtwork(artwork.data, 20)

  for (var i = 0; i < shuffledArtworkArray.length; i++) {
    var artworkName = shuffledArtworkArray[i].title;
    var artPage = shuffledArtworkArray[i].url;

    if (shuffledArtworkArray[i].images) {
      var imageUrl = shuffledArtworkArray[i].images.web.url;
      var artWorkEl = $(`<a class="waves-effect waves-light btn modal-trigger" data-artworkName="${artworkName}" data-img-url="${imageUrl}" data-art-url="${artPage}">`);
    } else {
      var artWorkEl = $(`<a class="waves-effect waves-light btn modal-trigger" data-artworkName="${artworkName}" data-art-url="${artPage}">`);
    }


    var favBtn = $('<button>');

    favBtn.addClass('btn btn-success col-1');
    favBtn.text(`❤️`);

    artWorkEl.addClass('list-item flex-row justify-space-between align-center d-flex');

    var titleEl = $('<span>');
    titleEl.addClass('col-11')

    titleEl.text(artworkName);

    artWorkEl.append(titleEl);
    artWorkEl.append(favBtn);

    artworkContainerEl.append(artWorkEl);

  }
};

// 1.1 This function puts locally stored searches onto the page

var renderSearches = function () {

  $('#searchHistory').html("");

  var savedArtist = JSON.parse(localStorage.getItem("savedArtist")) || [];


  for (i = 0; i < savedArtist.length; i++) {
    var savedArtistListItem = $('<button>');

    savedArtistListItem.addClass("btn btn-secondary")
    savedArtistListItem.text(savedArtist[i].savedArtist);
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
  var favoriteEl = e.target;
  var favTitle = $(favoriteEl).parent().text();
  var favInput = {
    savedArt: favTitle,
  }
  var savedArt = JSON.parse(localStorage.getItem("savedArt")) || [];

  savedArt.unshift(favInput);
  localStorage.setItem("savedArt", JSON.stringify(savedArt));
  renderFavorites();
})

