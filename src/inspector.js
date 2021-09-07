/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const {
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	Button,
	ButtonGroup,
	TabPanel,
	RangeControl,
	TextControl,
	TextareaControl,
	ColorPalette,
} = wp.components;
const { useEffect } = wp.element;
const { select } = wp.data;

/*
* Internal depencencies 
*/
import {
	WRAPPER_BG,
	WRAPPER_MARGIN,
	WRAPPER_PADDING,
	WRAPPER_BORDER_SHADOW,
	TITLE_MARGIN,
	SUBTITLE_MARGIN,
	BUTTON_MARGIN,
	BUTTON_PADDING,
	BUTTON_BORDER_SHADOW,
	DOTS_GAP,
	ARROW_POSITION,
	DOTS_POSITION,
	ARROW_SIZE,
	DOTS_SIZE,
	SLIDES_GAP,
	SLIDE_TO_SHOW,
	CUSTOM_HEIGHT,
	NORMAL_HOVER,
	SLIDER_CONTENT_TYPE,
	SLIDER_TYPE,
	UNIT_TYPES,
	HEIGHT_UNIT_TYPES,
	FONT_UNIT_TYPES,
	COLORS,
	TEXT_ALIGN,
	VERTICAL_ALIGN,
} from "./constants/constants";

import { TITLE_TYPOGRAPHY, SUBTITLE_TYPOGRAPHY, BUTTON_TYPOGRAPHY } from "./constants/typography-constant";

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
	const { attributes, setAttributes, slider } = props;
	const {
		resOption,
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

	const handleSubtitle = (text, id) => {
		let updatedImageArray = images.map(item => 
			{
				if (item.id == id){
					return {...item, subtitle: text};
				}
				return item;
			});
		
		setAttributes({images: updatedImageArray});
	}
	
	const handleShowButton = (showButton, id) => {
		let updatedImageArray = images.map(item => 
			{
				if (item.id == id){
					return {...item, showButton: showButton};
				}
				return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

	const handleButtonText = (buttonText, id) => {
		let updatedImageArray = images.map(item => 
			{
				if (item.id == id){
					return {...item, buttonText: buttonText};
				}
				return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

	const validURL = (str) => {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	  }

	const handleButtonURL = (buttonUrl, id) => {
		const validUrl = buttonUrl.length > 0 && validURL(buttonUrl);
		let updatedImageArray = images.map(item => 
			{
				if (item.id == id){
					return {
						...item, 
						buttonUrl: buttonUrl,
						isValidUrl: validUrl
					};
				}
				return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

	const handleOpenNewTab = (openNewTab, id) => {
		let updatedImageArray = images.map(item => 
			{
				if (item.id == id){
					return {...item, openNewTab: openNewTab === true ? true : false};
				}
				return item;
			});
		
		setAttributes({images: updatedImageArray});
	}

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

										<SelectControl
											label={__("Slider Type")}
											value={sliderType}
											options={SLIDER_TYPE}
											onChange={(value) => setAttributes({ sliderType: value })}
										/>

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
											label={__("Vertical Slide")}
											checked={vertical}
											onChange={() => setAttributes({ vertical: !vertical })}
										/>

										<ToggleControl
											label={__("Pause on Hover")}
											checked={pauseOnHover}
											onChange={() => setAttributes({ pauseOnHover: !pauseOnHover })}
										/>
										
										<ToggleControl
											label={__("Custom Height")}
											checked={isCustomHeight}
											onChange={() => setAttributes({ isCustomHeight: !isCustomHeight })}
										/>

										{isCustomHeight && (
											<ResponsiveRangeController
												baseLabel={__("Slider Height", "slider-block")}
												controlName={CUSTOM_HEIGHT}
												resRequiredProps={resRequiredProps}
												units={HEIGHT_UNIT_TYPES}
												min={1}
												max={500}
												step={1}
											/>
										)}

										{!fade && (
											<ResponsiveRangeController
												baseLabel={__("Slides to Show", "slider-block")}
												controlName={SLIDE_TO_SHOW}
												resRequiredProps={resRequiredProps}
												units={[]}
												min={1}
												max={4}
												step={1}
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

									{sliderType === "content" && (
										<PanelBody title={__("Slides")}>
											<SelectControl
												label={__("Content Styles")}
												value={sliderContentType}
												options={SLIDER_CONTENT_TYPE}
												onChange={(value) => setAttributes({ sliderContentType: value })}
											/>
											{images.map((item, index) => {
												return (
													<PanelBody 
														title={item.title && item.title.length > 0 ? item.title : "Slider " + (index+1)} 
														initialOpen={ false }
														onToggle = {() => setAttributes({initialSlide: index})}
														className="eb-slider-item-single-panel"
													>
														<TextControl
															label={__("Title Text")}
															value={item.title}
															onChange={(text) => handleTitle(text, index)}
														/>
														<TextareaControl
															label={__("Subtitle")}
															value={item.subtitle}
															onChange={(text) => handleSubtitle(text, index)}
														/>
														<ToggleControl
															label={__("Show Button")}
															checked={item.showButton}
															onChange={() => handleShowButton( !item.showButton, index)}
														/>
														{item.showButton && (
															<>
																<TextControl
																	label={__("Button Text")}
																	value={item.buttonText}
																	onChange={(text) => handleButtonText(text, index)}
																/>
																<TextControl
																	label={__("Button URL")}
																	value={item.buttonUrl}
																	onChange={(text) => handleButtonURL(text, index)}
																/>
																{ item.buttonUrl && item.buttonUrl.length > 0 && !item.isValidUrl &&
																	<span className="error">URL is not valid</span>
																}
																<ToggleControl
																	label={__("Open in New Tab")}
																	checked={item.openNewTab}
																	onChange={() => handleOpenNewTab( !item.openNewTab, index)}
																/>
															</>
														)}
													</PanelBody>
												)
											})}
										</PanelBody>
									)}
									
								</>
							)}
							{tab.name === "styles" && (
								<>
									<PanelBody title={__("Settings")} initialOpen={true}>
										<ResponsiveRangeController
											baseLabel={__("Slides Gap")}
											controlName={SLIDES_GAP}
											resRequiredProps={resRequiredProps}
											units={[]}
											min={0}
											max={100}
											step={1}
										/>

										{sliderType === "content" && sliderContentType === "content-1" && (
											<ColorControl
												label={__("Overlay Color")}
												color={overlayColor}
												onChange={(color) => setAttributes({ overlayColor: color })}
											/>
										)}
										{sliderType === "content" && (
											<>
												<PanelRow>Text Align</PanelRow>
												<ButtonGroup>
													{TEXT_ALIGN.map((item) => (
														<Button
															isLarge
															isPrimary={textAlign === item.value}
															isSecondary={textAlign !== item.value}
															onClick={() => setAttributes({ textAlign: item.value })}
														>
															{item.label}
														</Button>
													))}
												</ButtonGroup>

												{sliderContentType != "content-2" && (
													<>
														<PanelRow>Vertical Align</PanelRow>
														<ButtonGroup>
															{VERTICAL_ALIGN.map((item) => (
																<Button
																	isLarge
																	isPrimary={verticalAlign === item.value}
																	isSecondary={verticalAlign !== item.value}
																	onClick={() => setAttributes({ verticalAlign: item.value })}
																>
																	{item.label}
																</Button>
															))}
														</ButtonGroup>
													</>
												)}
												
											</>
										)}
									</PanelBody>

									<PanelBody title={__("Title")} initialOpen={false}>
										<PanelRow>Color</PanelRow>
										<ColorPalette
											colors={COLORS}
											value={ titleColor }
											onChange={ ( color ) => setAttributes({ titleColor: color })}
										/>
										<TypographyDropdown
											baseLabel={__("Typography")}
											typographyPrefixConstant={TITLE_TYPOGRAPHY}
											resRequiredProps={resRequiredProps}
										/>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={TITLE_MARGIN}
											baseLabel="Margin"
										/>
									</PanelBody>

									<PanelBody title={__("Subtitle")} initialOpen={false}>
										<PanelRow>Color</PanelRow>
										<ColorPalette
											colors={COLORS}
											value={ subtitleColor }
											onChange={ ( color ) => setAttributes({ subtitleColor: color })}
										/>
										<TypographyDropdown
											baseLabel={__("Typography")}
											typographyPrefixConstant={SUBTITLE_TYPOGRAPHY}
											resRequiredProps={resRequiredProps}
										/>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={SUBTITLE_MARGIN}
											baseLabel="Margin"
										/>
									</PanelBody>

									<PanelBody title={__("Button")} initialOpen={false}>
										<ButtonGroup className="eb-inspector-btn-group">
											{NORMAL_HOVER.map((item) => (
												<Button
													isLarge
													isPrimary={buttonColorType === item.value}
													isSecondary={buttonColorType !== item.value}
													onClick={() => setAttributes({ buttonColorType: item.value })}
												>
													{item.label}
												</Button>
											))}
										</ButtonGroup>

										{buttonColorType === "normal" && (
											<PanelColorSettings
												className={"eb-subpanel"}
												title={__("Normal Color")}
												initialOpen={true}
												colorSettings={[
													{
														value: buttonColor,
														onChange: (newColor) =>
															setAttributes({ buttonColor: newColor }),
														label: __("Color"),
													},
													{
														value: buttonBGColor,
														onChange: (newColor) =>
															setAttributes({ buttonBGColor: newColor }),
														label: __("Background Color"),
													}
												]}
											/>
										)}

										{buttonColorType === "hover" && (
											<PanelColorSettings
												className={"eb-subpanel"}
												title={__("Hover Color")}
												initialOpen={true}
												colorSettings={[
													{
														value: buttonHoverColor,
														onChange: (newColor) =>
															setAttributes({ buttonHoverColor: newColor }),
														label: __("Color"),
													},
													{
														value: buttonHoverBGColor,
														onChange: (newColor) =>
															setAttributes({ buttonHoverBGColor: newColor }),
														label: __("Background Color"),
													}
												]}
											/>
										)}
										<PanelRow>Button Border & Shadow</PanelRow>
										<BorderShadowControl
											controlName={BUTTON_BORDER_SHADOW}
											resRequiredProps={resRequiredProps}
											// noShadow
											// noBorder
										/>
										<TypographyDropdown
											baseLabel={__("Typography")}
											typographyPrefixConstant={BUTTON_TYPOGRAPHY}
											resRequiredProps={resRequiredProps}
										/>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={BUTTON_MARGIN}
											baseLabel="Margin"
										/>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={BUTTON_PADDING}
											baseLabel="Padding"
										/>
									</PanelBody>

									{arrows && (
										<PanelBody title={__("Arrow")} initialOpen={false}>
											<ButtonGroup className="eb-inspector-btn-group">
												{NORMAL_HOVER.map((item) => (
													<Button
														isLarge
														isPrimary={arrowColorType === item.value}
														isSecondary={arrowColorType !== item.value}
														onClick={() => setAttributes({ arrowColorType: item.value })}
													>
														{item.label}
													</Button>
												))}
											</ButtonGroup>

											{arrowColorType === "normal" && (
												<PanelColorSettings
													className={"eb-subpanel"}
													title={__("Normal Color")}
													initialOpen={true}
													colorSettings={[
														{
															value: arrowColor,
															onChange: (newColor) =>
																setAttributes({ arrowColor: newColor }),
															label: __("Color"),
														},
													]}
												/>
											)}

											{arrowColorType === "hover" && (
												<PanelColorSettings
													className={"eb-subpanel"}
													title={__("Hover Color")}
													initialOpen={true}
													colorSettings={[
														{
															value: arrowHoverColor,
															onChange: (newColor) =>
																setAttributes({ arrowHoverColor: newColor }),
															label: __("Color"),
														},
													]}
												/>
											)}

											<ResponsiveRangeController
												baseLabel={__("Arrow Size")}
												controlName={ARROW_SIZE}
												resRequiredProps={resRequiredProps}
												units={FONT_UNIT_TYPES}
												min={1}
												max={50}
												step={1}
											/>

											<ResponsiveRangeController
												baseLabel={__("Arrow Position")}
												controlName={ARROW_POSITION}
												resRequiredProps={resRequiredProps}
												units={UNIT_TYPES}
												min={-50}
												max={100}
												step={1}
											/>
										</PanelBody>
									)}

									{dots && (
										<PanelBody title={__("Dot")} initialOpen={false}>
											<PanelRow>Color</PanelRow>
											<ColorPalette
												colors={COLORS}
												value={ dotsColor }
												onChange={ ( color ) => setAttributes({ dotsColor: color })}
											/>
											<PanelRow>Active Color</PanelRow>
											<ColorPalette
												colors={COLORS}
												value={ dotsActiveColor }
												onChange={ ( color ) => setAttributes({ dotsActiveColor: color })}
											/>


											<ResponsiveRangeController
												baseLabel={__("Dots Size")}
												controlName={DOTS_SIZE}
												resRequiredProps={resRequiredProps}
												units={FONT_UNIT_TYPES}
												min={1}
												max={50}
												step={1}
											/>
											<ResponsiveRangeController
												baseLabel={__("Dots Gap")}
												controlName={DOTS_GAP}
												resRequiredProps={resRequiredProps}
												units={UNIT_TYPES}
												min={0}
												max={50}
												step={1}
											/>
											<ResponsiveRangeController
												baseLabel={__("Dots Position")}
												controlName={DOTS_POSITION}
												resRequiredProps={resRequiredProps}
												units={UNIT_TYPES}
												min={-50}
												max={100}
												step={1}
											/>
										</PanelBody>
									)}
								</>
							)}

							{tab.name === "advance" && (
								<>
									<PanelBody>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={WRAPPER_MARGIN}
											baseLabel="Margin"
										/>
										<ResponsiveDimensionsControl
											resRequiredProps={resRequiredProps}
											controlName={WRAPPER_PADDING}
											baseLabel="Padding"
										/>
									</PanelBody>
									<PanelBody title={__("Background")} initialOpen={false}>
										<BackgroundControl
											controlName={WRAPPER_BG}
											resRequiredProps={resRequiredProps}
											noOverlay
										/>
									</PanelBody>
									<PanelBody title={__("Border & Shadow")} initialOpen={false}>
										<BorderShadowControl
											controlName={WRAPPER_BORDER_SHADOW}
											resRequiredProps={resRequiredProps}
											// noShadow
											// noBorder
										/>
									</PanelBody>
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
