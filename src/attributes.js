const attributes = {
	images: {
		type: "array",
		default: [],
		source: "query",
		selector: "img",
		query: {
			url: {
				type: "string",
				source: "attribute",
				attribute: "src",
			},
			alt: {
				type: "string",
				source: "attribute",
				attribute: "alt",
			},
			id: {
				type: "string",
				source: "attribute",
				attribute: "data-id",
			},
		},
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
