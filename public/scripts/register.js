import * as frontend from "./frontend.js"

const body = document.body
const username_input = document.getElementById("username-input")
const password_input = document.getElementById("password-input")
const button = document.getElementById("login-button")


button.onclick = () => {
    const username = username_input.value 
    const password = password_input.value

    frontend.SendPost('register', {
        username: username,
        password: password
    })
    .then(res => {
        if (res.error){
            alert(`Error: ${res.error}`)
        }else{
            localStorage.setItem("session", res.session)
            window.location.href = "../"
        }
    })
}

body.onload = () => {
    const session = localStorage.getItem("session")
    if (session != null){
        alert("You have already signed in account.")
        window.location.href = "../"
    }
}