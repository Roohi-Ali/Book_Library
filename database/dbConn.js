
const mongoose = require('mongoose');
// console.log(process.env.DATABASE_URI)
const dbData = async ()=>{
    try{
        const con = await mongoose.connect(process.env.DATABASE_URI)
        console.log('mongodb connected '+ con.connection.host)
    } catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = dbData
// export default dbData