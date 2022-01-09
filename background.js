// Theme colors: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors
//About:debugging sometimes is white/light themed for certain accent colors?
let dyn_theme = {
	colors: {
		tab_background_text: '#111',
		frame: '#0F0F0F',
		tab_background_text: "#ddd",
		toolbar_field: "#111",
		toolbar_field_text: "#ddd",
		ntp_background: "#111",
		ntp_text: "#ddd",
		toolbar: "#ff0000"

	}
};

let current_color = "ff0000";

async function setTheme(theme) {
	const response = await fetch('https://falldeaf.xyz/getsetting/HVaMfGkqxUUx7JMQ5QK5uQ2RrXxN4fLxwLwbwCzd/primary_color');
	const color_json = await response.json();

	let accent_color = color_json.value;

	dyn_theme.colors.toolbar = getNewBrightnessColor("#" + accent_color, 25);
	dyn_theme.colors.icons = '#FFF';

	if(accent_color != current_color) {
		browser.theme.update(dyn_theme);
		current_color = accent_color;
	}

}

setTheme();

// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(setTheme);
browser.alarms.create('setTheme', {periodInMinutes: 0.1});
browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
	console.log("Message from the content script: " +
	  request.greeting);
	sendResponse({response: "Response from background script"});
}
  

function getNewBrightnessColor(hex, brightness) {
    var rgb = hexToRgb(hex)
    var HSL = rgbToHsl(rgb.r, rgb.g, rgb.b),
        RGB;
    
    RGB = hslToRgb(HSL[0], HSL[1], brightness / 100);
	let darkercol = rgbToHex(parseInt(RGB[0]), parseInt(RGB[1]), parseInt(RGB[2]));
    return darkercol;
}

function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	  return r + r + g + g + b + b;
	});
  
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}  

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}  

function convertToTwoDigitHexCodeFromDecimal(decimal){
    var code = Math.round(decimal).toString(16);
    
    (code.length > 1) || (code = '0' + code);
    return code;
}
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}