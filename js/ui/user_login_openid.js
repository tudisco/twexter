Ext.ns("twexter.userLoginOpenid");

twexter.userLoginOpenid = function(config){
        twexter.userLoginOpenid.superclass.constructor.call(this);
        this.id = 'login_openid';
        this.cls = this.id;
        this.centerScreen = true;
        var n = config || {};
        Ext.apply(this, n);
        /*this.addEvents({
            "show_menu" : true,
            "hide_menu" : true
        });*/
};

twexter.userLoginOpenid.prototype = {
    
    providers_large : [
        {
            service: 'google',
            name: 'Google',
            url: 'https://www.google.com/accounts/o8/id'
        },
        {
            service: 'yahoo',
            name: 'Yahoo',      
            url: 'http://yahoo.com/'
        },    
        {
            service: 'aol',
            name: 'AOL',     
            label: 'Enter your AOL screenname.',
            url: 'http://openid.aol.com/{username}/'
        },
        {
            service: 'openid',
            name: 'OpenID',     
            label: 'Enter your OpenID.',
            url: '{username}'
        }
    ],

    providers_small : [
        {
            service: 'myopenid',
            name: 'MyOpenID',
            label: 'Enter your MyOpenID username.',
            url: 'http://{username}.myopenid.com/'
        },
        {
            service: 'livejournal',
            name: 'LiveJournal',
            label: 'Enter your Livejournal username.',
            url: 'http://{username}.livejournal.com/'
        },
        {
            service: 'flickr',
            name: 'Flickr',        
            label: 'Enter your Flickr username.',
            url: 'http://flickr.com/{username}/'
        },
        {
            service: 'technorati',
            name: 'Technorati',
            label: 'Enter your Technorati username.',
            url: 'http://technorati.com/people/technorati/{username}/'
        },
        {
            service: 'wordpress',
            name: 'Wordpress',
            label: 'Enter your Wordpress.com username.',
            url: 'http://{username}.wordpress.com/'
        },
        {
            service: 'blogger',
            name: 'Blogger',
            label: 'Your Blogger account',
            url: 'http://{username}.blogspot.com/'
        },
        {
            service: 'verisign',
            name: 'Verisign',
            label: 'Your Verisign username',
            url: 'http://{username}.pip.verisignlabs.com/'
        },
        {
            service: 'vidoop',
            name: 'Vidoop',
            label: 'Your Vidoop username',
            url: 'http://{username}.myvidoop.com/'
        },
        {
            service: 'claimid',
            name: 'ClaimID',
            label: 'Your ClaimID username',
            url: 'http://claimid.com/{username}'
        }
    ],
    
    cookie_expires: 6*30,
    cookie_name: 'openid_provider',
    cookie_path: '/',
    
    img_path: '/images/openid/',
    provider_url: null,
    
    debug: true,
    
    init: function(){
        twexter.userLoginOpenid.superclass.init.call(this);
        this.init2();
    },
    
    init2: function(){
        
        this.providers = [];
        Ext.each(this.providers_large, function(i){this.providers[this.providers.length] = i;}, this);
        Ext.each(this.providers_small, function(i){this.providers[this.providers.length] = i;}, this);
        
        var tpl = new Ext.Template(
            '<form action="/openid_auth.php" method="post" id="{id}_form">',
                '<input type="hidden" name="openid_action" value="login" />',
                '<input id="openid_identifier" type="hidden" name="openid_identifier" value="" />',
                '<input id="openid_sel_service" type="hidden" name="openid_sel_service" value="" />',
                '<fieldset>',
                        '<legend>Sign-in or Create New Account</legend>',
                        
                        '<div id="openid_choice">',
                            '<p>Please click your account provider:</p>',
                            '<div id="openid_btns"></div>',
                        '</div>',
                                
                        '<div id="openid_input_area">',
                            '<input id="openid_identifier" name="openid_identifier" type="text" value="http://" />',
                            '<input id="openid_submit" type="submit" value="Sign-In"/>',
                        '</div>',
                '</fieldset>',
            '</form>'
        );
        
        
        this.tpl_bigbuttons = new Ext.XTemplate(
            '<tpl for="providers">',
            '<div title="{name}" id="openidbtn_{service}" class="openid_button openid_service_{service} openid_{parent.size}_btn"></div>',
            '</tpl>',
            '<br />'
        );
        var btpl = this.tpl_bigbuttons.compile();
        
        this.tpl_input = new Ext.Template('<input id="{id}" class="{cls}" name="{id}" value="{value}" type="text" />',
                                         '<input id="openid_submit" type="submit" value="Sign-In"/>');
        this.tpl_input = this.tpl_input.compile();
        
        tpl.append(this.el, {
            id: this.id
        });
        
        this.openIdInput = Ext.get('openid_input_area');
        this.openIdInput.update('');
        this.openIdBtns = Ext.get('openid_btns');
        this.form = Ext.get(this.id+'_form');
        this.hiddenField = Ext.get('openid_identifier');
        this.hiddenService = Ext.get('openid_sel_service');
        
        /*{*/console.debug('-- Add providers');/*}*/
        
        //Big Providers
        btpl.append(this.openIdBtns, {
            providers : this.providers_large,
            size: 'large',
            imgpath: this.img_path,
            imgext: '.gif'
        });
        
        /*var b = btpl.apply({
            providers : this.providers_large,
            size: 'large',
            imgpath: this.img_path,
            imgext: '.gif'
        });
        
        alert(b);*/
        
        btpl.append(this.openIdBtns, {
            providers : this.providers_small,
            size: 'small',
            imgpath: this.img_path,
            imgext: '.ico'
        })
        
        /*{*/console.debug('-- Finished INIT2');/*}*/
        
        this.buttons = Ext.select('#openid_btns .openid_button');
        
        this.buttons.on('click', this.onOpenidServiceClick, this);
        
        this.bodyProxy = Ext.get(this.bodyId).createChild({
            style:{
               display:"none",
               position:"absolute",
               "z-index":"2900",
               "background-color":"black",
               top:"1px",
               left:"1px",
               bottom:"1px",
               right:"1px"
            }
        });
        
        this.form.on('submit', this.onFormSubmit, this);
        
        this.showAnimation = {callback:this.bodyProxyFadeIn,scope:this};
        this.hideAnimation = {callback:this.bodyProxyFadeOut,scope:this};
    },
    
    bodyProxyFadeIn: function(){
      this.bodyProxy.fadeIn({
            endOpacity:0.4
        });  
    },
    
    bodyProxyFadeOut: function(){
        this.bodyProxy.fadeOut();
    },
    
    onOpenidServiceClick : function(e){
        var t = e.getTarget();
        if(t){
            var id = t.id;
            xt = Ext.get(t);
            if(this.highlight){
                this.highlight.select('div').first().replace(this.highlight);
            }
            this.highlight = xt.wrap({id:'openid_highlight'});
            
            var provider_id = id.split('_')[1];
            
            var provider = this.getServerById(provider_id);
            
            //console.dir(provider);
            this.currentProvider = provider;
            this.hiddenService.dom.value = provider.service;
            
            if(!Ext.isEmpty(provider.label)){
                this.useInputBox(provider);
            }else{
                this.clearInput();
                this.onFormSubmit();
                this.form.dom.submit();
            }
            
            
        }
    },
    
    getServerById: function(provider_id){
        var p = this.providers;
        for(i in p){
            if(p[i].service==provider_id){
                return p[i];
            }
        }
        return false;
    },
    
    useInputBox: function(provider){
        var input = this.openIdInput;
        
        cls = '';
        value = '';
        
        input.update('');
        
        if(provider.service=='openid'){
            value = 'http://';
            cls = "open_id_input";
        }
        
        this.tpl_input.append(input,{
            id:'openid_username',
            value: value,
            cls: cls
        });
        
        Ext.fly('openid_username').focus();
    },
    
    clearInput:function(){
        this.openIdInput.update('');
    },
    
    onFormSubmit: function(e){
        
        if(!this.currentProvider){
            if(e) e.stopEvent();
            return;
        }
        
        var p = this.currentProvider;
        
        var ifield = Ext.fly('openid_username');
        if(ifield){
            var username = ifield.getValue();
        }else{
            var username = null;
        }
        
        var url = p.url;
        
        
        if(url && username){
            url = url.replace('{username}', username);
        }
        
        this.hiddenField.dom.value = url;
        
    }
    
    
};

Ext.extend(twexter.userLoginOpenid, twexter.ui.popup, twexter.userLoginOpenid.prototype);