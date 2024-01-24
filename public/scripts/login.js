import * as frontend from "./frontend.js"

const username_input = document.getElementById("username-input")
const password_input = document.getElementById("password-input")
const button = document.getElementById("login-button")

button.onclick = () => {
    const username = username_input.value 
    const password = password_input.value
}


SendPost('login', {'key': 'value'})
.then(response => {
    console.log(response);
})
.catch(error => {
    console.error(error);
});