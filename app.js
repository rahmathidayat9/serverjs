const server = require('server')
const { get, post, put, del } = server.router
const morgan = require('morgan')
const { v4 } = require('uuid')
const db = require('./config/database')
  
const logger = server.utils.modern(morgan('dev'))

server({ port: 8080, security: { csrf: false } }, [logger], [
    get('/', async (ctx) => {
        return ctx.res.send("Uwoogh Hotaru!")
    }),
    get('/users', async (ctx) => {
        try {
            let users = await db('users')
                .select()

            return ctx.res.json(users)
        } catch(e) {
            return ctx.res.send(e)
        }
    }),
    post('/users', async (ctx) => {
        try {
            await db('users').insert({
                id: v4(),
                name: ctx.req.body.name,
                age: ctx.req.body.age,
            })

            return ctx.res.send("Data saved successfully!")
        } catch(e) {
            return ctx.res.send(e)
        }
    }),
    get('/users/:id', async (ctx) => {
        try {
            let user = await db('users')
                .where({ id: ctx.req.params.id })
                .select()
                .first()
            
            return ctx.res.json(user)
        } catch(e) {
            return ctx.res.send(e)
        }
    }),
    put('/users/:id', async (ctx) => {
        try {
            await db('users')
                .where({ id: ctx.req.params.id })
                .update({
                    name: ctx.req.body.name,
                    age: ctx.req.body.age,
                })

            return ctx.res.send("Data updated successfully!")
        } catch(e) {
            return ctx.res.send(e)
        }      
    }),
    del('/users', async (ctx) => {
        try {
            await db('users')
                .where({ id: ctx.req.query.id })
                .del()

            return ctx.res.send("Data deleted successfully!")
        } catch(e) {
            return ctx.res.send(e)
        }
    })

])