import express, { NextFunction, Request, Response } from 'express'
import envConfig from './config/evnConfig'

const app = express()
const PORT = envConfig.PORT || 8080

app.use(express.json())

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`My app is running on port: ${PORT}`)
})
