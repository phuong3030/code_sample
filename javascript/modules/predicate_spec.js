define(
  [
  'app',
  'modules/shared/predicate',
  'sinon',
  'jasminesinon',
  'jasminejquery'
  ], function (App, Predicate) {

    describe('Predicate', function () {

      var predicate = App.module('Predicate');

      it('should exist', function () {

        expect(predicate).toBeDefined();
      });

      it('can return search text input configuration with default predicate', function () {

        expect(predicate.searchInput('text')).toEqual({
          type: 'text',
          predicates: {
            cont: '',
            not_cont: '!',
            cont_any: ':',
            present: '?',
            null: 'null',
            not_null: 'not_null'
          }
        });
      });

      it('can return search number input configuration except some predicates', function () {

        expect(predicate.searchInput('number', { except: ['in', 'not_in'] })).toEqual({
          type: 'number',
          predicates: {
            eq: '',
            lt: '<',
            gt: '>',
            lteq: '<=',
            gteq: '>=',
            null: 'null',
            not_null: 'not_null'
          }
        });
      });

      it('can return search boolean input configuration except some predicates', function () {

        expect(predicate.searchInput('boolean', { except: ['true'] })).toEqual({
          type: 'boolean',
          predicates: {
            false: 'false',
            null: 'null',
            not_null: 'not_null'
          }
        });
      });

      describe('Return predicate and search value', function () {

        describe('Number search field', function () {

          it('eq', function () {

            expect(predicate.separate('Number', '125')).toEqual({ 
              op: 'eq',
              value: 125
            });
          });

          it('lt', function () {

            expect(predicate.separate('Number', '< 12')).toEqual({
              op: 'lt',
              value: 12
            });
          });

          it('gt', function () {

            expect(predicate.separate('Number', '> 12')).toEqual({
              op: 'gt',
              value: 12
            });
          });

          it('lteq', function () {

            expect(predicate.separate('Number', '<= 12')).toEqual({
              op: 'lteq',
              value: 12
            });
          });

          it('gteq', function () {

            expect(predicate.separate('Number', '>= 12')).toEqual({
              op: 'gteq',
              value: 12
            });
          });

          it('in', function () {

            expect(_.isEqual(predicate.separate('Number', '12..20'), {
              op: 'in',
              value: [12, 20]
            })).toBeTruthy();
          });

          it('not_in', function () {

            expect(_.isEqual(predicate.separate('Number', '12!..20'), {
              op: 'not_in',
              value: [12,20]
            })).toBeTruthy();
          });

          it('null', function () {

            expect(predicate.separate('Number', 'null')).toEqual({
              op: 'null',
              value: ''
            });
          });

          it('not_null', function () {

            expect(predicate.separate('Number', 'not_null')).toEqual({
              op: 'not_null',
              value: ''
            });
          });
        });

        describe('Text search field', function () { 

          it('cont', function () {

            expect(predicate.separate('Text', 'abc')).toEqual({
              op: 'cont',
              value: 'abc'
            });
          });

          it('cont_any', function () {

            expect(_.isEqual(predicate.separate('Text', ':abc,cdg'), {
              op: 'cont_any',
              value: ['abc', 'cdg']
            })).toBeTruthy();
          });

          it('present', function () {

            expect(predicate.separate('Text', '?')).toEqual({
              op: 'present',
              value: ''
            });
          });

          it('null', function () {

            expect(predicate.separate('Text', 'null')).toEqual({
              op: 'null',
              value: ''
            });
          });

          it('not_null', function () {

            expect(predicate.separate('Text', 'not_null')).toEqual({
              op: 'not_null',
              value: ''
            });
          });
        });

        it('true', function () {

          expect(predicate.separate('Boolean', 'true')).toEqual({
            op: 'true',
            value: ''
          });
        });

        it('false', function () {

          expect(predicate.separate('Boolean', 'false')).toEqual({
            op: 'false',
            value: ''
          });
        });

        it('null', function () {

          expect(predicate.separate('Boolean', 'null')).toEqual({
            op: 'null',
            value: ''
          });
        });

        it('not_null', function () {

          expect(predicate.separate('Boolean', 'not_null')).toEqual({
            op: 'not_null',
            value: ''
          });
        });

      });
    });
  }
);
