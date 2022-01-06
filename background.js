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

	let accent_color = color_json.hex;

	dyn_theme.colors.toolbar = "#" + accent_color;
	dyn_theme.colors.icons = contrastingColor(accent_color);

	if(accent_color != current_color) {
		browser.theme.update(dyn_theme);
		current_color = accent_color;
	}

}

function contrastingColor(color) {
	return (luma(color) >= 165) ? '#111' : '#ddd';
}

function luma(color) {
	var rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
	return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

function hexToRGBArray(color) {
	if (color.length === 3)
		color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
	else if (color.length !== 6)
		throw('Invalid hex color: ' + color);
	var rgb = [];
	for (var i = 0; i <= 2; i++)
		rgb[i] = parseInt(color.substr(i * 2, 2), 16);
	return rgb;
}

setTheme();

// Set up an alarm to check this regularly.
browser.alarms.onAlarm.addListener(setTheme);
browser.alarms.create('setTheme', {periodInMinutes: 0.1});
