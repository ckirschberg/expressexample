const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
    title: {
        type: String,
        required: "Title must have a name",
    },
    fromDate: {
        type: Date,
        required: "From Date is required",
    },
    toDate: {
        type: Date,
        required: "To Date is required",
    },
    description: {
        type: String,
        trim: true,
        required: "Description must be filled out",
        minLength: 10
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
});
module.exports = mongoose.model('Destination', DestinationSchema);