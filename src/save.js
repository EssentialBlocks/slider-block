import { RichText, useBlockProps } from "@wordpress/block-editor";

import sanitizeLink from "./sanitize-link";

/**
 * Markup of the original (classic) rendering. Sliders saved before 1.5.0 have
 * no `version` and keep saving exactly this, so they stay valid without a
 * deprecation and render through the React front end as before.
 */
const SaveClassic = ({ attributes }) => {
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
        arrowNextIcon,
        arrowPrevIcon,
        dotPreset,
        isRTLEnable,
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
        vertical,
        currentSlide: 0,
        rtl: isRTLEnable,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow:
                        attributes.TABslideToShowRange ||
                        attributes.slideToShowRange,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow:
                        attributes.MOBslideToShowRange ||
                        attributes.slideToShowRange,
                },
            },
        ],
    };

    return (
        <div {...useBlockProps.save()}>
            <div
                className={`eb-parent-wrapper eb-parent-${blockId} ${classHook}`}
            >
                <div
                    className={`eb-slider-wrapper ${blockId}`}
                    data-settings={JSON.stringify(settings)}
                    data-images={JSON.stringify(images)}
                    data-sliderContentType={sliderContentType}
                    data-sliderType={sliderType}
                    data-textAlign={textAlign}
                    data-arrowNextIcon={arrowNextIcon}
                    data-arrowPrevIcon={arrowPrevIcon}
                >
                    <div className={sliderType}>
                        {images.map((image, index) => (
                            <div
                                className={`eb-slider-item ${sliderContentType}`}
                                key={index}
                            >
                                <img
                                    className="eb-slider-image"
                                    src={image.url}
                                />
                                {sliderType === "content" && (
                                    <div
                                        className={`eb-slider-content align-${textAlign}`}
                                    >
                                        {image.title &&
                                            image.title.length > 0 && (
                                                <RichText.Content
                                                    tagName={"h2"}
                                                    className="eb-slider-title"
                                                    value={image.title}
                                                />
                                            )}
                                        {image.subtitle &&
                                            image.subtitle.length > 0 && (
                                                <RichText.Content
                                                    tagName={"p"}
                                                    className="eb-slider-subtitle"
                                                    value={image.subtitle}
                                                />
                                            )}

                                        <div className="eb-slider-button-wrapper">
                                            {image.showButton &&
                                                image.buttonText &&
                                                image.buttonText.length > 0 && (
                                                    <a
                                                        href={
                                                            image.buttonUrl &&
                                                            image.isValidUrl
                                                                ? sanitizeLink(image.buttonUrl)
                                                                : "#"
                                                        }
                                                        className="eb-slider-button"
                                                        target={
                                                            image.openNewTab
                                                                ? "_blank"
                                                                : "_self"
                                                        }
                                                        rel="noopener"
                                                    >
                                                        <RichText.Content
                                                            value={
                                                                image.buttonText
                                                            }
                                                        />
                                                    </a>
                                                )}

                                            {image.showSecondButton &&
                                                image.secondButtonText &&
                                                image.secondButtonText.length >
                                                    0 && (
                                                    <a
                                                        href={
                                                            image.secondButtonUrl &&
                                                            image.isValidUrl
                                                                ? sanitizeLink(image.secondButtonUrl)
                                                                : "#"
                                                        }
                                                        className="eb-slider-button"
                                                        target={
                                                            image.secondButtonOpenNewTab
                                                                ? "_blank"
                                                                : "_self"
                                                        }
                                                        rel="noopener"
                                                    >
                                                        <RichText.Content
                                                            value={
                                                                image.secondButtonText
                                                            }
                                                        />
                                                    </a>
                                                )}
                                        </div>
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

/**
 * Essential Blocks' v4 markup: the slides are saved in the page and the front
 * end starts jQuery Slick on them, which is what lightbox and lazy loading
 * need.
 */
const SaveV4 = ({ attributes }) => {
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
        textAlign,
        classHook,
        arrowNextIcon,
        arrowPrevIcon,
        isRTLEnable,
        titleTag,
        contentTag,
        showLightbox,
        enableLazyLoad,
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
        slidesToShow: attributes.slideToShowRange,
        speed,
        vertical,
        rtl: isRTLEnable,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow:
                        attributes.TABslideToShowRange ||
                        attributes.slideToShowRange,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow:
                        attributes.MOBslideToShowRange ||
                        attributes.slideToShowRange,
                },
            },
        ],
    };

    const isOverlay =
        sliderType === "content" && sliderContentType === "content-1";
    // The overlay covers the whole image, so Content Overlay has no lightbox.
    const lightbox = showLightbox && !isOverlay;

    const image = (item) => (
        <img
            className="eb-slider-image"
            {...(enableLazyLoad ? { "data-lazy": item.url } : { src: item.url })}
            alt={item.alt || ""}
        />
    );

    return (
        <div {...useBlockProps.save()}>
            <div
                className={`eb-parent-wrapper eb-parent-${blockId} ${classHook || ""}`}
            >
                <div
                    className={`eb-slider-wrapper ${blockId}`}
                    data-blockid={blockId}
                    data-version="v4"
                    data-settings={JSON.stringify(settings)}
                    data-arrowNextIcon={arrowNextIcon}
                    data-arrowPrevIcon={arrowPrevIcon}
                    data-lightbox={lightbox ? "true" : "false"}
                >
                    <div
                        className={`eb-slider-init ${
                            sliderType === "content"
                                ? "eb-slider-type-content"
                                : "eb-slider-type-image"
                        }`}
                    >
                        {images.map((item, index) => {
                            const contentLink =
                                isOverlay &&
                                item.enableContentLink &&
                                item.contentLink &&
                                item.contentLink.length > 0 &&
                                item.isContentUrlValid
                                    ? sanitizeLink(item.contentLink)
                                    : "";

                            return (
                                <div
                                    className={`eb-slider-item ${sliderContentType}`}
                                    data-src={item.url}
                                    key={index}
                                >
                                    {sliderType === "image" &&
                                    item.buttonUrl &&
                                    item.isValidUrl ? (
                                        <div>
                                            <a
                                                href={sanitizeLink(item.buttonUrl)}
                                                target={
                                                    item.openNewTab
                                                        ? "_blank"
                                                        : "_self"
                                                }
                                                rel="noopener"
                                            >
                                                {image(item)}
                                            </a>
                                        </div>
                                    ) : (
                                        <div>{image(item)}</div>
                                    )}
                                    {sliderType === "content" && (
                                        <div
                                            className={`eb-slider-content align-${textAlign}${
                                                contentLink ? " has-content-link" : ""
                                            }`}
                                            data-content-link={contentLink || undefined}
                                            data-content-target={
                                                contentLink && item.contentOpenNewTab
                                                    ? "_blank"
                                                    : undefined
                                            }
                                        >
                                            {item.title &&
                                                item.title.length > 0 && (
                                                    <RichText.Content
                                                        tagName={titleTag}
                                                        className="eb-slider-title"
                                                        value={item.title}
                                                    />
                                                )}
                                            {item.subtitle &&
                                                item.subtitle.length > 0 && (
                                                    <RichText.Content
                                                        tagName={contentTag}
                                                        className="eb-slider-subtitle"
                                                        value={item.subtitle}
                                                    />
                                                )}

                                            <div className="eb-slider-button-wrapper">
                                                {item.showButton &&
                                                    item.buttonText &&
                                                    item.buttonText.length > 0 && (
                                                        <a
                                                            href={
                                                                item.buttonUrl &&
                                                                item.isValidUrl
                                                                    ? sanitizeLink(item.buttonUrl)
                                                                    : undefined
                                                            }
                                                            className="eb-slider-button"
                                                            target={
                                                                item.openNewTab
                                                                    ? "_blank"
                                                                    : "_self"
                                                            }
                                                            rel="noopener"
                                                        >
                                                            <RichText.Content
                                                                value={item.buttonText}
                                                            />
                                                        </a>
                                                    )}

                                                {item.showSecondButton &&
                                                    item.secondButtonText &&
                                                    item.secondButtonText.length >
                                                        0 && (
                                                        <a
                                                            href={
                                                                item.secondButtonUrl &&
                                                                item.isValidUrl
                                                                    ? sanitizeLink(item.secondButtonUrl)
                                                                    : undefined
                                                            }
                                                            className="eb-slider-second-button"
                                                            target={
                                                                item.secondButtonOpenNewTab
                                                                    ? "_blank"
                                                                    : "_self"
                                                            }
                                                            rel="noopener"
                                                        >
                                                            <RichText.Content
                                                                value={item.secondButtonText}
                                                            />
                                                        </a>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Called as functions, not rendered as components, so the root element stays
// the block wrapper <div> that the align/anchor support props are applied to.
const Save = (props) =>
    props.attributes.version ? SaveV4(props) : SaveClassic(props);

export default Save;
