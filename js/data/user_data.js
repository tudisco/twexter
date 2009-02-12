/**
twexter helps you learn to read in any language
Copyright � 2008 READ.FM http://license.read.fm
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

Ext.namespace('twexter.user_data');

twexter.user_data = function(config){
    twexter.user_data.superclass.constructor.call(this);
    nconfig = config || {};
    Ext.apply(this, nconfig);
    this.addEvents({
        'settings_loaded': true 
    });
};

twexter.user_data.prototype = {
    
    userid: null,
    
    init: function(){
        
    },
    
    setUserId: function(id){
        this.userid = id;
    }
    
    
    
};

Ext.extend(twexter.data, Ext.util.Observable, twexter.data.prototype);