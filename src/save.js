import { useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const {
		blockId,
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
		speed,
		initialSlide,
		textAlign,
		classHook,
	} = attributes;

	//Slider Settings
	const settings = {
		arrows,
		adaptiveHeight,
		autoplay,
		autoplaySpeed,
		dots,
		fade,
		infinite,
		pauseOnHover,
		slidesToShow: attributes.slideToShowRange,
		speed,
		initialSlide,
		vertical,
		responsive: [
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: attributes.TABslideToShowRange || attributes.slideToShowRange,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: attributes.MOBslideToShowRange || attributes.slideToShowRange,
				}
			}
		]
	};

	return (
		<div {...useBlockProps.save()}>
			<div className={`eb-parent-wrapper eb-parent-${blockId} ${classHook}`}>
				<div
					className={`eb-slider-wrapper ${blockId}`}
					data-settings={JSON.stringify(settings)}
					data-images={JSON.stringify(images)}
					data-sliderContentType={sliderContentType}
					data-sliderType={sliderType}
					data-textAlign={textAlign}
				>
					<div
						className={sliderType}
					>
						{images.map((image, index) => (
							<div className={`eb-slider-item ${sliderContentType}`} key={index}>
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
												target={image.openNewTab ? "_blank" : "_self"}
												rel="noopener"
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
			</div>
		</div>
	);
};

export default Save;
