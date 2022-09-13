var searchFormEl = $('#search-form');
var centuryButtonsEl = $('#century-buttons');
var artistInputEl = $('#artist');
var artworkContainerEl = $('#artwork-container');
var artistSearchTerm = $('#artist-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var artist = $("#artist").val().trim();

  if (artist) {
    getArtist(artist);

    artworkContainerEl.textContent = '';
    artistInputEl.value = '';
  } else {
    alert('Please enter an artist name');
  }
};

var buttonClickHandler = function (event) {
  var century = event.target.getAttribute('data-century');

  if (century) {
    getCentury(century);

    artworkContainerEl.textContent = '';
  }
};

var getArtist = function (artist) {
  var apiUrl = "https://openaccess-api.clevelandart.org/api/artworks?limit=20&artist="+ artist;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          // display
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Cleveland API');
    });
};

searchFormEl.on('submit', formSubmitHandler);
centuryButtonsEl.on('click', buttonClickHandler);
