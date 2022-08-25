/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import {
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
} from "@wordpress/components";
import { select } from "@wordpress/data";

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

import objAttributes from "./attributes";

import {
	TITLE_TYPOGRAPHY,
	SUBTITLE_TYPOGRAPHY,
	BUTTON_TYPOGRAPHY,
} from "./constants/typography-constant";

const {
	ResponsiveDimensionsControl,
	TypographyDropdown,
	BorderShadowControl,
	ResponsiveRangeController,
	BackgroundControl,
	ColorControl,
	AdvancedControls,
} = window.EBSliderControls;

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
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return { ...item, title: title };
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const handleSubtitle = (text, id) => {
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return { ...item, subtitle: text };
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const handleShowButton = (showButton, id) => {
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return { ...item, showButton: showButton };
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const handleButtonText = (buttonText, id) => {
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return { ...item, buttonText: buttonText };
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const validURL = (str) => {
		var pattern = new RegExp(
			"^(https?:\\/\\/)?" + // protocol
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
				"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
				"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
				"(\\#[-a-z\\d_]*)?$",
			"i"
		); // fragment locator
		return !!pattern.test(str);
	};

	const handleButtonURL = (buttonUrl, id) => {
		const validUrl = buttonUrl.length > 0 && validURL(buttonUrl);
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return {
					...item,
					buttonUrl: buttonUrl,
					isValidUrl: validUrl,
				};
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const handleOpenNewTab = (openNewTab, id) => {
		let updatedImageArray = images.map((item) => {
			if (item.id == id) {
				return { ...item, openNewTab: openNewTab === true ? true : false };
			}
			return item;
		});

		setAttributes({ images: updatedImageArray });
	};

	const resRequiredProps = {
		setAttributes,
		resOption,
		attributes,
		objAttributes,
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
							title: "Style",
							className: "eb-tab styles",
						},
						{
							name: "advance",
							title: "Advanced",
							className: "eb-tab advance",
						},
					]}
				>
					{(tab) => (
						<div className={"eb-tab-controls" + tab.name}>
							{tab.name === "general" && (
								<>
									<PanelBody title={__("General", "essential-blocks")}>
										<SelectControl
											label={__("Slider Type", "essential-blocks")}
											value={sliderType}
											options={SLIDER_TYPE}
											onChange={(value) => setAttributes({ sliderType: value })}
										/>

										<ToggleControl
											label={__("Show Arrows", "essential-blocks")}
											checked={arrows}
											onChange={() => {
												setAttributes({ arrows: !arrows });
											}}
										/>
										<ToggleControl
											label={__("Adaptive Height", "essential-blocks")}
											checked={adaptiveHeight}
											onChange={() => {
												setAttributes({ adaptiveHeight: !adaptiveHeight });
											}}
										/>

										<ToggleControl
											label={__("Autoplay", "essential-blocks")}
											checked={autoplay}
											onChange={() => {
												autoplay
													? slider.current.slickPlay()
													: slider.current.slickPause();
												setAttributes({ autoplay: !autoplay });
											}}
										/>

										<ToggleControl
											label={__("Dots", "essential-blocks")}
											checked={dots}
											onChange={() => setAttributes({ dots: !dots })}
										/>

										<ToggleControl
											label={__("Fade", "essential-blocks")}
											checked={fade}
											onChange={() => setAttributes({ fade: !fade })}
										/>

										<ToggleControl
											label={__("Infinite", "essential-blocks")}
											checked={infinite}
											onChange={() => setAttributes({ infinite: !infinite })}
										/>

										<ToggleControl
											label={__("Vertical Slide", "essential-blocks")}
											checked={vertical}
											onChange={() => setAttributes({ vertical: !vertical })}
										/>

										<ToggleControl
											label={__("Pause on Hover", "essential-blocks")}
											checked={pauseOnHover}
											onChange={() =>
												setAttributes({ pauseOnHover: !pauseOnHover })
											}
										/>

										<ToggleControl
											label={__("Custom Height", "essential-blocks")}
											checked={isCustomHeight}
											onChange={() =>
												setAttributes({ isCustomHeight: !isCustomHeight })
											}
										/>

										{isCustomHeight && (
											<ResponsiveRangeController
												baseLabel={__("Image Height", "essential-blocks")}
												controlName={CUSTOM_HEIGHT}
												resRequiredProps={resRequiredProps}
												units={HEIGHT_UNIT_TYPES}
												min={1}
												max={1200}
												step={1}
											/>
										)}

										{!fade && (
											<ResponsiveRangeController
												baseLabel={__("Slides to Show", "essential-blocks")}
												controlName={SLIDE_TO_SHOW}
												resRequiredProps={resRequiredProps}
												units={[]}
												min={1}
												max={8}
												step={1}
											/>
										)}

										{autoplay && (
											<RangeControl
												label={__("Autoplay Speed", "essential-blocks")}
												value={autoplaySpeed}
												onChange={(autoplaySpeed) =>
													setAttributes({ autoplaySpeed })
												}
												min={0}
												max={8000}
											/>
										)}

										<RangeControl
											label={__("Animation Speed", "essential-blocks")}
											value={speed}
											onChange={(speed) => setAttributes({ speed })}
											min={0}
											max={3000}
										/>
									</PanelBody>

									<PanelBody title={__("Slides", "essential-blocks")}>
										{sliderType === "content" && (
											<SelectControl
												label={__("Content Styles", "essential-blocks")}
												value={sliderContentType}
												options={SLIDER_CONTENT_TYPE}
												onChange={(value) =>
													setAttributes({ sliderContentType: value })
												}
											/>
										)}
										{images.map((item, index) => {
											return (
												<PanelBody
													title={
														item.title && item.title.length > 0
															? item.title
															: "Slider " + (index + 1)
													}
													initialOpen={false}
													onToggle={() =>
														setAttributes({ initialSlide: index })
													}
													className="eb-slider-item-single-panel"
													key={index}
												>
													{sliderType === "content" && (
														<>
															<TextControl
																label={__("Title Text", "essential-blocks")}
																value={item.title}
																onChange={(text) => handleTitle(text, index)}
															/>
															<TextareaControl
																label={__("Subtitle", "essential-blocks")}
																value={item.subtitle}
																onChange={(text) => handleSubtitle(text, index)}
															/>
															<ToggleControl
																label={__("Show Button", "essential-blocks")}
																checked={item.showButton}
																onChange={() =>
																	handleShowButton(!item.showButton, index)
																}
															/>
															{item.showButton && (
																<>
																	<TextControl
																		label={__(
																			"Button Text",
																			"essential-blocks"
																		)}
																		value={item.buttonText}
																		onChange={(text) =>
																			handleButtonText(text, index)
																		}
																	/>
																	<TextControl
																		label={__("Button URL", "essential-blocks")}
																		value={item.buttonUrl}
																		onChange={(text) =>
																			handleButtonURL(text, index)
																		}
																	/>
																	{item.buttonUrl &&
																		item.buttonUrl.length > 0 &&
																		!item.isValidUrl && (
																			<span className="error">
																				URL is not valid
																			</span>
																		)}
																	<ToggleControl
																		label={__(
																			"Open in New Tab",
																			"essential-blocks"
																		)}
																		checked={item.openNewTab}
																		onChange={() =>
																			handleOpenNewTab(!item.openNewTab, index)
																		}
																	/>
																</>
															)}
														</>
													)}
													{sliderType === "image" && (
														<>
															<TextControl
																label={__("URL", "essential-blocks")}
																value={item.buttonUrl}
																onChange={(text) =>
																	handleButtonURL(text, index)
																}
															/>
															{item.buttonUrl &&
																item.buttonUrl.length > 0 &&
																!item.isValidUrl && (
																	<span className="error">
																		URL is not valid
																	</span>
																)}
															<ToggleControl
																label={__(
																	"Open in New Tab",
																	"essential-blocks"
																)}
																checked={item.openNewTab}
																onChange={() =>
																	handleOpenNewTab(!item.openNewTab, index)
																}
															/>
														</>
													)}
												</PanelBody>
											);
										})}
									</PanelBody>
								</>
							)}
							{tab.name === "styles" && (
								<>
									<PanelBody
										title={__("Settings", "essential-blocks")}
										initialOpen={true}
									>
										<ResponsiveRangeController
											baseLabel={__("Slides Gap", "essential-blocks")}
											controlName={SLIDES_GAP}
											resRequiredProps={resRequiredProps}
											units={[]}
											min={0}
											max={100}
											step={1}
										/>

										{sliderType === "content" &&
											sliderContentType === "content-1" && (
												<ColorControl
													label={__("Overlay Color", "essential-blocks")}
													color={overlayColor}
													onChange={(color) =>
														setAttributes({ overlayColor: color })
													}
												/>
											)}
										{sliderType === "content" && (
											<>
												<PanelRow>Text Align</PanelRow>
												<ButtonGroup>
													{TEXT_ALIGN.map((item, index) => (
														<Button
															key={index}
															isPrimary={textAlign === item.value}
															isSecondary={textAlign !== item.value}
															onClick={() =>
																setAttributes({ textAlign: item.value })
															}
														>
															{item.label}
														</Button>
													))}
												</ButtonGroup>

												{sliderContentType != "content-2" && (
													<>
														<PanelRow>Vertical Align</PanelRow>
														<ButtonGroup>
															{VERTICAL_ALIGN.map((item, index) => (
																<Button
																	key={index}
																	isPrimary={verticalAlign === item.value}
																	isSecondary={verticalAlign !== item.value}
																	onClick={() =>
																		setAttributes({ verticalAlign: item.value })
																	}
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

									{sliderType === "content" && (
										<>
											<PanelBody
												title={__("Title", "essential-blocks")}
												initialOpen={false}
											>
												<PanelRow>Color</PanelRow>
												<ColorPalette
													colors={COLORS}
													value={titleColor}
													onChange={(color) =>
														setAttributes({ titleColor: color })
													}
												/>
												<TypographyDropdown
													baseLabel={__("Typography", "essential-blocks")}
													typographyPrefixConstant={TITLE_TYPOGRAPHY}
													resRequiredProps={resRequiredProps}
												/>
												<ResponsiveDimensionsControl
													resRequiredProps={resRequiredProps}
													controlName={TITLE_MARGIN}
													baseLabel="Margin"
												/>
											</PanelBody>

											<PanelBody
												title={__("Subtitle", "essential-blocks")}
												initialOpen={false}
											>
												<PanelRow>Color</PanelRow>
												<ColorPalette
													colors={COLORS}
													value={subtitleColor}
													onChange={(color) =>
														setAttributes({ subtitleColor: color })
													}
												/>
												<TypographyDropdown
													baseLabel={__("Typography", "essential-blocks")}
													typographyPrefixConstant={SUBTITLE_TYPOGRAPHY}
													resRequiredProps={resRequiredProps}
												/>
												<ResponsiveDimensionsControl
													resRequiredProps={resRequiredProps}
													controlName={SUBTITLE_MARGIN}
													baseLabel="Margin"
												/>
											</PanelBody>

											<PanelBody
												title={__("Button", "essential-blocks")}
												initialOpen={false}
											>
												<ButtonGroup className="eb-inspector-btn-group">
													{NORMAL_HOVER.map((item, index) => (
														<Button
															key={index}
															isPrimary={buttonColorType === item.value}
															isSecondary={buttonColorType !== item.value}
															onClick={() =>
																setAttributes({ buttonColorType: item.value })
															}
														>
															{item.label}
														</Button>
													))}
												</ButtonGroup>

												{buttonColorType === "normal" && (
													<PanelColorSettings
														className={"eb-subpanel"}
														title={__("Normal Color", "essential-blocks")}
														initialOpen={true}
														colorSettings={[
															{
																value: buttonColor,
																onChange: (newColor) =>
																	setAttributes({ buttonColor: newColor }),
																label: __("Color", "essential-blocks"),
															},
															{
																value: buttonBGColor,
																onChange: (newColor) =>
																	setAttributes({ buttonBGColor: newColor }),
																label: __(
																	"Background Color",
																	"essential-blocks"
																),
															},
														]}
													/>
												)}

												{buttonColorType === "hover" && (
													<PanelColorSettings
														className={"eb-subpanel"}
														title={__("Hover Color", "essential-blocks")}
														initialOpen={true}
														colorSettings={[
															{
																value: buttonHoverColor,
																onChange: (newColor) =>
																	setAttributes({ buttonHoverColor: newColor }),
																label: __("Color", "essential-blocks"),
															},
															{
																value: buttonHoverBGColor,
																onChange: (newColor) =>
																	setAttributes({
																		buttonHoverBGColor: newColor,
																	}),
																label: __(
																	"Background Color",
																	"essential-blocks"
																),
															},
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
													baseLabel={__("Typography", "essential-blocks")}
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
										</>
									)}

									{arrows && (
										<PanelBody
											title={__("Arrow", "essential-blocks")}
											initialOpen={false}
										>
											<ButtonGroup className="eb-inspector-btn-group">
												{NORMAL_HOVER.map((item, index) => (
													<Button
														key={index}
														isPrimary={arrowColorType === item.value}
														isSecondary={arrowColorType !== item.value}
														onClick={() =>
															setAttributes({ arrowColorType: item.value })
														}
													>
														{item.label}
													</Button>
												))}
											</ButtonGroup>

											{arrowColorType === "normal" && (
												<PanelColorSettings
													className={"eb-subpanel"}
													title={__("Normal Color", "essential-blocks")}
													initialOpen={true}
													colorSettings={[
														{
															value: arrowColor,
															onChange: (newColor) =>
																setAttributes({ arrowColor: newColor }),
															label: __("Color", "essential-blocks"),
														},
													]}
												/>
											)}

											{arrowColorType === "hover" && (
												<PanelColorSettings
													className={"eb-subpanel"}
													title={__("Hover Color", "essential-blocks")}
													initialOpen={true}
													colorSettings={[
														{
															value: arrowHoverColor,
															onChange: (newColor) =>
																setAttributes({ arrowHoverColor: newColor }),
															label: __("Color", "essential-blocks"),
														},
													]}
												/>
											)}

											<ResponsiveRangeController
												baseLabel={__("Arrow Size", "essential-blocks")}
												controlName={ARROW_SIZE}
												resRequiredProps={resRequiredProps}
												units={FONT_UNIT_TYPES}
												min={1}
												max={50}
												step={1}
											/>

											<ResponsiveRangeController
												baseLabel={__("Arrow Position", "essential-blocks")}
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
										<PanelBody
											title={__("Dot", "essential-blocks")}
											initialOpen={false}
										>
											<PanelRow>Color</PanelRow>
											<ColorPalette
												colors={COLORS}
												value={dotsColor}
												onChange={(color) =>
													setAttributes({ dotsColor: color })
												}
											/>
											<PanelRow>Active Color</PanelRow>
											<ColorPalette
												colors={COLORS}
												value={dotsActiveColor}
												onChange={(color) =>
													setAttributes({ dotsActiveColor: color })
												}
											/>

											<ResponsiveRangeController
												baseLabel={__("Dots Size", "essential-blocks")}
												controlName={DOTS_SIZE}
												resRequiredProps={resRequiredProps}
												units={FONT_UNIT_TYPES}
												min={1}
												max={50}
												step={1}
											/>
											<ResponsiveRangeController
												baseLabel={__("Dots Gap", "essential-blocks")}
												controlName={DOTS_GAP}
												resRequiredProps={resRequiredProps}
												units={UNIT_TYPES}
												min={0}
												max={50}
												step={1}
											/>
											<ResponsiveRangeController
												baseLabel={__("Dots Position", "essential-blocks")}
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
									<PanelBody
										title={__("Background", "essential-blocks")}
										initialOpen={false}
									>
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

									<AdvancedControls
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</>
							)}
						</div>
					)}
				</TabPanel>
			</div>
		</InspectorControls>
	);
}

export default Inspector;
