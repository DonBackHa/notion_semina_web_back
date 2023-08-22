require("dotenv").config()
const express = require("express")
const notion = require("./notion")
const cors = require('cors')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.send("HI")
})

app.get('/types', async (req, res) => {
    console.log('---- get types')
    const types= await notion.getTypes()
    res.send(types)
})

app.get('/rows', async (req, res) => {
    console.log('---- get rows')
    const rows= await notion.getRows()
    res.send(rows)
})

app.post('/create-row' , jsonParser, async (req, res) =>{
    console.log('---- post create row')
    await notion.creatRow(req.body.data)
    res.send({type : 'success'})
})


app.listen(process.env.PORT, 'localhost')
