const Save = ({ attributes }) => {
	const {
		images,
		arrows,
		adaptiveHeight,
		autoplay,
		autoplaySpeed,
		dots,
		fade,
		infinite,
		pauseOnHover,
		slidesToShow,
		speed,
	} = attributes;

	return (
		<div
			className="eb-slider"
			data-show-arrows={arrows}
			data-adaptive-height={adaptiveHeight}
			data-autoplay-speed={autoplaySpeed}
			data-show-slides={slidesToShow}
			data-speed={speed}
			data-autoplay={autoplay ? "true" : "false"}
			data-dots={dots ? "true" : "false"}
			data-fade={fade ? "true" : "false"}
			data-infinite={infinite ? "true" : "false"}
			data-hover-pause={pauseOnHover ? "true" : "false"}
		>
			{images.map((image) => (
				<div className="eb-slider-item">
					<img
						className="eb-slider-image"
						src={image.url}
						alt={image.alt}
						data-id={image.id}
					/>
				</div>
			))}
		</div>
	);
};

export default Save;
