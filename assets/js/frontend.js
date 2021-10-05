const { render } = wp.element;
const { createRef } = wp.element;
/**
 * External dependencies
*/
import Slider from "react-slick";

window.addEventListener("DOMContentLoaded", (event) => {
	const wrappers = document.getElementsByClassName(
		`eb-slider-wrapper` 
	);

	for (let wrapper of wrappers) {
		let settings = JSON.parse(wrapper.getAttribute("data-settings"));
		let images = JSON.parse(wrapper.getAttribute("data-images"));
		let sliderContentType = wrapper.getAttribute("data-sliderContentType");
		let sliderType = wrapper.getAttribute("data-sliderType");
		let textAlign = wrapper.getAttribute("data-textAlign");

		const slider = createRef();
		render(
			<Slider 
					ref={slider} 
					{...settings}
					key={`${settings.autoplay}-${settings.adaptiveHeight}`}
					className={sliderType}
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
				</Slider>,
			wrapper
		);
	}
});