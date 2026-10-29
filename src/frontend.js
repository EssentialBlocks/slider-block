import { createRoot, render, createRef } from "@wordpress/element";
/**
 * External dependencies
 */
import Slider from "react-slick";

import sanitizeHtml from "./sanitize-html";
import sanitizeLink from "./sanitize-link";

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

/**
 * Build a Slick arrow holding the chosen Font Awesome icon. Built with DOM
 * calls, not an HTML string, so the saved icon value can only ever be a class.
 *
 * @param {string} icon      Icon class from data-arrowPrevIcon/NextIcon.
 * @param {string} direction "prev" or "next".
 * @return {HTMLElement} Arrow element.
 */
function arrowElement(icon, direction) {
    const arrow = document.createElement("div");
    arrow.className = `slick-${direction}`;
    arrow.setAttribute("role", "button");
    arrow.setAttribute("tabindex", "0");
    arrow.setAttribute(
        "aria-label",
        direction === "prev" ? "Previous slide" : "Next slide"
    );
    arrow.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            arrow.click();
        }
    });

    const iconElement = document.createElement("i");
    iconElement.setAttribute("aria-hidden", "true");
    iconElement.className = icon || "";
    arrow.appendChild(iconElement);

    return arrow;
}

/**
 * Image URL for a lightbox slide. Slick Lightbox writes it into an HTML
 * string (`src="..."`) without escaping, so it is escaped here: a quote or
 * angle bracket in the saved URL can then only ever be part of the URL.
 *
 * @param {Element} item The .eb-slider-item element.
 * @return {string} Escaped image URL.
 */
