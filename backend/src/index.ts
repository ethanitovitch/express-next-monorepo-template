import cors from 'cors'
import express from 'express'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(8000, () => {
  console.log(`Server is running on port 8000`)
})

export default app
