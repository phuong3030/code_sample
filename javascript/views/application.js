/*
 * Main Layout
 *
 * Use for render header html struture
 */
define(
  [
    'app', 
    'backbone', 
    'marionette', 
    'jquery',
    'hbs!templates/layouts/application'
  ],
  function (App, Backbone, Marionette, $, applicationTemplate) {

    return Backbone.Marionette.LayoutView.extend( {
      template: applicationTemplate,
      className: 'admin_body',

      ui: {
        leftSidebar: '#left-sidebar-wrapper',
        header: 'header',
        mainContent: '.admin-container',

        modal: '#system-modal',
        modalTitle: 'h4.modal-title',
        modalBody: '#system-modal .modal-body h5',
        modalYesButton: '#system-modal .yes-button',
        modalNoButton: '#system-modal .no-button',

        alerts: '.alert',
        closeAlert: '.alert .close',
        successAlert: '.alert-success',
        successAlertContent: '.alert-success strong',
        failureAlert: '.alert-danger',
        failureAlertContent: '.alert-danger strong'
      },

      // Listener for handle resize button event
      events: {
        'click @ui.modalYesButton': 'confirmAction',
        'click @ui.modalNoButton': 'cancelAction',
        'click @ui.closeAlert': 'closeAlert'
      },

      // Store modal data and send back to event source
      modalData: {},

      onShow: function () {

        /* 
         * Load all sub UI modules after the main layout
         * Load all custom modules through loader module
         */ 
        require(
          [
            'modules/layouts/header',
            'modules/layouts/left-sidebar',
            'modules/layouts/right-sidebar',
            'modules/layouts/main-content',
            'modules/layouts/block-ui',
            'modules/loader'
          ]
        );

      },

      onRender: function () {

        var that = this;

        // Listen resize sidebar message 
        App.vent.on('leftSidebar', function (type) {

          that.resizeSidebar(type);
        });

        // Listen collapse header & sidebar message
        App.vent.on('collapseUI', function (type) {

          that.collapseUI(type);
        });

        // Listen on show system modal
        App.vent.on('system-modal:show', function (modalData) {

          // Bind the message content to modal
          that.ui.modalTitle.html(modalData.title);
          that.ui.modalBody.html(modalData.body);

          /* 
           * Mark the eventSource, itemID, ... to modal
           * We will return the user action result to view source later
           */
          that.modalData = modalData;

          // Show bootstrap modal
          that.ui.modal.modal();
        });

        // Listen on show alert after CRUD action
        App.vent.on('alert:show', function (alertType, content) {

          var currentAlert = alertType + 'Alert',
              alertContent = currentAlert + 'Content';

          // Hide all alerts showed before
          that.ui.alerts.addClass('hidden');

          // Bind right type of alert and it's content
          that.ui[alertContent].html(content);
          that.ui[currentAlert].removeClass('hidden');
        });

      },

      closeAlert: function (e) {

        $(e.currentTarget).parent('.alert').toggleClass('hidden');

        return false;
      },

      // User clicks to confirm action
      confirmAction: function () {

        App.vent.trigger(this.modalData.eventSource, 'confirm:modal-event', this.modalData);
      },

      // User cancels his action
      cancelAction: function () {

        App.vent.trigger(this.modalData.eventSource, 'cancel:modal-event', this.modalData);
      },

      /*
       * Left sizebar resizer
       * Resize the sizebar with 3 type: full-width, small, medium
       */
      resizeSidebar: function (type) {

        this.ui.leftSidebar.removeClass('medium small normal').addClass('sidebar ' + type);
        this.ui.mainContent.removeClass('medium small normal').addClass('admin-container ' + type);
      },

      /*
       * Collapse the sizebar and header by user
       */
      collapseUI: function (type) {

        // Code duplicated because we have animation
        this['_' + type + 'Collapsed']();
      },

      _noneCollapsed: function () {

        this.ui.leftSidebar.removeClass('collapsed-sidebar');
        this.ui.header.removeClass('collapsed-header');
        this.ui.mainContent.removeClass('expanded');
      },

      _headerCollapsed: function () {

        this.ui.leftSidebar.removeClass('collapsed-sidebar');
        this.ui.mainContent.removeClass('expanded');
        this.ui.header.addClass('collapsed-header');
      },

      _sidebarCollapsed: function () {

        this.ui.header.removeClass('collapsed-header');
        this.ui.mainContent.addClass('expanded');
        this.ui.leftSidebar.addClass('collapsed-sidebar');
      },
      
      _fullscreenCollapsed: function () {

        this.ui.header.addClass('collapsed-header');
        this.ui.mainContent.addClass('expanded');
        this.ui.leftSidebar.addClass('collapsed-sidebar');
      }

    });
  }
);
