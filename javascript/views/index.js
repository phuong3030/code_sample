define(
  [
    'app',
    'models/inventory/option-type',
    'collections/inventory/option-types',
    'views/inventory/option-types/index/option-type-item',
    'hbs!templates/inventory/option-types/index'
  ], function (App, OptionType, OptionTypes, OptionTypeItemView, indexTemplate) {

    return Backbone.Marionette.CompositeView.extend({
      template: indexTemplate,
      className: 'clearfix',
      model: new OptionType(),
      collection: new OptionTypes(),
      childView: OptionTypeItemView,
      childViewContainer: "#option-type-table tbody",

      // Store input fields name and type of ransack search
      inputFields: {
        id: {
          type: 'integer',
          matchers: {
            eq: '',
            lt: '<',
            gt: '>',
            lteq: '<=',
            gteq: '>=',
            in: '..'
          }
        },
        name: {
          type: 'text',
          matchers: {
            cont: ''
          }
        }, 
        presentation: {
          type: 'text',
          cont: ''
        }
      },
      eventSource: 'optionTypeIndexView:deleteItem',
      messages: {
        successfulDelete: 'This record delete successfully.',
        failureDelete: 'This record couldn\'t delete. Please try again!',

        successfulBulkDelete: 'Records delete successfully!',
        failureBulkDelete: 'Records couldn\'t delete. Please try again!',
        notChoosenItemWarning: 'Please choose at least one item to delete!',

        successfulCreate: 'Create new option type successfully!!!', 
        failureCreate: 'We got errors in creating new option type. Please try again later!', 

        successfulUpdate: 'Update option type successfully.', 
        failureUpdate: 'We got errors in updating option type. Please try again later!',

        successfulFetch: 'Re-fetch new option type list successfully.',
        failureFetch: 'Couldn\'t re-fetch new option type list. Please try again later!',

        failureCount: 'Counldn\'t get count number of option type list. Please contact to developers!'
      },

      modal: {
        deleteItem: {
          title: 'User Confirmation',
          body: 'Are you sure to delete this record?',
          eventSource: 'optionTypeIndexView:deleteItem'
        },
        bulkDelete: {
          title: 'User Confirmation',
          body: 'Are you sure to delete records?',
          eventSource: 'optionTypeIndexView:deleteItem'
        }
      },

      initialize: function () {

        Backbone.Validation.bind(this);
      },

      ui: {
        name: '#name',
        presentation: '#presentation',
        btnAdd: '#add-item',
        btnUpdate: '#update-item',
        btnCancel: '#cancel-update-item',

        displaySelect: '#table_length select',
        paginationList: '.pagination',
        paginationItems: '.pagination li',

        checkAll: '#checkbox-all',
        btnBulkDelete: '#bulk-delete',

        searchIDInput: '#search-id-input',
        searchNameInput: '#search-name-input',
        searchPresentationInput: '#search-presentation-input',
        btnSearch: '#search-btn',
        btnResetSearch: '#filter-reset-btn',

        exportXLS: '#export-to-xlsx',
        importXLS: '#export-to-xlsx',
        exportCSV: '#export-to-csv',
        importCSV: '#export-to-csv'
      },

      events: {
        'click @ui.btnAdd': 'createNewChildItem',
        'click @ui.btnUpdate': 'updateChildItem',
        'click @ui.btnCancel': 'cancelUpdateChildItem',

        'change @ui.displaySelect': 'changeNumberOfChildItem',
        'click @ui.paginationItems': 'changePageOfChildList',

        'change @ui.checkAll': 'checkAllItems',
        'click @ui.btnBulkDelete': 'bulkDeleteConfirmation',

        'click @ui.exportXLS': 'exportXLS',
        'click @ui.importXLS': 'importXLS'
      },

      // Binding two way form
      bindings: {
        '#name': {
          observe: 'name',
          setOptions: {
            validate: true
          }
        },
        '#presentation': { 
          observe: 'presentation',
          setOptions: {
            validate: true
          }
        }
      },

      childEvents: {
        'update:childItem': 'onBindChildItem',
        'delete:childItem': 'deleteOneItemConfirmation'
      },

      onBeforeRender: function () {

        var that = this;

        // Fetch collection for option type list item
        this.collection.fetch({ reset: false, data: { page: 1, per: 10 } });

        // Listen message from system modal
        App.vent.on(this.modal.deleteItem.eventSource, function (confirmType, modalData) {

          var ids = modalData.itemIDs.split(','),
              idsLength = ids.length ;

          // User want to delete this option type
          if (confirmType === 'confirm:modal-event') {

            // Delete one item
            if (idsLength === 1) {
            
              that._sendOneItemToDelete(modalData.itemIDs);
            } else {

              // Delete multiple records
              that._sendMultipleItemsToDelete(modalData.itemIDs);
            }
          } else {

            // Clear all check items if user cancels his action
            that._toggleCheckItems(false);
          }

        });
      },

      onRender: function () {

        // Enable two ways model binding
        this.stickit();

        // Create pagination list with current page is 1
        this._createPaginationList(1);
      },

      // Bind child item to inputs to update
      onBindChildItem: function (childView) {

        // Binding model to current model, and it will bind to input automatically
        this.model.set(childView.model.toJSON());

        /* 
         * Remove validations on fields, it prevents show wrong validataions 
         * when user click change the inputs before click to update button
         */
        App.module('TwoWaysForm').validFields.call(this, {}, Object.keys(this.inputFields));

        // Hide create new option type button, show update button
        this.ui.btnAdd.addClass('hidden');
        this.ui.btnUpdate.removeClass('hidden');
        this.ui.btnCancel.removeClass('hidden');
      },

      deleteOneItemConfirmation: function (childView) {

        this._onShowConfirmation(childView.model.get('id'), this.modal.deleteItem);
      },

      _sendOneItemToDelete: function (itemIDs) {

        var that = this,
            deletingOptionType = this.collection.get(itemIDs);

        deletingOptionType.destroy({
          success: function () {

            App.vent.trigger('alert:show', 'success', that.messages.successfulDelete);
            that._refetchTableData(1);
          },
          error: function () {

            App.vent.trigger('alert:show', 'failure', that.messages.failureDelete);
          }
        });
      },

      _onShowConfirmation: function (ids, modal) {

        // Show alert to confirmation
        App.vent.trigger(
          'system-modal:show', 
          {
            title: modal.title,
            body: modal.body,
            eventSource: modal.eventSource,
            itemIDs: ids
          }
        );
      },

      // Add alert errors when inputs have wrong value
      addAlertOnView: function (e, errors) {

        App.module('TwoWaysForm').invalidFields.call(this, errors, Object.keys(this.inputFields));
      },

      // We don't have any error when validate the model
      removeAlertOnView: function (e, errors) {

        App.module('TwoWaysForm').validFields.call(this, errors, Object.keys(this.inputFields));
      },

      modelEvents: {
        'validated:invalid': 'addAlertOnView',
        'validated:valid': 'removeAlertOnView'
      },

      collectionEvents: {
        
      },

      /*
       * CREATE / UPDATE ACTION
       */
      _hideUpdateBtn: function () {

        // Hide update option type button, show create button
        this.ui.btnAdd.removeClass('hidden');
        this.ui.btnUpdate.addClass('hidden');
        this.ui.btnCancel.addClass('hidden');
      },

      _saveModel: function (successMessage, failureMessage, callback) {

        if (this.model.isValid(true)) {

          var that = this;

          this.model.save({}, {
            success: function (data) { 
      
              // Show success notice
              App.vent.trigger('alert:show', 'success', successMessage);

              if (callback !== null) {

                callback(that.model, that.collection);
              }
            },
            error: function (data) {

              // Show error alert
              App.vent.trigger('alert:show', 'failure', failureMessage);

              // Clear current model
              that.model.clear();
            }
          });
        } else {

          // focus on error fields
          this.ui[_.keys(this.model.validationError)[0]].focus();
        }

        return false;
      },

      createNewChildItem: function () {

        this._saveModel(
          this.messages.successfulCreate,
          this.messages.failureCreate,
          function (model, collection) {

            // Reset current model, inputs and add new option type to collection
            collection.unshift(model.clone());
            model.clear();
          }
        );
      },

      updateChildItem: function () {

        var that = this;

        this._saveModel(
          this.messages.successfulUpdate,
          this.messages.failureUpdate,
          function (model, collection) {
            
            // Update updated model in collection and clear current model
            collection.get(model.get('id')).set(model.toJSON());
            model.clear();
            that._hideUpdateBtn();
          }
        );
      },

      cancelUpdateChildItem: function () {

        /* 
         * Remove validations on fields, it prevents show wrong validataions 
         * when user click change the inputs before click to update button
         */
        App.module('TwoWaysForm').validFields.call(this, {}, Object.keys(this.inputFields));

        // Clear current model and hide update buttons
        this.model.clear();
        this._hideUpdateBtn();
      },

      _reFetchCollection: function (reset, page, per, callback) {

        var that = this;

        this.collection.fetch({ 
          reset: reset, 
          data: { page: page, per: per },
          success: function () {
            
            if (callback && callback.success) {

              callback.success();
            }
          }, 
          error: function () {

            if (callback && callback.failure) {

              callback.failure();
            }
          }
        });
      },

      /*
       * PAGINATION ACTION
       */

      // Get total option types to build new pagination list
      _createPaginationList: function (page) {

        var that = this;

        // Re get the total of option types in server
        $.ajax({
          url: '/api/v1/inventory/option_types/total',
          type: 'get',
          success: function (data) {

            // Create new pagination list
            that.ui.paginationList.html(App.module('Pagination').createPageItems(page, that.ui.displaySelect.val(), data));

            // Rebind selector elements to ui hash
            that.bindUIElements();
          },
          error: function (e) {

            App.vent.trigger('alert:show', 'failure', that.messages.failureCount);
          }
        });
      },

      // Refresh data in collection view and build new pagination list at a same time
      _refetchTableData: function (newPage) {

        // Re-fetch collection and remain per parameter
        this._reFetchCollection(true, newPage, this.ui.displaySelect.val());

        // Change the pagination content, mark 'active' class to pagination item
        this._createPaginationList(newPage);
      },

      changePageOfChildList: function (e) {

        if ($(e.currentTarget).hasClass('disabled')) {

          return false;
        }

        this._refetchTableData(this.$(e.currentTarget).data('page'));
      },

      changeNumberOfChildItem: function (e) {
        
        var that = this;

        this._reFetchCollection(
          true, 
          1, 
          this.ui.displaySelect.val(), 
          { 
            success: function () {

              App.vent.trigger('alert:show', 'success', that.messages.successfulFetch);
            },
            failure: function () {

              App.vent.trigger('alert:show', 'failure', that.messages.failureFetch);
            }
          }
        );

        // Reset page number to first page when we change number of items to view
        this._createPaginationList(1);
      },

      /* 
       * BULK ACTION
       */
      _toggleCheckItems: function (isChecked) {
  
        this.children.forEach(function (item) {

          item.ui.checkItem.prop('checked', isChecked);
        });
      },

      _sendMultipleItemsToDelete: function (ids) {

        var that = this;

        $.ajax({
          url: '/api/v1/inventory/option_types/',
          type: 'post',
          data: { 'ids': ids, '_method': 'delete' },
          success: function (data) {

            App.vent.trigger('alert:show', 'success', that.messages.successfulBulkDelete);

            // Re-fetch collection and remake the pagination list
            that._refetchTableData(1);
          },
          error: function (e) {

            App.vent.trigger('alert:show', 'failure', that.messages.failureBulkDelete);
          }
        });

      },

      checkAllItems: function (e) {

        this._toggleCheckItems(this.ui.checkAll.is(':checked'));
      },

      bulkDeleteConfirmation: function (e) {

        var checkedItems = this.children.filter(function (item) {

          return item.ui.checkItem.is(':checked');
        });

        // User needs to choose at least one item to delete
        if (checkedItems.length === 0) {

          // Show warning
          App.vent.trigger('alert:show', 'failure', this.messages.notChoosenItemWarning);

          return ;
        }

        var ids = checkedItems.map(function (item) {
          
          return item.model.id;
        }).join(',');

        this._onShowConfirmation(ids, this.modal.bulkDelete);
      },

      /*
      * IMPORT & EXPORT functions
      */
      importXLS: function () {
      },

      exportXLS: function () {
      },

      importCSV: function () {
      },

      exportCSV: function () {
      }
    });

  }
);
