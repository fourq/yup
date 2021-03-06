"use strict";
var MixedSchema = require("./mixed");
var isoParse = require("./util/isodate");
var locale = require("./locale.js").date;

var _require = require("./util/_");

var isDate = _require.isDate;
var inherits = _require.inherits;

var invalidDate = new Date("");

module.exports = DateSchema;

function DateSchema() {
  if (!(this instanceof DateSchema)) return new DateSchema();

  MixedSchema.call(this, { type: "date" });

  this.transforms.push(function (value) {

    if (this.isType(value)) return isDate(value) ? new Date(value) : value;

    value = isoParse(value);
    return value ? new Date(value) : invalidDate;
  });
}

inherits(DateSchema, MixedSchema, {

  _typeCheck: function (v) {
    return isDate(v) && !isNaN(v.getTime());
  },

  required: function (msg) {
    return this.validation({ hashKey: "required", message: msg || locale.required }, isDate);
  },

  min: function (min, msg) {
    var limit = this.cast(min);
    msg = msg || locale.min;

    if (!this.isType(limit)) throw new TypeError("min must be a Date or a value that can be parsed to a Date");

    return this.validation({ message: msg, hashKey: "min", params: { min: min } }, function (value) {
      return value && value >= limit;
    });
  },

  max: function (max, msg) {
    var limit = this.cast(max);

    if (!this.isType(limit)) throw new TypeError("max must be a Date or a value that can be parsed to a Date");

    return this.validation({ hashKey: "max", message: msg || locale.max, params: { max: max } }, function (value) {
      return !value || value <= limit;
    });
  }

});