define(['app'], function (App) {

  App.module("Pagination", function (Pagination, App, Backbone, Marionette, $, _) {

    'use strict';

     function _middleActivePageItems (page, per, total) {

      var lastPage = Math.ceil(total / per);

      return '<li class="first" data-page="1"><a href="#">←← First</a></li>' +
             '<li class="prev" data-page="' + (page - 1) + '"><a href="#">← Previous</a></li>' +
             '<li data-page="' + (page - 1) + '"><a href="#">3</a></li>' + 
             '<li class="active" data-page="4"><a href="#">4</a></li>' +
             '<li data-page="' + (page + 1) + '"><a href="#">5</a></li>' +
             '<li data-page="' + (page + 1) + '" class="next"><a href="#">Next → </a></li>' +
             '<li data-page="' + lastPage + '" class="last"><a href="#">Last →→ </a></li>';
    }

    function _firstActivePageItems (per, total) {

      var lastPage = Math.ceil(total / per);

      if (lastPage > 2) {

        return '<li class="first disabled" data-page="1"><a href="#">←← First</a></li>' +
               '<li class="prev disabled" data-page="1"><a href="#">← Previous</a></li>' +
               '<li class="active" data-page="1"><a href="#">1</a></li>' +
               '<li data-page="2"><a href="#">2</a></li>' + 
               '<li data-page="3"><a href="#">3</a></li>' +
               '<li data-page="2" class="next"><a href="#">Next → </a></li>' +
               '<li data-page="' + lastPage + '" class="last"><a href="#">Last →→ </a></li>';
      } else if (lastPage === 2) {

        return '<li class="first disabled" data-page="1"><a href="#">←← First</a></li>' +
               '<li class="prev disabled" data-page="1"><a href="#">← Previous</a></li>' +
               '<li class="active" data-page="1"><a href="#">1</a></li>' +
               '<li data-page="2"><a href="#">2</a></li>' +
               '<li data-page="2" class="next"><a href="#">Next → </a></li>' +
               '<li data-page="2" class="last"><a href="#">Last →→ </a></li>';
      } else {

        return '';
      }
    }

    function _lastActivePageItems (page) {

      if (page > 2) {

        return '<li class="first" data-page="1"><a href="#">←← First</a></li>' +
               '<li class="prev" data-page="' + (page - 1) + '"><a href="#">← Previous</a></li>' +
               '<li data-page="'+ (page - 2) + '"><a href="#">' + (page -2) + '</a></li>' +
               '<li data-page="' + (page - 1) + '"><a href="#">' + (page - 1) + '</a></li>' +
               '<li class="active" data-page="' + page + '"><a href="#">' + page + '</a></li>' + 
               '<li data-page="'+ page + '" class="disabled next"><a href="#">Next → </a></li>' +
               '<li data-page="'+ page + '" class="disabled last"><a href="#">Last →→ </a></li>';

      } else if (page == 2) {

        return '<li class="first" data-page="1"><a href="#">←← First</a></li>' + 
               '<li class="prev" data-page="1"><a href="#">← Previous</a></li>' + 
               '<li data-page="1"><a href="#">1</a></li>' +
               '<li class="active" data-page="2"><a href="#">2</a></li>' +
               '<li data-page="2" class="disabled next"><a href="#">Next → </a></li>' +
               '<li data-page="2" class="disabled last"><a href="#">Last →→ </a></li>';      
      }
    }

    Pagination.createPageItems = function (page, per, total) {

      var lastPage = Math.ceil(total / per);

      if (page === 1) {

        return _firstActivePageItems(per, total);
      }

      if (page === lastPage) {

        return _lastActivePageItems(page);
      }

      return _middleActivePageItems(page, per, total);

    };

  });
});
