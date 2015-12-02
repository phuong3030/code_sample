/*
 * Module Predicate
 *
 * - Define the type of input field, search input field for each model attributes 
 * - Define matchers for search input field for each model attributes in table
 * - Define Filter matchers and the way to get search value in search input field
 */
define(['app'], function (App) {

  App.module("Predicate", function (Predicate, App, Backbone, Marionette, $, _) {

    'use strict';

    var searchFields = {},
        separateMethods = {};

    // Number field 
    searchFields.numberField = {
      type: 'number',
      predicates: {
        eq: '',
        lt: '<',
        gt: '>',
        lteq: '<=',
        gteq: '>=',
        in: '..',
        not_in: '!..',
        null: 'null',
        not_null: 'not_null'
      }
    };

    // Text field
    searchFields.textField = {
      type: 'text',
      predicates: {
        cont: '',
        not_cont: '!',
        cont_any: ':',
        present: '?',
        null: 'null',
        not_null: 'not_null'
      }
    };

    // Boolean field
    searchFields.booleanField = {
      type: 'boolean',
      predicates: {
        true: 'true',
        false: 'false',
        null: 'null',
        not_null: 'not_null'
      }
    };

    Predicate.searchInput = function (searchInputType, options) {

      var predicates = searchFields[searchInputType + 'Field'].predicates,
          except;

      options = _.extend({}, options);
      except = options.except || [];

      return {
        type: searchInputType,
        predicates: _.omit(predicates, except)
      };
    };

    /*
     * SEPARATE METHODS
     */

    // Operators don't need value (ex: null, not_null)
    function _selfOp (opName) {

      return {
        op: opName,
        value: ''
      };
    }

    // No process operator
    function _noProcessOp (opName, inputValue) {

      return {
        op: opName,
        value: inputValue
      };
    }

    // Operators use one value
    function _oneValueOp (opName, op, inputValue) {

      return {
        op: opName,
        value: parseFloat(inputValue.split(op)[1])
      };
    }

    // Operators use two values
    function _twoValueOp (opName, op, inputValue) {

      var values = inputValue.split(op);

      return {
        op: opName,
        value: [parseFloat(values[0]), parseFloat(values[1])]
      };
    }

    // Operators use multiple values
    function _multipleValueOp (opName, op, separateCharacter, inputValue) {

      return {
        op: opName,
        value: inputValue.split(op)[1].split(separateCharacter)
      };
    }

    separateMethods._separateNumberField = function (inputValue) {

      if (inputValue.indexOf('<=') >= 0) {

        return _oneValueOp('lteq', '<=', inputValue);
      } else if (inputValue.indexOf('>=') >= 0) {

        return _oneValueOp('gteq', '>=', inputValue);
      } else if (inputValue.indexOf('<') >= 0) { 
        
        return _oneValueOp('lt', '<', inputValue);
      } else if (inputValue.indexOf('>') >= 0) {

        return _oneValueOp('gt', '>', inputValue);
      } else if (inputValue.indexOf('!..') >= 0) {

        return _twoValueOp('not_in', '!..', inputValue);
      } else if (inputValue.indexOf('..') >= 0) {

        return _twoValueOp('in', '..', inputValue);
      } else if (inputValue.indexOf('not_null') >= 0) {

        return _selfOp('not_null');
      } else if (inputValue.indexOf('null') >= 0) {

        return _selfOp('null');
      } else {

        return _noProcessOp('eq', parseFloat(inputValue));
      }
    };

    separateMethods._separateTextField = function (inputValue) {

      if (inputValue.indexOf('!') >= 0) {

        return _oneValueOp('not_cont', '!', inputValue);
      } else if (inputValue.indexOf(':') >= 0) {

        return _multipleValueOp('cont_any', ':', ',', inputValue);
      } else if (inputValue.indexOf('?') >= 0) {
        
        return _selfOp('present');
      } else if (inputValue.indexOf('not_null') >= 0) {
 
        return _selfOp('not_null');
      } else if (inputValue.indexOf('null') >=0) {

        return _selfOp('null');
      } else {

        return _noProcessOp('cont', inputValue);
      }
    };

    separateMethods._separateBooleanField = function (inputValue) {

      if (inputValue.indexOf('true') >= 0) {

        return _selfOp('true');
      } else if (inputValue.indexOf('false') >= 0) {
        
        return _selfOp('false');
      } else if (inputValue.indexOf('not_null') >=0) {

        return _selfOp('not_null');
      } else if (inputValue.indexOf('null') >= 0) {
 
        return _selfOp('null');
      } else {
  
        return null;
      }
    };

    Predicate.separate = function (searchInputType, inputValue) {

      console.log('_separate' + searchInputType + 'Field');

      return separateMethods['_separate' + searchInputType + 'Field'](inputValue);
    };

  });
});
