import fs from 'fs'
import path from 'path'

const jsonPath = path.join(process.cwd(), 'src', 'swagger', 'books.json')
const swaggerDocs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

export default swaggerDocs
