import { connect } from 'mongoose';

export default () => connect('mongodb://localhost:27017/mydatabase')
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error(err)
    process.exit(1)
});

