/**
 * WordPress dependencies
 */
const { __ } = wp.i18n; 
const { Fragment, useEffect, createRef } = wp.element;
const {
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	useBlockProps,
} = wp.blockEditor;
const { ToolbarGroup, ToolbarItem, ToolbarButton, Button } = wp.components;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import Inspector from "./inspector";
import "./editor.scss";

/**
 * External dependencies
 */
import Slider from "react-slick";

const Edit = ({ isSelected, attributes, setAttributes }) => {
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
		arrowBGColor,
		arrowHoverBGColor,
		dotsColor,
	} = attributes;

	const settings = {
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
		initialSlide,
		vertical
	};

	const slider = createRef();
	const hasImages = !!images.length;

	useEffect(() => {
		slider.current.slickGoTo(initialSlide);
	}, [initialSlide]);



	function onImageSelect(selectedImages, images) {
		let updatedImages = [];
		selectedImages.map((selectedImage, selectedIndex) => {
			let item = {};
			item.url = selectedImage.url;
			item.alt = selectedImage.alt;
			item.id = selectedIndex;
			item.imageId = selectedImage.id;
			if (images.length > 0 ) {
				images.map((image, index) => {
					if (selectedImage.id == image.imageId) {
						item.title = image.title;
						item.subtitle = image.subtitle;
						item.showButton = image.showButton ? image.showButton : true;
						item.buttonText = image.buttonText ? image.buttonText : "See More";
						item.buttonUrl = image.buttonUrl;
						item.openNewTab = image.openNewTab ? image.openNewTab : false;
						item.isValidUrl = image.isValidUrl;
					}
				})
			}
			else {
				item.title = "";
				item.subtitle = "";
				item.showButton = true;
				item.buttonText = "See More";
				item.buttonUrl = "";
				item.openNewTab = false;
				item.isValidUrl = true;
			}
			updatedImages.push(item);
		});
		setAttributes({ images: updatedImages });
	}

	// Show image placeholder if there is no image
	if (!hasImages) {
		return (
			<MediaPlaceholder
				addToGallery={hasImages}
				isAppender={hasImages}
				dropZoneUIOnly={hasImages && !isSelected}
				labels={{
					title: !hasImages && __("Images"),
					instructions:
						!hasImages &&
						__(
							"Drag images, upload new ones or select files from your library."
						),
				}}
				onSelect={(selectedImages) => onImageSelect(selectedImages, images)}
				accept="image/*"
				allowedTypes={["image"]}
				multiple
				value={hasImages ? images : undefined}
			/>
		);
	}

	return [
		isSelected && (
			<Inspector
				attributes={attributes}
				setAttributes={setAttributes}
				slider={slider}
			/>
		),
		<BlockControls>
			<ToolbarGroup>
				<ToolbarItem>
					{() => (
						<MediaUpload
						onSelect={(selectedImages) => onImageSelect(selectedImages, images)}
						allowedTypes={["image"]}
						multiple
						gallery
						value={images.map((img) => img.imageId)}
						render={({ open }) => (
							<Button
								className="components-toolbar__control"
								label={__("Edit gallery")}
								icon="edit"
								onClick={open}
							/>
						)}
					/>
					)}
				</ToolbarItem>
			</ToolbarGroup>
		</BlockControls>,
		<Slider 
			ref={slider} 
			{...settings} 
			key={`${autoplay}-${adaptiveHeight}`}
		>
			{images.map((image) => (
				<div className="eb-slider-item">
					<img className="eb-slider-image" src={image.url} />
					{sliderType === "content" && (
						<div className="eb-slider-content">
							{image.title && image.title.length > 0 && (
								<h2 className="eb-slider-title">{image.title}</h2>
							)}
							{image.subtitle && image.subtitle.length > 0 && (
								<p className="eb-slider-subtitle">{image.subtitle}</p>
							)}
							{image.showButton && image.buttonText && image.buttonText.length > 0 && (
								<a
									href={image.buttonUrl && image.isValidUrl ? image.buttonUrl : "#"}
									className="eb-slider-button-url" 
									traget={image.openNewTab ? "_blank" : "_self"}
								>
									{image.buttonText}
								</a>
							)}
						</div>
					)}
				</div>
			))}
		</Slider>,
	];
};

export default Edit;
