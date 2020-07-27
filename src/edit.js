/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { createRef } from "@wordpress/element";
import {
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
} from "@wordpress/block-editor";
import { Button, Toolbar } from "@wordpress/component";

/**
 * Internal dependencies
 */
import Inspector from "./inspector";

/**
 * External dependencies
 */
import Slider from "react-slick";

const Edit = ({ isSelected, attributes, setAttributes }) => {
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
	};

	const slider = createRef();
	const hasImages = !!images.length;

	return <div>Edit</div>;

	function onImageSelect(images) {
		let updatedImages = [];
		images.map((image) => {
			let item = {};
			item.url = image.url;
			item.alt = image.alt;
			item.id = image.id;

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
				onSelect={(images) => onImageSelect(images)}
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
			<Toolbar>
				<MediaUpload
					onSelect={(images) => onImageSelect(images)}
					allowedTypes={["image"]}
					multiple
					gallery
					value={images.map((img) => img.id)}
					render={({ open }) => (
						<Button
							className="components-toolbar__control"
							label={__("Edit gallery")}
							icon="edit"
							onClick={open}
						/>
					)}
				/>
			</Toolbar>
		</BlockControls>,
		<Slider ref={slider} {...settings} key={`${autoplay}-${adaptiveHeight}`}>
			{images.map((image) => (
				<div className="eb-slider-item">
					<img className="eb-slider-image" src={image.url} />
				</div>
			))}
		</Slider>,
	];
};

export default Edit;
