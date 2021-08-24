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
	{ label: __("Image Slider"), value: "image" },
	{ label: __("Content Slider"), value: "content" },
];
