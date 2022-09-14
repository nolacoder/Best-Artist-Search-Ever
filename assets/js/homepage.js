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
  var apiUrl = "https://openaccess-api.clevelandart.org/api/artworks?limit=20&artists=" + artist;

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
var getCentury = function (century) {
  var twentyOneUrl = 'https://openaccess-api.clevelandart.org/api/artworks?limit=20&created_before=2021&created_after=2000';
  var twentyUrl = 'https://openaccess-api.clevelandart.org/api/artworks?limit=20&created_before=2000&created_after=1900';
  var nineteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?limit=20&created_before=1900&created_after=1800';
  var eighteenUrl = 'https://openaccess-api.clevelandart.org/api/artworks?limit=20&created_before=1800&created_after=1700';
  if (century === "21st Century") {
    fetch(twentyOneUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayArtwork(data, century);
        });
      } else {
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
var displayArtwork = function (artwork, searchTerm) {
  artworkContainerEl.html('');
  console.log(artwork.data.length);
  if (artwork.data.length === 0) {
    artworkContainerEl.text('No repositories found.');
    return;
  }

  artistSearchTerm.text(searchTerm);

  for (var i = 0; i < artwork.data.length; i++) {
    var artworkName = artwork.data[i].title;

    var artWorkEl = $('<a>');
    // add materialize to these <a> elements
    artWorkEl.addClass('list-item flex-row justify-space-between align-center');
  //  add links to <a> elements

    var titleEl = $('<span>');
    titleEl.text(artworkName);

    artWorkEl.append(titleEl);

    artworkContainerEl.append(artWorkEl)
  }
};

searchFormEl.on('submit', formSubmitHandler);
centuryButtonsEl.on('click', buttonClickHandler);
