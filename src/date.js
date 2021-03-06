'use strict';
var MixedSchema = require('./mixed')
  , isoParse = require('./util/isodate')
  , locale = require('./locale.js').date
  , { isDate, inherits } = require('./util/_');


let invalidDate = new Date('')

module.exports = DateSchema

function DateSchema(){
  if ( !(this instanceof DateSchema)) return new DateSchema()

  MixedSchema.call(this, { type: 'date'})

  this.transforms.push(function(value) {

    if (this.isType(value))
      return isDate(value) 
        ? new Date(value)
        : value

    value = isoParse(value)
    return value ? new Date(value) : invalidDate
  })
}

inherits(DateSchema, MixedSchema, {

  _typeCheck(v) {
    return isDate(v) && !isNaN(v.getTime())
  },

  required(msg){
    return this.validation(
      { hashKey: 'required', message:  msg || locale.required },
      isDate)
  },

  min(min, msg){
    var limit = this.cast(min);
    msg = msg || locale.min

    if(!this.isType(limit))
      throw new TypeError('min must be a Date or a value that can be parsed to a Date')

    return this.validation(
        { message: msg, hashKey: 'min', params: { min: min } }
      , value => value && (value >= limit))
  },

  max(max, msg){
    var limit = this.cast(max);

    if(!this.isType(limit))
      throw new TypeError('max must be a Date or a value that can be parsed to a Date')

    return this.validation(
        { hashKey: 'max', message: msg || locale.max, params: { max: max } }
      , value => !value || (value <= limit))
  }

})