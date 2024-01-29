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

            });
        }
    })
}