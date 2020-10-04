const formSend = document.getElementById('formSend')
const userNotFound = document.querySelector('.alert_userNotFound')
const welcomeSystem = document.querySelector('.alert_welcomeSystem')
const buttonLogin = document.querySelector('.button_login')
const buttonCadastrar = document.querySelector('.button_cadastrar')
const facaLogin = document.querySelector('.faca_login')

const BASE_URL = 'http://localhost:8800'

// Função recebe um parâmetro - Array de inputs
const persistLoginUser = (arr) => {
    const username = arr[0].value
    const password = arr[1].value
    axios.post(`${BASE_URL}/cadastrar`,{username, password})
        .then(resp => {
            if(resp.data.message == 'cadastrado'){
                welcomeSystem.innerHTML = 'Usuário cadastrado com sucesso'
                welcomeSystem.classList.remove('alert_welcomeSystem')
                setTimeout(() => {
                    welcomeSystem.innerHTML = 'Seja Bem Vindo ao Sistema'
                    welcomeSystem.classList.add('alert_welcomeSystem')
                    facaLogin.innerHTML = 'Faça o Login'
                    buttonCadastrar.style.display = 'none'
                    buttonLogin.style.display = 'inline'
                }, 3000);
            }
        })
}

// Função recebe um parâmetro - Array de inputs
const verifyUsernamePass = (arr) => {
    // Pega o usuário e senha dos arrays
    const username = arr[0].value
    const password = arr[1].value

    // Faz uma chamada para API de login
    axios.post(`${BASE_URL}/login`,{username,password})
        .then(resp => {
            // Verifica a resposta da API e toma uma ação
            switch (resp.data.message) {
                case 'not login':
                    userNotFound.innerHTML = 'Usuário ou senha inválido'
                    userNotFound.classList.remove('alert_userNotFound')
                    setTimeout(() => {
                        userNotFound.innerHTML = 'Usuário não cadastrado'
                        userNotFound.classList.add('alert_userNotFound')
                    }, 2000);
                    break
                case 'login':
                    welcomeSystem.classList.remove('alert_welcomeSystem')
                    setTimeout(() => {
                        welcomeSystem.classList.add('alert_welcomeSystem')
                    }, 3000);
                    break
                case 'user not exist':
                    userNotFound.classList.remove('alert_userNotFound')
                    buttonLogin.style.display = 'none'
                    buttonCadastrar.style.display = 'inline'
                    formSend.reset()
                    facaLogin.innerHTML = 'Cadastre-se'
                    setTimeout(() => {
                        userNotFound.classList.add('alert_userNotFound')
                    }, 3000);
                    break
                default:
                    break
            }
        })
}

// Pega o evento de click do formulário
formSend.addEventListener('submit', (event) => {
    event.preventDefault()
    const inputs = document.querySelectorAll('input')
    const inputsArr = Array.from(inputs)
    verifyUsernamePass(inputsArr)
})

// Pega o evento de click do botão cadastrar
buttonCadastrar.addEventListener('click',(event) => {
    const inputs = document.querySelectorAll('input')
    const inputsArr = Array.from(inputs)
    persistLoginUser(inputsArr)
})