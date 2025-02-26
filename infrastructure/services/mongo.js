import { connect } from 'mongoose';

const HOST=process.env.MONGO_HOST
const PORT=process.env.MONGO_PORT
const DB=process.env.MONGO_DB

export default () => connect(`mongodb://${HOST}:${PORT}/${DB}`)
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error(err)
    process.exit(1)
});

