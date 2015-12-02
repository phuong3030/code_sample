define(
  [
  'app',
  'modules/shared/pagination',
  'sinon',
  'jasminesinon',
  'jasminejquery'
  ], function (App, Pagination) {

    describe('Pagination', function () {

      var pagination = App.module('Pagination');
      
      it('should exist', function () {

        expect(pagination).toBeDefined();
      });

      describe('First active page items', function () {

        var firstPageItems1 = '<li class="first disabled" data-page="1"><a href="#">←← First</a></li>'
              + '<li class="prev disabled" data-page="1"><a href="#">← Previous</a></li>'
              + '<li class="active" data-page="1"><a href="#">1</a></li>'
              + '<li data-page="2"><a href="#">2</a></li>'
              + '<li data-page="2" class="next"><a href="#">Next → </a></li>'
              + '<li data-page="2" class="last"><a href="#">Last →→ </a></li>';

        var firstPageItems2 = '<li class="first disabled" data-page="1"><a href="#">←← First</a></li>'
              + '<li class="prev disabled" data-page="1"><a href="#">← Previous</a></li>'
              + '<li class="active" data-page="1"><a href="#">1</a></li>'
              + '<li data-page="2"><a href="#">2</a></li>'
              + '<li data-page="3"><a href="#">3</a></li>'
              + '<li data-page="2" class="next"><a href="#">Next → </a></li>'
              + '<li data-page="3" class="last"><a href="#">Last →→ </a></li>';

        it('won\'t show pagination list when total page equals 1', function () {

          expect(pagination.createPageItems(1, 10, 8)).toEqual('');
        });

        it('when total page equals 2', function () {

          expect(pagination.createPageItems(1, 10, 15)).toEqual(firstPageItems1);
        });

        it('when total page is larger than 2', function () {

          expect(pagination.createPageItems(1, 10, 25)).toEqual(firstPageItems2);
        });
      });

      it('can create middle active pagination items', function () {

        var middlePageItems = '<li class="first" data-page="1"><a href="#">←← First</a></li>'
              + '<li class="prev" data-page="3"><a href="#">← Previous</a></li>'
              + '<li data-page="3"><a href="#">3</a></li>'
              + '<li class="active" data-page="4"><a href="#">4</a></li>'
              + '<li data-page="5"><a href="#">5</a></li>'
              + '<li data-page="5" class="next"><a href="#">Next → </a></li>'
              + '<li data-page="5" class="last"><a href="#">Last →→ </a></li>';
  
        expect(pagination.createPageItems(4, 10, 45)).toEqual(middlePageItems);
      });

      describe('Last active page items', function () {

        var lastPageItems1 = '<li class="first" data-page="1"><a href="#">←← First</a></li>'
              + '<li class="prev" data-page="1"><a href="#">← Previous</a></li>'
              + '<li data-page="1"><a href="#">1</a></li>'
              + '<li class="active" data-page="2"><a href="#">2</a></li>'
              + '<li data-page="2" class="disabled next"><a href="#">Next → </a></li>'
              + '<li data-page="2" class="disabled last"><a href="#">Last →→ </a></li>';

        var lastPageItems2 = '<li class="first" data-page="1"><a href="#">←← First</a></li>'
              + '<li class="prev" data-page="4"><a href="#">← Previous</a></li>'
              + '<li data-page="3"><a href="#">3</a></li>'
              + '<li data-page="4"><a href="#">4</a></li>'
              + '<li class="active" data-page="5"><a href="#">5</a></li>'
              + '<li data-page="5" class="disabled next"><a href="#">Next → </a></li>'
              + '<li data-page="5" class="disabled last"><a href="#">Last →→ </a></li>';

        it('when total page equals 2', function () {

          expect(pagination.createPageItems(2, 10, 18)).toEqual(lastPageItems1);
        });

        it('when total page is larger than 2', function () {

          expect(pagination.createPageItems(5, 10, 48)).toEqual(lastPageItems2);
        });
      });

    });
  }
);
