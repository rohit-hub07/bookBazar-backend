import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const db = () => { 
  mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to Db!'))
  .catch((err) => console.log('Failed connecting to DB',err))
}

export default db;