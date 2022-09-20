const express = require('express')
const app = express()
const port = 3002

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json())


app.get('/destinations', (req, res) => {
  res.send('Hello World!')
})
app.post("/destinations", function(req, res) {
    console.log(req.body); // This is not working now
    
    res.send("Post request")
})
app.put("/destinations/:id", (req, res) => {
    res.send("Put")
    console.log(req.params.id);
})
app.delete("destintations/:id", (req, res) => {
    res.send("Delete")
    console.log(req.params.id);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})