Ext.namespace('twexter.utils.clipBoard');
/**
 * @class Ext.ux.clipBoard
 * @extends Ext.util.Observable
 * @version 0.1
 * Simulates systems clipboard behaviors. However the data is stored via System Clipboard,
 * Any data will be serialized as String(Todo).
 * FireFox fails to get the clipbord data dut to 'Denied Permission'.More details at:
 * http://developer.mozilla.org/en/docs/Using_the_Clipboard
 * @param {Mixed} data
 * @param {Boolean} copyORcut True if this action is 'CUT', othetwise "COPY".Default action is "COPY".
 */
twexter.utils.clipBoard = function(data, el){
	twexter.utils.clipBoard.superclass.constructor.call(this);
	if(data) this.setData(data, el);
};

Ext.extend(twexter.utils.clipBoard, Ext.util.Observable, {
	
	tpl: "\n"+'<div style="z-index:2000;position: absolute;display: none;background-color: #D6D3BD;padding: 10px;" id="{id}" class="a_clipboard"><textarea id="{id}_text">{data}</textarea></div>',
	bodyId: MAIN_BODY,
	id: null,
	
	setData:function(data, elcen){
                /* Getting access to the clip board has become a royal pain.. so here is the
                  alternative.. to show a window with text box and content */
                
                var tpl = new Ext.Template(this.tpl);
                if(this.id==null) this.id = Ext.id();
                
                tpl.append(Ext.get(this.bodyId), {
                   id: this.id,
                   data: data
                });
                
                var el = Ext.get(this.id);
		this.el = el;
                var elt = Ext.get(this.id+'_text');
		this.elt = elt;
                
                
                el.show();
		/*{*/console.debug("CLIP SHOWING: ", this.id);/*}*/
		
                if(elcen){
                    el.center(elcen);
                }else{
                    el.center();
                }
                elt.focus();
                elt.dom.select();
                
                //Ext.getDoc().on('click', this.onDocClick, this);
                this.setDocClickEvent.defer(1000, this);
                
	},
	
	setDocClickEvent: function(){
		Ext.getDoc().on('click', this.onDocClick, this);
	},
        
        onDocClick: function(e){
            if(!e.within(this.el)){
                this.el.hide();
                this.el.remove();
                Ext.getDoc().un('click', this.onDocClick);
                delete this;
            }
        }
});