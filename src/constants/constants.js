const { __ } = wp.i18n;

// the consts defined here should be unique from one another
export const WRAPPER_BG = "wrprBg";
export const WRAPPER_MARGIN = "wrpMargin";
export const WRAPPER_PADDING = "wrpPadding";
export const WRAPPER_BORDER_SHADOW = "wrpBorderShadow";
export const TITLE_MARGIN = "titleMargin";
export const SUBTITLE_MARGIN = "subtitleMargin";
export const BUTTON_MARGIN = "buttonMargin";
export const BUTTON_BORDER_SHADOW = "buttonBorderShadow";
export const SLIDE_TO_SHOW = "slideToShow";
export const CUSTOM_HEIGHT = "sliderHeight";
export const DOTS_GAP = "dotsGap";

export const NORMAL_HOVER = [
	{ label: "Normal", value: "normal" },
	{ label: "Hover", value: "hover" },
];

export const VERTICAL_ALIGN = [
	{ label: __("Top"), value: "top" },
	{ label: __("Center"), value: "center" },
	{ label: __("Bottom"), value: "bottom" },
];

export const TEXT_ALIGN = [
	{ label: __("Left"), value: "left" },
	{ label: __("Right"), value: "right" },
	{ label: __("Center"), value: "center" },
	{ label: __("Justify"), value: "justify" },
];

export const SLIDER_TYPE = [
	{ label: __("Image Only"), value: "image" },
	{ label: __("Image with Content"), value: "content" },
];

export const SLIDER_CONTENT_TYPE = [
	{ label: __("Content Overlay"), value: "content-1" },
	{ label: __("Content Bottom"), value: "content-2" },
	{ label: __("Content Left"), value: "content-3" },
	{ label: __("Content Right"), value: "content-4" },
];

export const UNIT_TYPES = [
	{ label: "px", value: "px" },
	{ label: "%", value: "%" },
	{ label: "em", value: "em" },
];

export const COLORS = [
    { name: 'Black', color: '#000000' },
    { name: 'Cyan bluish gray', color: '#abb8c3' },
    { name: 'White', color: '#ffffff' },
    { name: 'Pale pink', color: '#ffc0cb' },
    { name: 'Vivid red', color: '#cf2e2e' },
    { name: 'Luminous vivid orange', color: '#ff6900' },
    { name: 'Luminous vivid amber', color: '#fcb900' },
    { name: 'Light green cyan', color: '#7bdcb5' },
    { name: 'Vivid green cyan', color: '#00d084' },
    { name: 'Pale cyan blue', color: '#8ed1fc' },
    { name: 'Vivid cyan blue', color: '#3593e3' },
    { name: 'Vivid purple', color: '#9b51e0' },
];