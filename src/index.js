const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import "./style.scss";
import Edit from "./edit";
import save from "./save";
import attributes from "./attributes";
import Icon from "./icon";
import Example from "./example";

registerBlockType("slider-block/slider-block", {
	title: __("Image Slider Block", "slider-block"),
	description: __(
		"Display Multiple Images In Beautiful Slider & Reduce Page Scroll",
		"slider-block"
	),
	category: "widgets",
	keywords: [__("slider"), __("carousel"), __("images")],
	icon: Icon,
	example: Example,
	attributes,
	edit: Edit,
	save,
});
