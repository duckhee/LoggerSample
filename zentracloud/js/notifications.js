var print = console.log;
var noti_indicator = $('#notifications-indicator')[0];
noti_indicator.toggle = function(on_off){
    if (on_off=='on') {
        this.classList.add('active');
        this.classList.remove('invisible');
    }
    else {
        this.classList.remove('active');
        this.classList.add('invisible');
    }
};

var notifications = [];
var notification_settings = [];
function load_notifications(){
    var data = {seen:true, archived:false};
    $.when(
        // $.ajax({
        //     url: 'api/1.0/alerts/',
        //     type: 'get',
        //     contentType: 'application/json',
        //     data: data,
        //     success: function(response){
        //         notifications = response.data.alerts;
        //         // print(notifications.length + ' notifications ready');
        //         var unseen = 0;
        //         for (index in notifications){
        //             if (notifications[index].seen){}
        //             else {
        //                 unseen++;
        //             }
        //         }
        //         // update notifications badge
        //         // var noti_indicator = $('#notifications-indicator')[0];
        //         // print(noti_button);
        //         if (unseen > 0){
        //             noti_indicator.toggle('on');
        //         }
        //         noti_indicator.innerText = (unseen);
        //     }
        // }),
        $.ajax({
            url: 'api/2.0/notifications/settings/',
            type: 'get',
            contentType: 'application/json',
            success: function(response){
                notification_settings = response.items;
            }
        })
    ).then();
    
}
load_notifications();

var notification_changes = {
    queue_to_seen:function(notis){
        for (index in notis){
            this.seen.push(notis[index].id);
        }
    },
    queue_to_archive:function(notis){
        if (!isNaN(notis)){
            // print('Archiving : ', notis);
            this.archive.push(notis);
        }
        else {
            for (index in notis){
                this.archive.push(notis[index].id);
            }
        }
    },
    clear:function(){
        this.seen=[];
        this.archive=[];
    },
    send:function(){
        var data = JSON.stringify({
            seen:this.seen,
            archive:this.archive
        });
        for (var i in notification_settings) {
            var setting = notification_settings[i];
            var checked = $('input[data-customersite-pk="' + setting.customersite__pk + '"]').prop('checked');
            setting.subscribed = checked; // NOTE: Could look at tracking whether something changed to save API call
        }
        var settings_data = JSON.stringify({
            items: notification_settings
        });
        var changes = this;
        // print('Change data : ', data);
        $.when(
            // $.ajax({
            //     url: 'api/1.0/alerts/',
            //     type: 'post',
            //     contentType: 'application/json',
            //     data: data,
            //     success: function(response){
            //         // notification_changes.clear();
            //         // print('Noti changes saved ', response);
            //         changes.clear();
            //     }
            // }),

            $.ajax({
                url: 'api/2.0/notifications/settings/',
                type: 'post',
                contentType: 'application/json',
                data: settings_data,
                error: function(error) {
                    addErrorFlash(translations[user_language]['FAILED_TO_UPDATE_NOTIFICATION']);
                }
            })
        )
        .then();
    },
    seen:[],
    archive:[]
};

function archive_all_notifications(){
    for (index in notifications){
        var noti = notifications[index];
        notification_changes.queue_to_archive(noti.id);
    }
    // we do it backwards because doing it forwards involves deleting things as you iterate over them,
    //   which is trouble if you try to do it forwards
    for (var index=notifications.length-1; index>=0; index--) {
        var noti = notifications[index].id;
        remove_notification(noti);
    }
    notification_changes.send();
}

function remove_notification(id){
    // remove element
    var notification = $.find('#notification-'+id)[0];
    notification.remove();

    // remove from list
    for (index in notifications){
        var noti = notifications[index];
        if (noti.id == id){
            notifications.splice(index, 1);
        }
    }
}
function open_subscriptions() {
    console.log('Take user to Subscription modal');
}
function open_invites(){
    console.log('Take user to Invites modal');
}
function open_device(device_id){
    console.log('Take user to Device page : ', device_id);
}

// Greg: this was added so that the notification modal could be closed from any scope, while it is open.
//   It is not yet implemented for any other modal types
var notification_modal = null;

function open_notifications() {
    const notification_actions = {
        subscription: {
            func: showSeasonPassModal,
            name: 'showSeasonPassModal',
            close_modal: true
        },
        invite: {
            func: showInviteModal,
            name: 'showInviteModal',
            close_modal: true
        },
        device: {
            func: open_device,
            name: 'open_device',
            close_modal: true
        }
    };
    const notification_icons = {
        device: '/media/img/ico_device_active.svg',
        subscription: '/media/img/ico_site_active.svg',
        invite: '/media/img/ico_alert_success.svg'
    };

    function build_notification_button_args(notifications) {
        var button_args = [];
        // iterate over them in order
        for (var noti_index = 0; noti_index < notifications.length; noti_index++) {
            var noti = notifications[noti_index];
            var action_type = noti.action;
            var action = notification_actions[action_type];
            var icon_type = noti.icon;
            var icon = notification_icons[icon_type];
            // print('Icon: ', icon_type,' | ', icon);
            var action_func = action.func;
            var func_name = action.name;
            var action_closes_modal = action.close_modal;
            var message = noti.message;
            // var action = notification_actions[func_name];
            var target_id = noti.target_id;
            // action_func(target_id);
            var args = {
                action_name: func_name,
                target_id: target_id,
                message: message,
                close_action: 'close_notifications',
                id: noti.id,
                icon: icon
            };
            if (action_closes_modal) {
                args.close_modal = true;
            }
            if (noti.seen) {
                args.seen = true;
            }
            // var new_button = Mustache.render(button_template, args);
            button_args.push(args);
        }
        return button_args;
    }

    function build_and_show_modal(button_args) {
        var json               = translations[user_language];
        var notifications_template = ZCTemplate.get('notifications-modal-template');
        var button_template = $(notifications_template).find('#notification-button-template')[0].innerHTML;
        var buttons = [];
        for (arg_index in button_args) {
            var arg = button_args[arg_index];
            var button = Mustache.to_html(button_template, arg);
            buttons.push(button);
            // print('Args: ', arg);
            // print('button: ', button,'\n------');
        }
        var new_model_metadata = $.extend(true, json, {buttons: buttons, settings:notification_settings});
        var rendered = Mustache.render(notifications_template, new_model_metadata);
        notification_modal = new ZCModal.modal(
            '<h4 class="modal-title">'+translations[user_language]['NOTIFICATION_SETTINGS']+'<h4>',
            rendered,
            translations[user_language]['CLOSE'],
            true
        );
        notification_modal.show();
        notification_modal.on("accept", function() {
            notification_changes.send();
            return true;
        });
        return notification_modal;
    }

    // check for notifications again? Maybe later
    var button_args = build_notification_button_args(notifications);
    notification_modal = build_and_show_modal(button_args);
    notification_changes.queue_to_seen(notifications);
    noti_indicator.toggle('off');
}

function close_notifications(){
    // this modal is triggered by clicking notifications that close the modal before performing thier action
    notification_changes.send();
    notification_modal.hide();
    // send seen/archive
    // close modal
}
