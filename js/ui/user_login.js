/**
twexter helps you learn to read in any language
Copyright © 2008 READ.FM http://license.read.fm
used, under license, U.S. Patent #6,438,515
http://more.read.fm/more read, more market

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License, 
Version 2, as published by the Free Software Foundation at 
http://www.gnu.org/licenses/gpl-2.0.html

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

Ext.namespace('twexter', 'twexter.userlogin');

/**
 * User Login Control
 */
twexter.userlogin = function(config){
    twexter.userlogin.superclass.constructor.call(this);
    var nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
	"user_authinicated" : true
    });
};

twexter.userlogin.prototype = {
    
    /** Control Ext.Element */
    el:null,
    /** Control Template */
    tpl:null,
    /** Control Element ID */
    id: 'login_form',
    /** Control Title Element ID */ 
    id_title: 'login_title',
    /** Html Body Tag ID */
    bodyId: MAIN_BODY,
    /** Form Username Element */
    form_username:null,
    /** Form Password Element */
    form_password:null,
    
    /**
     * Init and Create Control
     */
    init: function(){
        nl = "\n";
        this.tpl = new Ext.Template(
            '<div id="{id}" class="{id}">'+nl,
                '<div id="{id_title}" class="title">User Login</div>'+nl,
                '<div class="body">'+nl,
                    '<div class="field">'+nl,
                        '<label for="login_username">Username:</label><input type="text" id="login_username" name="login_username" />'+nl,
                    '</div>'+nl,
                    '<div class="field">'+nl,
                        '<label for="login_password">Password:</label><input type="password" id="login_password" name="login_password" />'+nl,
                    '</div>'+nl,
                    '<div align="center" class="buttons">',
                        '<button id="login_button" class="button_ok"><img src="/images/userlogin/dialog-apply.png" height="16" width="16" /></button>',
                        '<button id="login_cancel_button" class="button_cancel"><img src="/images/userlogin/dialog-cancel.png" height="16" width="16" /></button>',
                    '</div>'+nl,
                '</div>'+nl,
            '</div>'+nl
        );
    
        this.tpl.append(this.bodyId, {id:this.id,id_title:this.id_title});
        
        this.el = Ext.get(this.id);
        this.form_username = Ext.get('login_username');
        this.form_password = Ext.get('login_password');
        this.form_button_login = Ext.get('login_button');
        this.form_button_cancel = Ext.get('login_cancel_button');
        this.el.hide();
        this.init_events();
        
        //Temporary User Fill IN
        this.form_username.dom.value = "test";
        this.form_password.dom.value = "test";
    },
    
    /**
     * Init Events for Control
     */
    init_events: function(){
        this.form_button_cancel.on('click', this.onCancel, this);
        this.form_button_login.on('click', this.onLogin, this);
        this.el.addKeyListener(Ext.EventObject.ENTER, this.onLogin, this);
        this.el.addKeyListener(Ext.EventObject.ESC, this.onCancel, this);
    },
    
    /**
     * Event, On Login Click
     */
    onLogin: function(){
        var login = this.form_username.getValue();
        var pass = this.form_password.getValue();
        
        if(Ext.isEmpty(login) || Ext.type(login)!="string"){
            alert("Please enter a valid user name");
            return;
        }
        
        if(Ext.isEmpty(pass) || Ext.type(pass)!="string"){
            alert("Please enter a valid password");
            return;
        }
        
        var ajaxObj = {
            params: {username:login,password:pass},
            url: RPC_LOGIN,
            success: this.loginSuccess,
            failure: this.loginFail,
            method: 'POST',
            scope: this
        };
        
        Ext.Ajax.request(ajaxObj);
    },
    
    /**
     * Event, on logon success
     */
    loginSuccess: function(rep){
        rep = Ext.decode(rep.responseText);
        if(rep.success === true){
            //Login Action
            this.user_id = rep.userid;
            this.user_first = rep.name_first;
            this.user_last = rep.name_last;
            this.fireEvent('user_authinicated', this, this.user_id, this.user_first, this.user_last);
        }else{
            //Login Fail
            alert(rep.message);
        }
        this.hide();
    },
    
    /**
     * Event, On logon failure
     */
    loginFail: function(){
        alert("Failed Big");
        his.hide();
    },
    
    /**
     * Show log on form
     */
    show: function(){

        this.bodyProxy = Ext.get(this.bodyId).createChild({
            style:{
               visbility:"hidden",
               position:"absolute",
               "z-index":"2900",
               "background-color":"black",
               top:"1px",
               left:"1px",
               bottom:"1px",
               right:"1px"
            }
        });
        
        this.bodyProxy.fadeIn({
            endOpacity:0.5,
            callback: function(){
                this.el.center();
                this.el.fadeIn({
                    callback:function(){
                        //this.el.frame("0000FF", 1,{duration:0.6});
                        //Temporary User Fill IN
                        this.form_username.dom.value = "test";
                        this.form_password.dom.value = "test";
                        this.form_username.focus();
                    },
                    scope:this
                });
            },
            scope:this
        });

    },
    
    /**
     * Hide logon form
     */
    hide: function(){
        this.el.hide();
        this.clearFields();
        this.clearBodyProxy();
    },
    
    /**
     * Event, on cancel click
     */
    onCancel: function(){
        this.clearFields();
        this.el.fadeOut({
            callback: this.clearBodyProxy,
            scope:this
        });
        
    },
    
    /**
     * Clear the username and password fields
     */
    clearFields: function(){
        this.form_username.dom.value = '';
        this.form_password.dom.value = '';
    },
    
    /**
     * Clear the body proxy (the element that darkens the background)
     */
    clearBodyProxy: function(){
        if(this.bodyProxy){
            this.bodyProxy.fadeOut({
                callback: function(){
                    if(!Ext.isEmpty(this.bodyProxy)){
                        this.bodyProxy.remove();
                        this.bodyProxy = null;
                    }
                },
                scope:this
            });
        }
    }
    
    
};

Ext.extend(twexter.userlogin, Ext.util.Observable, twexter.userlogin.prototype);

