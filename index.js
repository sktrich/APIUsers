import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

// console.log('DATABASE_URL:', process.env.DATABASE_URL)
const prisma = new PrismaClient()

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

app.listen(3000)

/*
    Criar API de Usuários
    
    - Criar um usuário
    - Listar todos os usuários
    - Editar um usuário
    - Deletar um usuário

    1) tipo de rota / método HTTP
    2) endereço
*/

/*
db mongo
user "admin"
pass "oN5NkXHcMEpiOSMj"
db "Cluster0"

mongodb+srv://admin:oN5NkXHcMEpiOSMj@cluster0.qrmyg.mongodb.net/
mongodb+srv://admin:<db_password>@cluster0.qrmyg.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0   <<<<<

 */