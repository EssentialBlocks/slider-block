const Save = ({ attributes }) => {
	const {
		resOption,
		blockId,
		blockRoot,
		blockMeta,
		sliderType,
		sliderContentType,
		images,
		arrows,
		adaptiveHeight,
		autoplay,
		autoplaySpeed,
		dots,
		fade,
		infinite,
		vertical,
		pauseOnHover,
		isCustomHeight,
		speed,
		initialSlide,
		titleColor,
		subtitleColor,
		buttonColorType,
		buttonColor,
		buttonHoverColor,
		buttonBGColor,
		buttonHoverBGColor,
		overlayColor,
		arrowColorType,
		arrowColor,
		arrowHoverColor,
		dotsColor,
		dotsActiveColor,
		textAlign,
		verticalAlign,
	} = attributes;

	return (
		<div className={`eb-slider-wrapper ${blockId}`}>
			<div
				className="eb-slider"
				data-show-arrows={arrows}
				data-adaptive-height={adaptiveHeight}
				data-autoplay-speed={autoplaySpeed}
				// data-show-slides={slidesToShow}
				data-speed={speed}
				data-autoplay={autoplay ? "true" : "false"}
				data-dots={dots ? "true" : "false"}
				data-fade={fade ? "true" : "false"}
				data-infinite={infinite ? "true" : "false"}
				data-hover-pause={pauseOnHover ? "true" : "false"}
			>
				{images.map((image) => (
					<div className={`eb-slider-item ${sliderContentType}`}>
						<img className="eb-slider-image" src={image.url} />
						{sliderType === "content" && (
							<div className={`eb-slider-content align-${textAlign}`}>
								{image.title && image.title.length > 0 && (
									<h2 className="eb-slider-title">{image.title}</h2>
								)}
								{image.subtitle && image.subtitle.length > 0 && (
									<p className="eb-slider-subtitle">{image.subtitle}</p>
								)}
								{image.showButton && image.buttonText && image.buttonText.length > 0 && (
									<a
										href={image.buttonUrl && image.isValidUrl ? image.buttonUrl : "#"}
										className="eb-slider-button" 
										traget={image.openNewTab ? "_blank" : "_self"}
									>
										{image.buttonText}
									</a>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Save;
