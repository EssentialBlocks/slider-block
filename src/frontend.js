import { createRoot, render, createRef } from "@wordpress/element";
/**
 * External dependencies
 */
import Slider from "react-slick";

/**
 * Mount a React element into a container.
 *
 * `createRoot` is the React 18+ API and is what WordPress 7.1 (React 19) needs —
 * `ReactDOM.render`, which `@wordpress/element`'s `render` re-exports, is removed
 * there. `createRoot` only exists from WordPress 6.2 onwards, and this plugin still
 * declares 6.0 as its floor, so fall back to `render` when it is unavailable.
 *
 * @param {JSX.Element} element   Element to mount.
 * @param {Element}     container DOM node to mount into.
 */
function mount(element, container) {
    if (typeof createRoot === "function") {
        createRoot(container).render(element);
        return;
    }

    render(element, container);
}

window.addEventListener("DOMContentLoaded", (event) => {
    const wrappers = document.getElementsByClassName(`eb-slider-wrapper`);

    for (let wrapper of wrappers) {
        let settings = JSON.parse(wrapper.getAttribute("data-settings"));
        let images = JSON.parse(wrapper.getAttribute("data-images"));
        let sliderContentType = wrapper.getAttribute("data-sliderContentType");
        let sliderType = wrapper.getAttribute("data-sliderType");
        let textAlign = wrapper.getAttribute("data-textAlign");
        let arrowNextIcon = wrapper.getAttribute("data-arrowNextIcon");
        let arrowPrevIcon = wrapper.getAttribute("data-arrowPrevIcon");

        const slider = createRef();

        function SampleNextArrow(props) {
            const { className, style, onClick, arrowNextIcon } = props;
            return (
                <div
                    className={className}
                    style={{ ...style, display: "block" }}
                    onClick={onClick}
                >
                    <i aria-hidden="true" className={arrowNextIcon}></i>
                </div>
            );
        }

        function SamplePrevArrow(props) {
            const { className, style, onClick, arrowPrevIcon } = props;
            return (
                <div
                    className={className}
                    style={{ ...style, display: "block" }}
                    onClick={onClick}
                >
                    <i aria-hidden="true" className={arrowPrevIcon}></i>
                </div>
            );
        }

        settings.nextArrow = <SampleNextArrow arrowNextIcon={arrowNextIcon} />;
        settings.prevArrow = <SamplePrevArrow arrowPrevIcon={arrowPrevIcon} />;

        mount(
            <Slider
                ref={slider}
                {...settings}
                key={`${settings.autoplay}-${settings.adaptiveHeight}`}
                className={sliderType}
            >
                {images.map((image) => (
                    <div className={`eb-slider-item ${sliderContentType}`}>
                        {/*
                          * The editor and save.js always render the image and
                          * only add the link when there is a valid one, so the
                          * front end has to do the same. Splitting this across
                          * two sibling conditions used to drop the image
                          * entirely whenever a buttonUrl was set but failed
                          * validation, because neither branch matched.
                          */}
                        {sliderType === "image" &&
                            (image.buttonUrl && image.isValidUrl ? (
                                <a
                                    href={image.buttonUrl}
                                    target={
                                        image.openNewTab ? "_blank" : "_self"
                                    }
                                    rel="noopener"
                                >
                                    <img
                                        className="eb-slider-image"
                                        src={image.url}
                                        alt={
                                            image.alt ? image.alt : image.title
                                        }
                                    />
                                </a>
                            ) : (
                                <img
                                    className="eb-slider-image"
                                    src={image.url}
                                    alt={image.alt ? image.alt : image.title}
                                />
                            ))}
                        {sliderType === "content" && (
                            <>
                                <img
                                    className="eb-slider-image"
                                    src={image.url}
                                    alt={image.alt ? image.alt : image.title}
                                />
                                <div
                                    className={`eb-slider-content align-${textAlign}`}
                                >
                                    {image.title && image.title.length > 0 && (
                                        <h2
                                            className="eb-slider-title"
                                            dangerouslySetInnerHTML={{
                                                __html: image.title,
                                            }}
                                        ></h2>
                                    )}
                                    {image.subtitle &&
                                        image.subtitle.length > 0 && (
                                            <p
                                                className="eb-slider-subtitle"
                                                dangerouslySetInnerHTML={{
                                                    __html: image.subtitle,
                                                }}
                                            ></p>
                                        )}
                                    <div className="eb-slider-button-wrapper">
                                        {image.showButton &&
                                            image.buttonText &&
                                            image.buttonText.length > 0 && (
                                                <a
                                                    href={
                                                        image.buttonUrl &&
                                                        image.isValidUrl
                                                            ? image.buttonUrl
                                                            : "#"
                                                    }
                                                    className="eb-slider-button"
                                                    target={
                                                        image.openNewTab
                                                            ? "_blank"
                                                            : "_self"
                                                    }
                                                    rel="noopener"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            image.buttonText,
                                                    }}
                                                ></a>
                                            )}

                                        {image.showSecondButton &&
                                            image.secondButtonText &&
                                            image.secondButtonText.length >
                                                0 && (
                                                <a
                                                    href={
                                                        image.secondButtonUrl &&
                                                        image.isValidUrl
                                                            ? image.secondButtonUrl
                                                            : "#"
                                                    }
                                                    className="eb-slider-second-button"
                                                    target={
                                                        image.secondButtonOpenNewTab
                                                            ? "_blank"
                                                            : "_self"
                                                    }
                                                    rel="noopener"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            image.secondButtonText,
                                                    }}
                                                ></a>
                                            )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </Slider>,
            wrapper
        );
    }
});
