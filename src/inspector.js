/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, RangeControl } from "@wordpress/components";

const Inspector = ({ attributes, setAttributes, slider }) => {
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

	const MAX_SLIDES_TO_SHOW = images.length < 6 ? images.length : 6;

	return (
		<InspectorControls key="controls">
			<PanelBody title={__("Settings")}>
				<ToggleControl
					label={__("Show Arrows")}
					checked={arrows}
					onChange={() => {
						setAttributes({ arrows: !arrows });
					}}
				/>
				<ToggleControl
					label={__("Adaptive Height")}
					checked={adaptiveHeight}
					onChange={() => {
						setAttributes({ adaptiveHeight: !adaptiveHeight });
					}}
				/>

				<ToggleControl
					label={__("Autoplay")}
					checked={autoplay}
					onChange={() => {
						autoplay ? slider.current.slickPlay() : slider.current.slickPause();
						setAttributes({ autoplay: !autoplay });
					}}
				/>

				<ToggleControl
					label={__("Dots")}
					checked={dots}
					onChange={() => setAttributes({ dots: !dots })}
				/>

				<ToggleControl
					label={__("Fade")}
					checked={fade}
					onChange={() => setAttributes({ fade: !fade })}
				/>

				<ToggleControl
					label={__("Infinite")}
					checked={infinite}
					onChange={() => setAttributes({ infinite: !infinite })}
				/>

				<ToggleControl
					label={__("Pause on Hover")}
					checked={pauseOnHover}
					onChange={() => setAttributes({ pauseOnHover: !pauseOnHover })}
				/>

				{!fade && (
					<RangeControl
						label={__("Slides to Show")}
						value={slidesToShow}
						onChange={(slidesToShow) => setAttributes({ slidesToShow })}
						min={1}
						max={MAX_SLIDES_TO_SHOW}
					/>
				)}

				{autoplay && (
					<RangeControl
						label={__("Autoplay Speed")}
						value={autoplaySpeed}
						onChange={(autoplaySpeed) => setAttributes({ autoplaySpeed })}
						min={0}
						max={8000}
					/>
				)}

				<RangeControl
					label={__("Animation Speed")}
					value={speed}
					onChange={(speed) => setAttributes({ speed })}
					min={0}
					max={3000}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Inspector;
