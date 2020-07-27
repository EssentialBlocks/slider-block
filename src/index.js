import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

import "./style.scss";
import Edit from "./edit";
import save from "./save";

registerBlockType("block/slider-block", {
	title: __("Slider Block", "slider-block"),
	description: __(
		"Display Multiple Images In Beautiful Slider & Reduce Page Scroll",
		"slider-block"
	),
	category: "widgets",
	icon: "smiley",
	edit: Edit,
	save,
});
