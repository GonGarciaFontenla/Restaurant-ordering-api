const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'The name field is required'], 
    minlength: [3, 'The name must have at least 3 characters'], 
    maxlength: [100, 'The name cannot exceed 100 characters'] 
  },
  price: { 
    type: Number, 
    required: [true, 'The price field is required'], 
    min: [0, 'The price must be at least 0'], 
    validate: {
      validator: Number.isFinite,
      message: 'The price must be a valid number'
    }
  },
  description: { 
    type: String, 
    maxlength: [500, 'The description cannot exceed 500 characters'] 
  },
  available: { 
    type: Boolean, 
    default: true 
  } 
}, { timestamps: true });

menuItemSchema.pre('save', function (next) {
  if (this.price) {
    this.price = parseFloat(this.price.toFixed(2));
  }
  next();
});

menuItemSchema.post('save', function (error, doc, next) {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    next(new Error(errors.join(', ')));
  } else {
    next(error);
  }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
