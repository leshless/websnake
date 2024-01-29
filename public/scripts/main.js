import * as frontend from "./frontend.js"

const body = document.body
const signin = document.getElementById("signin")
const logout = document.getElementById("logout")
const username_display = document.getElementById("username-display")
const logout_button = document.getElementById("logout-button")

body.onload = () => {
    const session = localStorage.getItem("session")
    if (session){
        frontend.SendPost('user', {
            session: session
        })
        .then(res => {
            if (res.error){
                alert("Your session key is deprecated.")
                localStorage.removeItem("session")
                window.location.href = "./"
            }else{
                signin.style.zIndex = -1
                logout.style.zIndex = 1

                username_display.innerHTML = `${res.user.username} | `
            }

            leaderboard()
        })
    }
}

logout_button.onclick = () => {
    localStorage.removeItem("session")
    window.location.href = "./"
}