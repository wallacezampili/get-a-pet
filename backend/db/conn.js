const mongoose = require('mongoose');

async function main()
{
    await mongoose.connect('mongodb+srv://wallaceDB:Ls4nvtuAF8OVndDL@getapet.ybujga8.mongodb.net/');
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log(err)
});

module.exports = mongoose;
