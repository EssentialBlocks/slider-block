import {
	WRAPPER_BG,
	WRAPPER_MARGIN,
	WRAPPER_PADDING,
	WRAPPER_BORDER_SHADOW,
	TITLE_MARGIN,
	SUBTITLE_MARGIN,
	BUTTON_MARGIN,
	BUTTON_PADDING,
	BUTTON_BORDER_SHADOW,
	SLIDE_TO_SHOW,
	CUSTOM_HEIGHT,
	DOTS_GAP,
} from "./constants/constants";
import * as TYPOGRAPHY from "./constants/typography-constant";

import {
	generateDimensionsAttributes,
	generateTypographyAttributes,
	generateBackgroundAttributes,
	generateBorderShadowAttributes,
	generateResponsiveRangeAttributes,
} from "../util/helpers";

const attributes = {

	// typography attributes ⬇
	...generateTypographyAttributes(Object.values(TYPOGRAPHY)),

	// margin padding attributes ⬇
	...generateDimensionsAttributes(WRAPPER_MARGIN),
	...generateDimensionsAttributes(WRAPPER_PADDING),
	...generateDimensionsAttributes(TITLE_MARGIN, {
		top: 0,
		bottom: 20,
		right: 0,
		left: 0,
		isLinked: false,
	}),
	...generateDimensionsAttributes(SUBTITLE_MARGIN, {
		top: 0,
		bottom: 20,
		right: 0,
		left: 0,
		isLinked: false,
	}),
	...generateDimensionsAttributes(BUTTON_MARGIN, {
		top: 0,
		bottom: 20,
		right: 0,
		left: 0,
		isLinked: false,
	}),
	...generateDimensionsAttributes(BUTTON_PADDING, {
		top: 10,
		bottom: 10,
		right: 30,
		left: 30,
		isLinked: false,
	}),

	// border shadow attributes for Wrapper ⬇
	...generateBorderShadowAttributes(WRAPPER_BORDER_SHADOW, {
		bdrDefaults: {
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
		},
		// noShadow: true,
		// noBorder: true,
	}),
	// border shadow attributes for Button ⬇
	...generateBorderShadowAttributes(BUTTON_BORDER_SHADOW, {
		bdrDefaults: {
			top: 1,
			bottom: 1,
			right: 1,
			left: 1,
		},
		// noShadow: true,
		// noBorder: true,
	}),

	// background attributes for Wrapper ⬇
	...generateBackgroundAttributes(WRAPPER_BG, {
		defaultBgGradient: "linear-gradient(45deg,#ffffff,#ffffff)",
		noOverlay: true,
	}),

	// range controller Slide to Show
	...generateResponsiveRangeAttributes(SLIDE_TO_SHOW, {
		defaultRange: 1,
	}),
	
	// range controller Slider Height
	...generateResponsiveRangeAttributes(CUSTOM_HEIGHT, {
		defaultRange: 300,
	}),

	// range controller Dots Gap
	...generateResponsiveRangeAttributes(DOTS_GAP, {
		defaultRange: 10,
	}),


	resOption: {
		type: "string",
		default: "Desktop",
	},

	// blockId attribute for making unique className and other uniqueness
	blockId: {
		type: "string",
	},
	blockRoot: {
		type: "string",
		default: "essential_block",
	},
	blockMeta: {
		type: "object",
	},
	sliderType: {
		type: "string",
		default: "image"
	},
	sliderContentType: {
		type: "string",
		default: "overlay"
	},
	images: {
		type: "array",
		default: [],
	},
	arrows: {
		type: "boolean",
		default: true,
	},
	adaptiveHeight: {
		type: "boolean",
		default: false,
	},
	autoplay: {
		type: "bolean",
		default: false,
	},
	autoplaySpeed: {
		type: "number",
		default: 3000,
	},
	dots: {
		type: "boolean",
		default: true,
	},
	fade: {
		type: "boolean",
		default: false,
	},
	infinite: {
		type: "boolean",
		default: true,
	},
	vertical: {
		type: "boolean",
		default: false,
	},
	pauseOnHover: {
		type: "boolean",
		default: true,
	},
	isCustomHeight: {
		type: "boolean",
		default: false,
	},
	slidesToShow: {
		type: "number",
		default: 1,
	},
	speed: {
		type: "number",
		default: 500,
	},
	initialSlide: {
		type: "number",
		default: 0,
	},
	titleColor: {
		type: "string",
		default: "#333333",
	},
	subtitleColor: {
		type: "string",
		default: "#333333",
	},
	buttonColorType: {
		type: "string",
		default: "normal",
	},
	buttonColor: {
		type: "string",
		default: "#ffffff",
	},
	buttonHoverColor: {
		type: "string",
		default: "#ffffff",
	},
	buttonBGColor: {
		type: "string",
		default: "#333333",
	},
	buttonHoverBGColor: {
		type: "string",
		default: "#333333",
	},
	overlayColor: {
		type: "string",
		default: "rgb(184 133 228 / 75%)",
	},
	arrowColorType: {
		type: "string",
		default: "normal",
	},
	arrowColor: {
		type: "string",
		default: "#ffffff",
	},
	arrowHoverColor: {
		type: "string",
		default: "#ffffff",
	},
	arrowBGColor: {
		type: "string",
		default: "#333333",
	},
	arrowHoverBGColor: {
		type: "string",
		default: "#333333",
	},
	dotsColor: {
		type: "string",
		default: "#333333",
	},
	textAlign: {
		type: "string",
		default: "left",
	},
	verticalAlign: {
		type: "string",
		default: "center",
	},
};

export default attributes;
