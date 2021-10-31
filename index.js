const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('VROMON server is running...');
})

app.listen(port, () => {
    console.log('VROMON server is running at port:', port);
})