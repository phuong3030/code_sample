define(
    [
    'app',
    'views/inventory/option-types/index',
    'models/inventory/option-type',
    'modules/shared/two-ways-form',
    'sinon',
    'jasminesinon',
    'jasminejquery'
    ], function (App, IndexView, OptionType) {

      describe('Option type index view', function () {

        var indexView;

        beforeEach(function () {

          indexView = new IndexView();
          indexView.render();
        });

        describe('When view is constructing', function () {

          it('should exist', function () {

            expect(indexView).toBeDefined();
          });

          it('should have right modelEvents', function () {

            expect(indexView.modelEvents).toEqual({ 
              'validated:invalid': 'addAlertOnView',
              'validated:valid': 'removeAlertOnView'
            });
          });

          it('should listen child events', function () {
            
            expect(indexView.childEvents).toEqual({
              'update:childItem': 'onBindChildItem',
              'delete:childItem': 'deleteOneItemConfirmation'
            });
          });

          it('should listen system modal events', function () {

            var view = new IndexView();

            sinon.spy(App.vent, "on");
            view.render();

            expect(App.vent.on).toHaveBeenCalled();

            App.vent.on.restore();
          });
        });

        describe('When view is rendered', function () {

          it('can show list of option types', function () {

            var view = new IndexView();
            sinon.spy(view.collection, "fetch");
            view.render();

            expect(indexView.collection.fetch).toHaveBeenCalled();

            view.collection.fetch.restore();
          });

          it('can save model throw private method', function () {

            var callback = sinon.spy();

            sinon.stub(indexView.model, 'isValid', function () { return true; });
            sinon.stub(indexView.model, 'save', function () { callback(); });

            indexView._saveModel('success', 'failure', callback);

            expect(indexView.model.save).toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();

            indexView.model.isValid.restore();
            indexView.model.save.restore();
          });
        });

        describe('Model CRUD', function () {

          var optionType;

          beforeEach(function () {

            sinon.spy(App.vent, 'trigger');

            // Add sample to collection to test
            optionType = new OptionType({ id: 3, name: 'test', presentation: 'test' });
            optionType1 = new OptionType({ id: 4, name: 'test', presentation: 'test' });
            indexView.collection.add(optionType);
            indexView.collection.add(optionType1);
          });

          afterEach(function () {

            App.vent.trigger.restore();
            optionType.destroy();
            optionType.destroy();
          });

          describe('Create / update option type', function () {

            beforeEach(function () {

              sinon.stub(indexView.model, 'isValid', function () { return true; });
              sinon.stub(indexView, '_saveModel');
            });

            afterEach(function () {

              indexView._saveModel.restore();
              indexView.model.isValid.restore();
            });

            it('can listen new option type event', function () {
              
              indexView.ui.btnAdd.click();

              expect(indexView._saveModel).toHaveBeenCalled();
            });

            it('can update option type', function () {

              indexView.ui.btnUpdate.click();

              expect(indexView._saveModel).toHaveBeenCalled();
            });
          });

          describe('Delete option type', function () {


            beforeEach(function () {

              indexView.$el.find('.delete').last().click();
            });

            it('show confirmation popup by clicking to delete button in list item', function () {

              expect(App.vent.trigger).toHaveBeenCalledWith(
                'system-modal:show', 
                { 
                  title: 'User Confirmation',
                  body: 'Are you sure to delete this record?',
                  eventSource: 'optionTypeIndexView:deleteItem',
                  itemIDs: optionType.get('id')
                }
              );
            });
          });

          describe('bulk action', function () {

            beforeEach(function () {

              indexView.ui.checkAll.prop('checked', true).change();
            });

            afterEach(function () {

              indexView.ui.checkAll.prop('checked', false).change();
            });

            it('can check all items', function () {

              var isUnchecked = indexView.children.find(function (item) {

                return item.ui.checkItem.is(':checked') === false;
              });

              expect(isUnchecked).toBeUndefined();
            });

            describe('bulk delete option types', function () {

              beforeEach(function () {

                indexView.ui.btnBulkDelete.click();
              });

              it('should show confirmation modal to confirm action', function () {

                expect(App.vent.trigger).toHaveBeenCalledWith(
                  'system-modal:show',
                  {
                    title: 'User Confirmation',
                    body: 'Are you sure to delete records?',
                    eventSource: 'optionTypeIndexView:deleteItem',
                    itemIDs: '4,3'
                  }
                );
              });

              it('can send list of item id to server to delete', function () {

                sinon.spy(indexView, '_sendMultipleItemsToDelete');
                App.vent.trigger('optionTypeIndexView:deleteItem', 'confirm:modal-event', { itemIDs: '3,4' });

                expect(indexView._sendMultipleItemsToDelete).toHaveBeenCalledWith('3,4');
                
                indexView._sendMultipleItemsToDelete.restore();
              });

              it('can clear all check items when user cancels his action', function () {

                App.vent.trigger('optionTypeIndexView:deleteItem', 'cancel:modal-event', { itemIDs: '3,4' });

                var isChecked = indexView.children.find(function (item) {

                  return item.ui.checkItem.is(':checked') === true;
                });

                expect(typeof isChecked).toEqual('undefined');
              });
            });

            describe('bulk insert option types', function () {

              it('should show modal to upload excel file to server', function () {

              });

              it('can update the option type list in collection view', function () {
              });
            });

            describe('get option types list in excel', function () {

              it('should send get request to server to get option types list in excel file', function () {
              });
            });
          });

        });

        describe('View Events', function () {

          describe('Bind updating option type model to inputs', function () {
            
            var optionType;

            beforeEach(function () {

              // Add sample to collection to test
              optionType = new OptionType({ id: 3, name: 'test', presentation: 'test' });

              indexView.collection.add(optionType);
              indexView.$el.find('.update').last().click();
            });

            it('can fill the inputs when user click to update button in list item', function () {

              expect(indexView.ui.name).toHaveValue(optionType.get('name'));
              expect(indexView.ui.presentation).toHaveValue(optionType.get('presentation'));
              expect(indexView.ui.btnAdd).toHaveClass('hidden');
              expect(indexView.ui.btnUpdate.hasClass('hidden')).toBeFalsy();
            });

            it('can cancel the update by clicking to cancel button', function () {

              indexView.ui.btnCancel.click();

              expect(indexView.ui.btnUpdate).toHaveClass('hidden');
              expect(indexView.ui.btnCancel).toHaveClass('hidden');
              expect(indexView.ui.btnAdd.hasClass('hidden')).toBeFalsy();
              expect(indexView.ui.name).toHaveValue('');
              expect(indexView.ui.presentation).toHaveValue('');
            });

          });

          describe('change the option type list properties', function () {

            beforeEach(function () {
              
              sinon.spy(indexView.collection, 'fetch');
              sinon.spy(indexView, '_createPaginationList');
              indexView.ui.displaySelect.val('10');
            });

            afterEach(function () {

              indexView.collection.fetch.restore();
              indexView._createPaginationList.restore();
            });

            it('create new pagination when index view initialize', function () {

              indexView.onRender();

              expect(indexView._createPaginationList).toHaveBeenCalledWith(1);
            });

            it('can resort option types list in collection view', function () {

            });

            describe('can search in option types list', function () {

              it('can search option type by id', function () {
              });

              it('can search option type by option type properties', function () {
              });

              it('can remove search option type by clicking to reset button', function () {
              });
            });

            describe('update new pagination list', function () {
              
              var newCurrentPageItem;

              beforeEach(function () {

                /* 
                 * Index View in testing environment doesn't create pagination list
                 * so we need to initialize pagination list 
                 */
                indexView.ui.paginationList.html(App.module('Pagination').createPageItems(1, 10, 25));

                newCurrentPageItem = indexView.$('.pagination li').last();
                newCurrentPageItem.click();
              });

              it('can update new pagination when page change', function () {

                if (typeof newCurrentPageItem !== 'undefined' && newCurrentPageItem) {

                  expect(indexView._createPaginationList).toHaveBeenCalledWith(newCurrentPageItem.data('page'));
                }
              });

              it('can change the page of option type list', function () {

                expect(indexView.collection.fetch).toHaveBeenCalled();
              });

              describe('change the number of option type item in list', function () {

                beforeEach(function () {

                  indexView.ui.displaySelect.change();
                });

                it('re-fetch new collection', function () {

                  expect(indexView.collection.fetch).toHaveBeenCalled();
                });

                it('update new pagination with first item is active', function () {

                  expect(indexView._createPaginationList).toHaveBeenCalledWith(1);
                });
              });
            });

          });

        });
    });
  }
);
