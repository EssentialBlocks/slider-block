/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const {
	Panel,
	PanelBody,
	SelectControl,
	ToggleControl,
	Button,
	ButtonGroup,
	BaseControl,
	TabPanel,
	RangeControl,
	TextControl,
	TextareaControl,
} = wp.components;
const { useEffect } = wp.element;
const { select } = wp.data;

/**
 * React Dependencies 
*/
import RLDD from 'react-list-drag-and-drop/lib/RLDD';

/*
* Internal depencencies 
*/
import {
	WRAPPER_BG,
	WRAPPER_MARGIN,
	WRAPPER_PADDING,
	WRAPPER_BORDER_SHADOW,

	SLIDER_TYPE,
} from "./constants/constants";

import { CAPTION_TYPOGRAPHY } from "./constants/typography-constant";

import {
	mimmikCssForResBtns,
	mimmikCssOnPreviewBtnClickWhileBlockSelected,
} from "../util/helpers";
import ResponsiveDimensionsControl from "../util/dimensions-control-v2";
import TypographyDropdown from "../util/typography-control-v2";
import BorderShadowControl from "../util/border-shadow-control";
import ResponsiveRangeController from "../util/responsive-range-control";
import BackgroundControl from "../util/background-control";
import ColorControl from "../util/color-control";


function Inspector(props) {
	const { attributes, setAttributes } = props;
	const {
		resOption,
		sliderType,
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

	const handleRLDDChange = (newItems) => {
		setAttributes({ images: newItems });
	}

	const handleTitle = (title, id) => {
		let updatedImageArray = images.map(item => 
			{
			if (item.id == id){
				return {...item, title: title};
			}
			return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

	const handleContent = (content, id) => {
		let updatedImageArray = images.map(item => 
			{
			if (item.id == id){
				return {...item, content: content};
			}
			return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

	console.log("Images", images)

	// this useEffect is for setting the resOption attribute to desktop/tab/mobile depending on the added 'eb-res-option-' class only the first time once
	useEffect(() => {
		setAttributes({
			resOption: select("core/edit-post").__experimentalGetPreviewDeviceType(),
		});
	}, []);

	// this useEffect is for mimmiking css for all the eb blocks on resOption changing
	useEffect(() => {
		mimmikCssForResBtns({
			domObj: document,
			resOption,
		});
	}, [resOption]);

	// this useEffect is to mimmik css for responsive preview in the editor page when clicking the buttons in the 'Preview button of wordpress' located beside the 'update' button while any block is selected and it's inspector panel is mounted in the DOM
	useEffect(() => {
		const cleanUp = mimmikCssOnPreviewBtnClickWhileBlockSelected({
			domObj: document,
			select,
			setAttributes,
		});
		return () => {
			cleanUp();
		};
	}, []);

	const resRequiredProps = {
		setAttributes,
		resOption,
		attributes,
	};

	return (
		<InspectorControls key="controls">
			<div className="eb-panel-control">
				<TabPanel
					className="eb-parent-tab-panel"
					activeClass="active-tab"
					// onSelect={onSelect}
					tabs={[
						{
							name: "general",
							title: "General",
							className: "eb-tab general",
						},
						{
							name: "styles",
							title: "Styles",
							className: "eb-tab styles",
						},
						{
							name: "advance",
							title: "Advance",
							className: "eb-tab advance",
						},
					]}
				>
					{(tab) => (
						<div className={"eb-tab-controls" + tab.name}>
							{tab.name === "general" && (
								<>
									<PanelBody title={__("General")}>

										<BaseControl label={__("Slider Type")}>
											<ButtonGroup>
												{SLIDER_TYPE.map((item) => (
													<Button
														isLarge
														isPrimary={sliderType === item.value}
														isSecondary={sliderType !== item.value}
														onClick={() =>
															setAttributes({
																sliderType: item.value,
															})
														}
													>
														{item.label}
													</Button>
												))}
											</ButtonGroup>
										</BaseControl>
										
										{images.map((item, index) => {
											return (
												<PanelBody title={"Slider " + (index+1)} initialOpen={ false }>
													<TextControl
														label={__("Title Text")}
														value={item.title}
														onChange={(text) => handleTitle(text, index)}
													/>
													<TextareaControl
														label={__("Content")}
														value={item.content}
														onChange={(text) => handleContent(text, index)}
													/>
												</PanelBody>
											)
										})}

										{/* // <RLDD
										// 	items={images}
										// 	itemRenderer={(item, index) => {
										// 		return (
										// 			<>
										// 				<PanelBody title={"Slider " + (index+1)} initialOpen={ false }>
										// 					<TextControl
										// 						label={__("Title Text")}
										// 						value={item.title}
										// 						onChange={(text) => handleTitle(text, index)}
										// 					/>
										// 					<TextareaControl
										// 						label={__("Content")}
										// 						value={item.content}
										// 						onChange={(text) => handleContent(text, index)}
										// 					/>

															
										// 				</PanelBody>
										// 			</>
										// 		);
										// 	}}
										// 	onChange={handleRLDDChange}
										// /> */}

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
								</>
							)}
							{tab.name === "styles" && (
								<>
								</>
							)}

							{tab.name === "advance" && (
								<>
								</>
							)}
						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls>
	);
};

export default Inspector;
