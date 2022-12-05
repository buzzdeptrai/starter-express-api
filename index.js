const express = require('express')
const app = express()

app.get('/', (req, res) => {
    
    console.log("get home")
  res.send('Hello World!')
    
})

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
