document
	.getElementById('userForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault()
		const name = document.getElementById('name').value

		const response = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		})
		const newUser = await response.json()
		alert(`User added with ID: ${newUser.id}`)
	})

document
	.getElementById('scoreForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault()
		const userId = document.getElementById('user_id').value
		const date = document.getElementById('date').value
		const score = document.getElementById('score').value

		const response = await fetch('/api/scores', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id: userId, date, score }),
		})
		const newScore = await response.json()
		alert('Score added')
	})

async function loadScores(userId) {
	try {
		const response = await fetch(`/api/scores/${userId}`)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const scores = await response.json()
		const scoresDiv = document.getElementById('userScores')
		scoresDiv.innerHTML = ''
		scores.forEach((score) => {
			const div = document.createElement('div')
			div.textContent = `Date: ${score.date}, Score: ${score.score}`
			scoresDiv.appendChild(div)
		})
	} catch (error) {
		console.error('Failed to load scores:', error)
		alert('Failed to load scores. Please check the console for more details.')
	}
}

// For demonstration, loading scores for a user with ID 1
loadScores(1)
