import * as frontend from "./frontend.js"

const body = document.body
const username_input = document.getElementById("username-input")
const password_input = document.getElementById("password-input")
const button = document.getElementById("login-button")

const username_expr = /^[a-z0-9]{5,15}$/
const password_expr = /^[a-zA-Z0-9@#$%^&*_]{5,20}$/

button.onclick = () => {
    let username = username_input.value 
    let password = password_input.value

    if(!username.match(username_expr)){
        alert("Username must contain only lowercase letters or numbers and be 5-15 characters length.")
        username_input.value = ""
        return
    }
    if(!password.match(password_expr)){
        alert("Password must contain only lowercase and uppercase letters, numbers, special characters and be 5-15 characters length.")
        password_input.value = ""
        return
    }

    frontend.SendPost('login', {
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