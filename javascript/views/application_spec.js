define(
  [
    'app',
    'views/layouts/application',
    'sinon',
    'jasminesinon',
    'jasminejquery'
  ], function (App, ApplicationLayout) {
    
    describe('Application layout view', function () {

      var applicationLayout;

      beforeEach(function () {

        applicationLayout = new ApplicationLayout();
        applicationLayout.render();
      });

      describe('When view is contructing', function () {

        it('should exist', function () {
          
          expect(applicationLayout).toBeDefined();
        });

      });

      describe('When view is rendered', function () {

        describe('Listen event from vent', function () {

          var appLayout;

          beforeEach(function () {

            appLayout = new ApplicationLayout();
            sinon.spy(App.vent, 'on');

            appLayout.render();
          });

          afterEach(function () {

            App.vent.on.restore();
          });

          it('should listen resize event', function () {

            expect(App.vent.on).toHaveBeenCalledWith('leftSidebar');
          });

          it('should listen collapse ui event', function () {

            expect(App.vent.on).toHaveBeenCalledWith('collapseUI');
          });

          it('should listen show system modal event', function () {

            expect(App.vent.on).toHaveBeenCalledWith('system-modal:show');
          });

          it('should listen show alert event', function () {

            expect(App.vent.on).toHaveBeenCalledWith('alert:show');
          });
        });

        it('can resize sidebar to small type', function () {

          applicationLayout.resizeSidebar('small');

          expect(applicationLayout.ui.leftSidebar).toHaveClass('sidebar small');
          expect(applicationLayout.ui.mainContent).toHaveClass('admin-container small');
        });

        it('can resize sidebar to medium type', function () {

          applicationLayout.resizeSidebar('medium');

          expect(applicationLayout.ui.leftSidebar).toHaveClass('sidebar medium');
          expect(applicationLayout.ui.mainContent).toHaveClass('admin-container medium');
        });

        it('can resize sidebar to normal type', function () {

          applicationLayout.resizeSidebar('normal');

          expect(applicationLayout.ui.leftSidebar).toHaveClass('sidebar normal');
          expect(applicationLayout.ui.mainContent).toHaveClass('admin-container normal');
        });

        it('can collapse header', function () {

          applicationLayout.collapseUI('header');

          expect(applicationLayout.ui.leftSidebar.hasClass('collapsed-sidebar')).toBeFalsy();
          expect(applicationLayout.ui.mainContent.hasClass('expanded')).toBeFalsy();
          expect(applicationLayout.ui.header).toHaveClass('collapsed-header');
        });

        it('can collapse sidebar', function () {

          applicationLayout.collapseUI('sidebar');

          expect(applicationLayout.ui.header.hasClass('collapsed-header')).toBeFalsy();
          expect(applicationLayout.ui.mainContent).toHaveClass('expanded');
          expect(applicationLayout.ui.leftSidebar).toHaveClass('collapsed-sidebar');
        });

        it('can open as fullscreen mode', function () {

          applicationLayout.collapseUI('fullscreen');

          expect(applicationLayout.ui.leftSidebar).toHaveClass('collapsed-sidebar');
          expect(applicationLayout.ui.mainContent).toHaveClass('expanded');
          expect(applicationLayout.ui.header).toHaveClass('collapsed-header');
        });

        it('can open as non collapsed mode', function () {

          applicationLayout.collapseUI('none');

          expect(applicationLayout.ui.header.hasClass('collapsed-header')).toBeFalsy();
          expect(applicationLayout.ui.leftSidebar.hasClass('collapsed-sidebar')).toBeFalsy();
          expect(applicationLayout.ui.mainContent.hasClass('expanded')).toBeFalsy();
        });
      });

      describe('Events', function () {

        beforeEach(function () {

          sinon.stub(App.vent, 'trigger');
        });

        afterEach(function () {

          App.vent.trigger.restore();
        });
      
        it('should trigger custom confirmation events from system modal to specific view', function () {

          applicationLayout.ui.modalYesButton.click();

          expect(App.vent.trigger).toHaveBeenCalledWith(applicationLayout.modalData.eventSource, 'confirm:modal-event', applicationLayout.modalData);
        });

        it('should trigger custom cancel events from system modal to specific view', function () {

          applicationLayout.ui.modalNoButton.click();

          expect(App.vent.trigger).toHaveBeenCalledWith(applicationLayout.modalData.eventSource, 'cancel:modal-event', applicationLayout.modalData);
        });
      });
    });
  }
);
