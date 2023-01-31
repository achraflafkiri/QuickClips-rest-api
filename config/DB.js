const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/QuickClips", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected ^-^");
    } catch (err) {
        console.error(`Error connecting to db: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
