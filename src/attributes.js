import {
	WRAPPER_BG,
	WRAPPER_MARGIN,
	WRAPPER_PADDING,
	WRAPPER_BORDER_SHADOW,
	GRID_COLUMNS,
	IMAGE_GAP,
	IMAGE_BORDER_SHADOW,
	CAPTION_MARGIN,
	CAPTION_PADDING,
} from "./constants/constants";
import * as CAPTION_TYPOGRAPHY from "./constants/typography-constant";

import {
	generateDimensionsAttributes,
	generateTypographyAttributes,
	generateBackgroundAttributes,
	generateBorderShadowAttributes,
	generateResponsiveRangeAttributes,
} from "../util/helpers";

const attributes = {
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
		default: true,
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
	pauseOnHover: {
		type: "boolean",
		default: true,
	},
	slidesToShow: {
		type: "number",
		default: 1,
	},
	speed: {
		type: "number",
		default: 500,
	},
};

export default attributes;
