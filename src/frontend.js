jQuery(document).ready(function ($) {
	$(".eb-slider").each(function () {
		let adaptiveHeight = $(this).data("adaptive-height"),
			arrows = $(this).data("show-arrows"),
			autoplay = $(this).data("autoplay"),
			autoplaySpeed = $(this).data("autoplay-speed"),
			dots = $(this).data("dots"),
			infinite = $(this).data("infinite"),
			speed = $(this).data("speed"),
			slidesToShow = $(this).data("show-slides"),
			fade = $(this).data("fade"),
			pauseOnHover = $(this).data("hover-pause");

		$(this).slick({
			arrows,
			adaptiveHeight,
			autoplay,
			autoplaySpeed,
			dots,
			infinite,
			speed,
			slidesToShow,
			fade,
			pauseOnHover,
		});
	});
});
