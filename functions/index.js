/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");

const functions = require("firebase-functions")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// console.log('DATABASE_URL:', process.env.DATABASE_URL)

const app = express()

app.use(express.json())
//endereço do frontEnd que vai acessar
app.use(cors('http://localhost:5173'))

app.post('/users', async (req, res) =>{

    await prisma.user.create({
        data:{
            email: req.body.email,
            name:  req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)

})


app.get('/users', async (req, res) =>{

    let users = []
    if (Object.keys(req.query).length> 0) {

        const filters = {};

        if (req.query.name) {
            filters.name = req.query.name;
        }

        if (req.query.age) {
            const age = parseInt(req.query.age, 10);
            if (!isNaN(age)) {
                filters.age = age;
            }
        }

        if (req.query.email) {
            filters.email = req.query.email;
        }

         users = await prisma.user.findMany({
            where: filters
        });
        // users = await prisma.user.findMany({
        //     where:{
        //         name: req.query.name,
        //         age: parseInt(req.query.age,10),
        //         email: req.query.email
        //     }
        // })
    } else {
        users = await prisma.user.findMany()
    }

    res.status(200).json(users)
})

/* :id variavel criada para pegar id da requisição */
app.put('/users/:id', async (req, res) =>{

    await prisma.user.update({        
        
        where:{
            id: req.params.id

        },
        data:{
            email: req.body.email,
            name:  req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)

})



app.delete('/users/:id', async (req, res) =>{

    await prisma.user.delete({        
        
        where:{
            id: req.params.id

        },
    })

    res.status(200).json({message: "Usuário deletado com Sucesso"})

})

exports.app = functions.https.onRequest(app);
