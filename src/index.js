const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://Rajnigandha-2402:LG1AyAT8nJB77pPC@cluster0.t7g9trm.mongodb.net/Task'
)
.then(() => console.log('MongoDB is connected'))
.catch(err => console.log(err))
 
app.use('/', route)

app.listen( 3000, function(){
    console.log('Express app running on port ' + (3000))
})