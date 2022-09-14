var recentSearches = $('.recent-searches');
//add 
var recentSearchesList = JSON.parse(window.localStorage.getItem('history')) || [];


// var highScores = document.querySelector('.new-score');

// for (var i = 0; i < highScoresList.length; i++){
//     var newScore = document.createElement('li');
//     newScore.textContent = highScoresList[i].initials + " " + highScoresList[i].score
//     highScores.appendChild(newScore);
// }
