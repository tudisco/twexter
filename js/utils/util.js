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

function disableSelection(element) {
    element.onselectstart = function() {
        return false;
    };
    element.unselectable = "on";
    element.style.MozUserSelect = "none";
    element.style.cursor = "default";
}

function humane_date_from_seconds(seconds){
    var time_formats = [
		[60, 'Just Now'],
		[90, '1 Minute'], // 60*1.5
		[3600, 'Minutes', 60], // 60*60, 60
		[5400, '1 Hour'], // 60*60*1.5
		[86400, 'Hours', 3600], // 60*60*24, 60*60
		[129600, '1 Day'], // 60*60*24*1.5
		[604800, 'Days', 86400], // 60*60*24*7, 60*60*24
		[907200, '1 Week'], // 60*60*24*7*1.5
		[2628000, 'Weeks', 604800], // 60*60*24*(365/12), 60*60*24*7
		[3942000, '1 Month'], // 60*60*24*(365/12)*1.5
		[31536000, 'Months', 2628000], // 60*60*24*365, 60*60*24*(365/12)
		[47304000, '1 Year'], // 60*60*24*365*1.5
		[3153600000, 'Years', 31536000], // 60*60*24*365*100, 60*60*24*365
		[4730400000, '1 Century'], // 60*60*24*365*100*1.5
	];
        
        var token = ' Ago', i=0, format;
        
        if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = '';
	}
        
        while (format = time_formats[i++]) {
		if (seconds < format[0]) {
			if (format.length == 2) {
				return format[1] + (i > 1 ? token : ''); // Conditional so we don't return Just Now Ago
			} else {
				return Math.round(seconds / format[2]) + ' ' + format[1] + (i > 1 ? token : '');
			}
		}
	}
        
        return seconds;       
}