function lightboxImageSrc(item) {
    const src = sanitizeLink(item.getAttribute("data-src") || "");
    return src.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/**
 * Let links (slide buttons, linked images) and content links navigate
 * instead of opening the lightbox. A button without a link still opens it.
 *
 * @param {Object} lightbox Slick Lightbox instance.
 * @param {Object} $item    Clicked slide (jQuery).
 * @param {Event}  event    Click event.
 * @return {boolean} Whether the lightbox should open.
 */
function shouldOpenLightbox(lightbox, $item, event) {
    const link = event.target.closest("a[href]");
    if (link) {
        // Slick Lightbox cancels the click before it asks, so follow the
        // link here.
        if (
            link.getAttribute("target") === "_blank" ||
            event.ctrlKey ||
            event.metaKey
        ) {
            window.open(link.href, "_blank", "noopener,noreferrer");
        } else {
            window.location.href = link.href;
        }
        return false;
    }
    return !event.target.closest(".has-content-link");
}

/**
 * Follow a Content Overlay slide's content link, unless a button was clicked.
 *
 * @param {Event}   event   Click or keydown event.
 * @param {Element} content The .eb-slider-content element.
 */
function followContentLink(event, content) {
    if (event.target.closest(".eb-slider-button-wrapper")) {
        return;
    }
    const link = sanitizeLink(content.getAttribute("data-content-link") || "");
    if (!link || link === "#") {
        return;
    }
    event.preventDefault();
    if (content.getAttribute("data-content-target") === "_blank") {
        window.open(link, "_blank", "noopener,noreferrer");
    } else {
        window.location.href = link;
    }
}

/**
 * Start a v4 slider: the slides are already in the saved markup, so Slick
 * runs on them directly.
 *
 * @param {HTMLElement} wrapper The .eb-slider-wrapper element.
 */
function initV4(wrapper) {
    const slides = wrapper.querySelector(".eb-slider-init");
    if (!slides) {
        return;
    }

    const $ = window.jQuery;
    if (!$ || !$.fn || typeof $.fn.slick !== "function") {
        // Slick did not load (blocked, or removed by an optimiser): show the
        // slides as plain images rather than leaving the slider hidden.
        slides.classList.remove("eb-slider-init");
        slides.querySelectorAll("img[data-lazy]").forEach((img) => {
            img.setAttribute("src", img.getAttribute("data-lazy"));
        });
        return;
    }

    let settings = {};
    try {
        settings = JSON.parse(wrapper.getAttribute("data-settings")) || {};
    } catch (e) {
        settings = {};
    }
    const adaptiveHeight = !!settings.adaptiveHeight;
    const $slides = $(slides);
    const prevArrow = arrowElement(
        wrapper.getAttribute("data-arrowPrevIcon"),
        "prev"
    );
    const nextArrow = arrowElement(
        wrapper.getAttribute("data-arrowNextIcon"),
        "next"
    );

    $slides.slick({
        lazyLoad: "progressive",
        arrows: settings.arrows,
        adaptiveHeight,
        autoplay: settings.autoplay,
        autoplaySpeed: settings.autoplaySpeed,
        dots: settings.dots,
        fade: settings.vertical ? false : settings.fade,
        infinite: settings.infinite,
        pauseOnHover: settings.pauseOnHover,
        slidesToShow: settings.slidesToShow || 1,
        speed: settings.speed,
        vertical: settings.vertical,
        rtl: document.documentElement.dir === "rtl",
        prevArrow,
        nextArrow,
        responsive: Array.isArray(settings.responsive)
            ? settings.responsive
            : [],
        cssEase: "linear",
    });

    // Slick only inserts arrows given as HTML strings; elements are assumed
    // to be in the page already. Put them where it would: around the list.
    if (settings.arrows) {
        const list = slides.querySelector(".slick-list");
        slides.insertBefore(prevArrow, list);
        slides.insertBefore(nextArrow, list ? list.nextSibling : null);
    }

    // Lazy-loaded images change the slide height once they arrive.
    $slides.on("lazyLoaded", (event, slick) => {
        slick.$slider.slick("setPosition");
        if (adaptiveHeight) {
            setTimeout(() => slick.$slider.slick("setPosition"), 50);
        }
    });
    if (adaptiveHeight) {
        setTimeout(() => $slides.slick("setPosition"), 100);
        $slides.on("afterChange", (event, slick) => {
            slick.$slider.slick("setPosition");
        });
    }

    if (
        wrapper.getAttribute("data-lightbox") === "true" &&
        typeof $.fn.slickLightbox === "function"
    ) {
        $slides.slickLightbox({
            src: lightboxImageSrc,
            itemSelector: ".eb-slider-item",
            navigateByKeyboard: true,
            imageMaxHeight: 0.7,
            shouldOpen: shouldOpenLightbox,
        });
    }

    // Delegated, so the copies Slick makes for infinite looping work too.
    wrapper.addEventListener("click", (event) => {
        const content = event.target.closest(".has-content-link");
        if (content && wrapper.contains(content)) {
            followContentLink(event, content);
        }
    });
    wrapper
        .querySelectorAll(".slick-slide:not(.slick-cloned) .has-content-link")
        .forEach((content) => {
            content.setAttribute("tabindex", "0");
            content.setAttribute("role", "link");
            content.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    followContentLink(event, content);
                }
            });
        });
}

window.addEventListener("DOMContentLoaded", (event) => {
    const wrappers = document.getElementsByClassName(`eb-slider-wrapper`);

    for (let wrapper of wrappers) {
        if (wrapper.getAttribute("data-version")) {
            initV4(wrapper);
            continue;
        }

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
                                    href={sanitizeLink(image.buttonUrl)}
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
                                                __html: sanitizeHtml(image.title),
                                            }}
                                        ></h2>
                                    )}
                                    {image.subtitle &&
                                        image.subtitle.length > 0 && (
                                            <p
                                                className="eb-slider-subtitle"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHtml(image.subtitle),
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
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            sanitizeHtml(image.buttonText),
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
                                                            ? sanitizeLink(image.secondButtonUrl)
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
                                                            sanitizeHtml(image.secondButtonText),
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
