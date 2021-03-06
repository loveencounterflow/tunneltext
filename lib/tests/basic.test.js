(function() {
  'use strict';
  var CND, IC, TIMETUNNEL, badge, debug, echo, help, info, inspect, jr, rpr, test, urge, warn, whisper, xrpr, xrpr2;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TIMETUNNEL/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  IC = require('../..');

  ({inspect} = require('util'));

  xrpr = function(x) {
    return inspect(x, {
      colors: true,
      breakLength: 2e308,
      maxArrayLength: 2e308,
      depth: 2e308
    });
  };

  xrpr2 = function(x) {
    return inspect(x, {
      colors: true,
      breakLength: 20,
      maxArrayLength: 2e308,
      depth: 2e308
    });
  };

  //...........................................................................................................
  TIMETUNNEL = require('../..');

  //-----------------------------------------------------------------------------------------------------------
  this["basic escaping"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[['abcde', 'abcdefghxyz'], 'cccdcedefghxyz', null], [['abc', null], null, 'not a valid timetunnel_settings']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var guards, result, text, tnl;
          [guards, text] = probe;
          tnl = new TIMETUNNEL.Timetunnel({guards});
          result = tnl.hide(text);
          return resolve(result);
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tunnels: hiding"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[['abcde', ['remove_backslash'], 'abcdefghxyz'], 'cccdcedefghxyz', null], [['abcde', ['remove_backslash'], 'abc\\defghxyz'], 'cccdcea0befghxyz', null], [['abcde', ['keep_backslash'], 'abc\\defghxyz'], 'cccdcea0befghxyz', null], [['abcde', ['keep_backslash'], 'abc\\defgh\\xyz'], 'cccdcea0befgha1byz', null], [[null, ['keep_backslash'], 'abc\\defgh\\xyz'], 'abc\u00100\u0011efgh\u00101\u0011yz', null], [['abcde', ['remove_backslash', 'htmlish'], 'abc\\def <tag/> ghxyz'], 'cccdcea0bef a1b ghxyz', null]];
//.........................................................................................................
// [['abc',null],null,'not a valid timetunnel_guards',]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var guards, j, len1, result, text, tnl, tunnel_factory, tunnel_name, tunnel_names;
          [guards, tunnel_names, text] = probe;
          tnl = new TIMETUNNEL.Timetunnel({guards});
//.....................................................................................................
          for (j = 0, len1 = tunnel_names.length; j < len1; j++) {
            tunnel_name = tunnel_names[j];
            tunnel_factory = TIMETUNNEL.tunnels[tunnel_name];
            tnl.add_tunnel(tunnel_factory);
          }
          //.....................................................................................................
          result = tnl.hide(text);
          return resolve(result);
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tunnels: hiding and revealing"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[['abcde', ['remove_backslash'], 'abcdefghxyz'], 'abcdefghxyz', null], [['abcde', ['remove_backslash'], 'abcdefghxyz'], 'abcdefghxyz', null], [['abcde', ['keep_backslash'], 'abc\\defghxyz'], 'abc\\defghxyz', null], [[null, ['keep_backslash'], 'abc\\defgh\\xyz'], 'abc\\defgh\\xyz', null], [['abcde', ['remove_backslash', 'htmlish'], 'abc\\def <tag/> ghxyz'], 'abcdef <tag/> ghxyz', null]];
//.........................................................................................................
// [['abc',null],null,'not a valid timetunnel_guards',]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var guards, j, len1, result, text, tnl, tunnel_factory, tunnel_name, tunnel_names;
          [guards, tunnel_names, text] = probe;
          tnl = new TIMETUNNEL.Timetunnel({guards});
//.....................................................................................................
          for (j = 0, len1 = tunnel_names.length; j < len1; j++) {
            tunnel_name = tunnel_names[j];
            tunnel_factory = TIMETUNNEL.tunnels[tunnel_name];
            tnl.add_tunnel(tunnel_factory);
          }
          //.....................................................................................................
          result = tnl.reveal(tnl.hide(text));
          return resolve(result);
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["instantiation: errors"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[['abcde', 'abc'], null, 'not a valid timetunnel_collisionfree_texts']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var guards, intalph, tnl;
          [guards, intalph] = probe;
          tnl = new TIMETUNNEL.Timetunnel({guards, intalph});
          return resolve(null);
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tunnels: grouping 1"] = function(T, done) {
    var modify, original_text, t, tnl, transform;
    transform = function(tnl, original_text, message) {
      var modified_text, tunneled_text, uncovered_text;
      tunneled_text = tnl.hide(original_text);
      modified_text = modify(tunneled_text);
      uncovered_text = tnl.reveal(modified_text);
      debug('µ22129', '----------------------------');
      debug('µ22129', message);
      debug('µ22129', '(1)', rpr(original_text));
      debug('µ22129', '(2)', rpr(tunneled_text));
      debug('µ22129', '(3)', rpr(modified_text));
      debug('µ22129', '(4)', rpr(uncovered_text));
      return {tunneled_text, modified_text, uncovered_text};
    };
    //.........................................................................................................
    modify = function(text) {
      return text.replace(/[0-9]+/g, function($0) {
        return '' + (parseInt($0, 10)) * 12;
      });
    };
    //.........................................................................................................
    original_text = 'abcdeABCDE-CC-CD';
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({
      guards: 'abCDe'
    });
    tnl.add_tunnel(/\{([0-9]+)\}/gu);
    t = transform(tnl, original_text, "brackets not in group, removed");
    T.eq(t.tunneled_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.modified_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.uncovered_text, 'abcdeABCDE-CC-CD');
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({
      guards: 'abCDe'
    });
    tnl.add_tunnel(/(\{[0-9]+\})/gu);
    t = transform(tnl, original_text, "brackets in group, not removed");
    T.eq(t.tunneled_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.modified_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.uncovered_text, 'abcdeABCDE-CC-CD');
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({
      guards: 'abCDe'
    });
    tnl.add_tunnel(/\{[0-9]+\}/gu);
    t = transform(tnl, original_text, "no group, equivalent to all grouped");
    T.eq(t.tunneled_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.modified_text, 'CCCDcdeABCeDE-CeCe-CeD');
    T.eq(t.uncovered_text, 'abcdeABCDE-CC-CD');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tunnels: grouping 2"] = function(T, done) {
    var guards, intalph, modify, original_text, t, tnl, transform;
    transform = function(tnl, original_text, message) {
      var modified_text, tunneled_text, uncovered_text;
      tunneled_text = tnl.hide(original_text);
      modified_text = modify(tunneled_text);
      uncovered_text = tnl.reveal(modified_text);
      debug('µ22129', '----------------------------');
      debug('µ22129', message);
      debug('µ22129', '(1)', rpr(original_text));
      debug('µ22129', '(2)', rpr(tunneled_text));
      debug('µ22129', '(3)', rpr(modified_text));
      debug('µ22129', '(4)', rpr(uncovered_text));
      return {tunneled_text, modified_text, uncovered_text};
    };
    //.........................................................................................................
    modify = function(text) {
      return text.replace(/[0-9]+/g, function($0) {
        return '' + (parseInt($0, 10)) * 12;
      });
    };
    //.........................................................................................................
    original_text = "abcde A plain number 123, two bracketed ones: {123}, {124}";
    guards = 'abCDe';
    intalph = '+-';
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({guards, intalph});
    tnl.add_tunnel(/\{([0-9]+)\}/gu);
    t = transform(tnl, original_text, "brackets not in group, removed");
    T.eq(t.tunneled_text, 'CCCDcde A plCCin numCDer 123, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.modified_text, 'CCCDcde A plCCin numCDer 1476, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.uncovered_text, 'abcde A plain number 1476, two bracketed ones: 123, 124');
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({guards, intalph});
    tnl.add_tunnel(/(\{[0-9]+\})/gu);
    t = transform(tnl, original_text, "brackets in group, not removed");
    T.eq(t.tunneled_text, 'CCCDcde A plCCin numCDer 123, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.modified_text, 'CCCDcde A plCCin numCDer 1476, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.uncovered_text, 'abcde A plain number 1476, two bracketed ones: {123}, {124}');
    //.........................................................................................................
    tnl = new TIMETUNNEL.Timetunnel({guards, intalph});
    tnl.add_tunnel(/\{[0-9]+\}/gu);
    t = transform(tnl, original_text, "no group, equivalent to all grouped");
    T.eq(t.tunneled_text, 'CCCDcde A plCCin numCDer 123, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.modified_text, 'CCCDcde A plCCin numCDer 1476, two CDrCCcketed ones: a+b, a-b');
    T.eq(t.uncovered_text, 'abcde A plain number 1476, two bracketed ones: {123}, {124}');
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "tunnels: hiding" ]
// test @[ "tunnels: hiding and revealing" ]

}).call(this);

//# sourceMappingURL=basic.test.js.map