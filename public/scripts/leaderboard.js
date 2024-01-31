import * as frontend from "./frontend.js"

const body = document.body
const leaderboard = document.getElementById("leaderboard")

body.onload = () => {
    frontend.SendPost('leaderboard', {})
    .then(res => {
        if (res.error){
            alert("Failed to get highscore list.")
            window.location.href = "../"
        }else{
            res.list.forEach(user => {
                const row = document.createElement("div")
                row.classList.add("leaderboard-row")

                const name = document.createElement("a")
                name.classList.add("text", "leaderboard-name")
                name.innerHTML = user.name

                const score = document.createElement("a")
                score.classList.add("text", "leaderboard-score")
                score.innerHTML = user.score

                row.appendChild(name)
                row.appendChild(score)
                
                leaderboard.appendChild(row)
            });
        }
    })
}