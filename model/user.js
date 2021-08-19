const mongoose = require('../config/db');
const mongoosePaginate = require('mongoose-paginate-v2');
var idValidator = require('mongoose-id-validator');
const bcrypt = require('bcrypt');
const { USER_ROLE } = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    username:{ type:String },

    password:{ type:String },

    email:{ type:String },

    name:{ type:String },

    isActive:{ type:Boolean },

    createdAt:{ type:Date },

    updatedAt:{ type:Date },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    isDeleted:{ type:Boolean },

    role:{
      type:Number,
      enum:convertObjectToEnum(USER_ROLE)
    },

    resetPasswordLink:{
      code:String,
      expireTime:Date
    },

    loginRetryLimit:{
      type:Number,
      default:0
    },

    loginReactiveTime:{ type:Date },

    tokens:{ type:[String] }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password){
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.method('toJSON', function () {
  const {
    __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = object._id;

  delete object.password;
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const user = mongoose.model('user',schema,'user');
module.exports = user;