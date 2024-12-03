const highScoresList = document.getElementById("highScoresList");
const resetScoresBtn = document.getElementById("resetScores");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const mostRecentScore = localStorage.getItem("mostRecentScore");
const mostRecentUser = localStorage.getItem("username");

function updateHighScoresList() {
    highScoresList.innerHTML = highScores
        .sort((a, b) => b.score - a.score)
        .map((score, index) => {
            const isCurrentScore = score.score == mostRecentScore && score.name === mostRecentUser;
            return `<li class="high-score ${isCurrentScore ? 'current-score' : ''}">${index + 1}. ${score.name} - ${score.score}</li>`;
        })
        .join("");
}

resetScoresBtn.addEventListener('click', () => {
    localStorage.removeItem("highScores");
    highScores.length = 0; // Clear the array
    updateHighScoresList();
});

// Initial display of high scores
updateHighScoresList();
