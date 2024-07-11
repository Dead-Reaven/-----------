document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    });
    const newUser = await response.json();
    alert(`User added with ID: ${newUser.id}`);
});

document.getElementById('scoreForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const userId = document.getElementById('user_id').value;
    const date = document.getElementById('date').value;
    const score = document.getElementById('score').value;

    const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, date, score })
    });
    const newScore = await response.json();
    alert('Score added');
});

async function loadScores(userId) {
    const response = await fetch(`/api/scores/${userId}`);
    const scores = await response.json();
    const scoresDiv = document.getElementById('userScores');
    scoresDiv.innerHTML = '';
    scores.forEach(score => {
        const div = document.createElement('div');
        div.textContent = `Date: ${score.date}, Score: ${score.score}`;
        scoresDiv.appendChild(div);
    });
}

// For demonstration, loading scores for a user with ID 1
loadScores(1);
