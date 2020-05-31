const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     quantity: { type: Number, default: 1 },
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     status:{ 
        type:String, 
        enum : ['new','accept', 'reject'],
        required:true,
        default:'new'
    }
});

module.exports = mongoose.model('Order', orderSchema);