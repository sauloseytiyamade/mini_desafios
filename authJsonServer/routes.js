const express = require('express')
const routes = express.Router()
const crypto = require('crypto')
const secret = 'bf3c199c2470cb477d907b1e0917c17b'
const BASE_URL_JSON_SERVER = 'http://localhost:3000'
const axios = require('axios')

// Obs.: Como este é um mini desafio e este código não vai para produção
// resolvi colocar as funções de criptografia dentro do router para agilizar o desenvolvimento
// caso você deseje colocar este código em produção, é interessante que as funções de criptografia
// fiquem em arquivos separados, bem como os endpoints.

// Função para criptografar a senha
const encrypt = (value) => {
    const iv = Buffer.from(crypto.randomBytes(16))
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv)
    let encrypted = cipher.update(value)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

// Função para decriptografar a senha
const decrypt = (value) => {
    const [iv, encrypted] = value.split(':')
    const ivBuffer = Buffer.from(iv, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), ivBuffer)
    let content = decipher.update(Buffer.from(encrypted, 'hex'))
    content = Buffer.concat([content, decipher.final()])
    return content.toString()
}

// Endpoint para cadastrar usuário
routes.post('/cadastrar', (req, res) => {
    let {password, username} = req.body
    password = encrypt(password)
    axios.post(`${BASE_URL_JSON_SERVER}/logins`,{
        username_db: username,
        password_db: password
    })
    .then(resp => {
        res.json({'message': 'cadastrado'})
    })
})

// Endpoint para fazer login
routes.post('/login', (req, res) => {
    let {password, username} = req.body
    axios.get(`${BASE_URL_JSON_SERVER}/logins?username_db=${username}`)
    .then(resp => {
        if(resp.data.length >= 1){
            const password_decrypt = decrypt(resp.data[0].password_db)
            if(password == password_decrypt){
                res.json({'message': 'login'})
            }else{
                res.json({'message': 'not login'})
            }
        }else{
            res.json({'message': 'user not exist'})
        }
    })
})

module.exports = routes