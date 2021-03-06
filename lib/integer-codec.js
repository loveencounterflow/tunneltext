(function() {
  "use strict";
  var CND, alert, badge, debug, declare, echo, help, info, isa, log, rpr, size_of, type_of, types, urge, validate, validate_distinctive_nonempty_chrs, validate_is_subset, warn, whisper,
    indexOf = [].indexOf,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TIMETUNNEL/INTEGER-CODEC';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = require('./types');

  ({isa, validate, declare, size_of, type_of} = types);

  /*

  thx to https://rot47.net/base.html
  convert.js
  http://rot47.net
  https://helloacm.com
  http://codingforspeed.com
  Dr Zhihua Lai

  */
  // BASE2  = "01"
  // BASE8  = "01234567"
  // BASE10 = "0123456789"
  // BASE16 = "0123456789abcdef"
  // BASE32 = "0123456789abcdefghijklmnopqrstuvwxyz"
  // BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  // BASE75 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.,!=-*(){}[]"

  //-----------------------------------------------------------------------------------------------------------
  validate_distinctive_nonempty_chrs = function(x) {
    var R;
    validate.text(x);
    R = Array.from(x);
    /* TAINT implement intertype.validate() with custom test, custom message */
    if (!(R.length > 1)) {
      throw new Error(`µ12009 expected a text with two or more characters, got ${rpr(x)}`);
    }
    if ((new Set(R)).size !== R.length) {
      throw new Error(`µ12009 expected a text with two or more distinct characters, got ${rpr(x)}`);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  validate_is_subset = function(x, y) {
    if (!(x.every(function(xx) {
      return indexOf.call(y, xx) >= 0;
    }))) {
      throw new Error(`µ33344 number contains illegal digits: ${rpr(x)}, alphabet ${rpr(y)}`);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._convert = function(src, srctable, desttable) {
    var R, destlen, i, j, numlen, q, r, ref, srclen, val;
    srctable = validate_distinctive_nonempty_chrs(srctable);
    desttable = validate_distinctive_nonempty_chrs(desttable);
    srclen = srctable.length;
    destlen = desttable.length;
    validate.nonempty_text(src);
    src = Array.from(src);
    validate_is_subset(src, srctable);
    while ((src.length > 1) && (src[0] === srctable[0])) {
      //.........................................................................................................
      // Remove leading zeros except the last one:
      src.shift();
    }
    if (srctable === desttable) {
      //.........................................................................................................
      // If srctable equals desttable and leading zeros have been removed, src already contains result: ###
      return src.join('');
    }
    //.........................................................................................................
    // first convert to base 10
    val = 0;
    numlen = src.length;
//.........................................................................................................
    for (i = j = 0, ref = numlen; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      val = val * srclen + srctable.indexOf(src[i]);
    }
    //.........................................................................................................
    if (val < 0) {
      return 0;
    }
    //.........................................................................................................
    // then covert to any base
    r = modulo(val, destlen);
    R = desttable[r];
    q = Math.floor(val / destlen);
    while (q !== 0) {
      r = modulo(q, destlen);
      q = Math.floor(q / destlen);
      R = desttable[r] + R;
    }
    //.........................................................................................................
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.encode = function(n, alphabet) {
    validate.cardinal(n);
    return this._convert(`${n}`, '0123456789', alphabet);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.decode = function(text, alphabet) {
    return parseInt(this._convert(text, alphabet, '0123456789'), 10);
  };

}).call(this);

//# sourceMappingURL=integer-codec.js.map