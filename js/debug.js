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

/**
 * I use firebug to debug this application. The code below creates empty function for non-firebug browsers
 */
DO_DEBUG = true;

if(!window.console || !Ext.isGecko){
	console = {};
	console.log = Ext.emptyFn;
	console.debug = Ext.emptyFn;
	console.info = Ext.emptyFn;
	console.warn = Ext.emptyFn;
	console.error = Ext.emptyFn;
	console.assert = Ext.emptyFn;
	console.dir = Ext.emptyFn;
	console.dirxml = Ext.emptyFn;
	console.trace = Ext.emptyFn;
	console.group = Ext.emptyFn;
	console.groupEnd = Ext.emptyFn;
	console.time = Ext.emptyFn;
	console.timeEnd = Ext.emptyFn;
	console.profile = Ext.emptyFn;
	console.profileEnd = Ext.emptyFn;
	console.count = Ext.emptyFn;
}

//if(Ext.isSafari){
//	console.debug = console.log;
//	console.info = console.log;
//	console.warn = console.log;
//	console.error = console.log;
//	console.assert = Ext.emptyFn;
//	console.dir = Ext.emptyFn;
//	console.dirxml = Ext.emptyFn;
//	console.trace = Ext.emptyFn;
//	console.group = Ext.emptyFn;
//	console.groupEnd = Ext.emptyFn;
//	console.time = Ext.emptyFn;
//	console.timeEnd = Ext.emptyFn;
//	console.profile = Ext.emptyFn;
//	console.profileEnd = Ext.emptyFn;
//	console.count = Ext.emptyFn;
//}
