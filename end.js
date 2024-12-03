const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const username = localStorage.getItem('username');

finalScore.innerText = mostRecentScore;

function saveHighScore() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    const score = {
        score: mostRecentScore,
        name: username
    };
    
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('highscores.html');
}
