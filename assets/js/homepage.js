var searchFormEl = $('#search-form');
var centuryButtonsEl = $('#century-buttons');
var artistInputEl = $('#artist');
var artworkContainerEl = $('#artwork-container');
var artistSearchTerm = $('#artist-search-term');

//Event clicker on the artworkContainerEl
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
  $('#modalHeader').text(modalHeader);
})

//Define the function formSubmitHandler
var formSubmitHandler = function (event) {
  event.preventDefault();

  var artist = $("#artist").val().trim();

  if (artist) {
    getArtist(artist);

    artistInputEl.val("");
  }
};

// Defines the buttonCLickHandler function
var buttonClickHandler = function (event) {
  var century = event.target.getAttribute('data-century');

  if (century) {
    getCentury(century);
  }
};

// Defining the getArtist function
var getArtist = function (artist) {
  var apiUrl = "https://openaccess-api.clevelandart.org/api/artworks?artists=" + artist;

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
    })
};

// Defining a function getCentury
var getCentury = function (century) {
  var twentyOneUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_after=2000';
  var twentyUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=2000&created_after=1900';
  var nineteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1900&created_after=1800';
  var eighteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?created_before=1800&created_after=1700';

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
      }
    });
  } else if (century === "19th Century") {
    fetch(nineteenUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayArtwork(data, century);
        });
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

//Defining function dsiplayArtwork
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

//Defining renderSearches function
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

// Defining the renderFavorites function
var renderFavorites = function () {
  $('#Favorites').html("");
  var savedFavorites = JSON.parse(localStorage.getItem("savedArt")) || [];

  for (i = 0; i < savedFavorites.length; i++) {
    var savedArtListItem = $('<button>');
    savedArtListItem.addClass("btn btn-secondary")
    savedArtListItem.text(savedFavorites[i].savedArt);
    $('#Favorites').append(savedArtListItem);
  }
}

function getRandomArtwork(array, num) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

renderSearches();

renderFavorites();

searchFormEl.on('submit', formSubmitHandler);

centuryButtonsEl.on('click', buttonClickHandler);

// Event delegation function that looks for a button to be clicked in the search history id
$('#searchHistory').on("click", "button", function (e) {
  var historyEl = e.target
  getArtist($(historyEl).text())
})

// Event delegation function that looks for a button to be clicked in the search history id
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

