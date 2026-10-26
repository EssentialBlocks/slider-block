import sanitizeLink from "./sanitize-link";

/**
 * Inline elements the slider's rich text fields can produce.
 */
const ALLOWED_TAGS = [
	"A",
	"ABBR",
	"B",
	"BDI",
	"BDO",
	"BR",
	"CODE",
	"DEL",
	"EM",
	"I",
	"INS",
	"KBD",
	"MARK",
	"S",
	"SMALL",
	"SPAN",
	"STRONG",
	"SUB",
	"SUP",
	"U",
];

/**
 * Elements removed together with their content. Any other element that is
 * not allowed is replaced by its children.
 */
const DROPPED_TAGS = [
	"SCRIPT",
	"STYLE",
	"TEMPLATE",
	"NOSCRIPT",
	"IFRAME",
	"OBJECT",
	"EMBED",
	"TEXTAREA",
	"TITLE",
	"SVG",
	"MATH",
];

const ALLOWED_ATTRIBUTES = ["class", "style", "lang", "dir", "title"];
const ALLOWED_LINK_ATTRIBUTES = ["href", "target", "rel"];

function clean(parent) {
	Array.from(parent.childNodes).forEach((node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			return;
		}
		if (node.nodeType !== Node.ELEMENT_NODE) {
			node.remove();
			return;
		}

		const tag = node.tagName.toUpperCase();
		if (DROPPED_TAGS.includes(tag)) {
			node.remove();
			return;
		}

		clean(node);

		if (!ALLOWED_TAGS.includes(tag)) {
			node.replaceWith(...Array.from(node.childNodes));
			return;
		}

		Array.from(node.attributes).forEach(({ name, value }) => {
			const attribute = name.toLowerCase();
			const allowed =
				ALLOWED_ATTRIBUTES.includes(attribute) ||
				(tag === "A" && ALLOWED_LINK_ATTRIBUTES.includes(attribute));
			if (!allowed) {
				node.removeAttribute(name);
			} else if (attribute === "href") {
				const safe = sanitizeLink(value);
				if (safe !== value) {
					node.setAttribute(name, safe);
				}
			}
		});
	});
}

/**
 * Keeps the inline formatting of a slide's rich text and removes everything
 * else (other elements, event handler attributes, unsafe link targets).
 *
 * The markup is parsed in a separate, inert document, so nothing in it runs
 * or loads while it is cleaned.
 *
 * @param {string} html
 * @returns {string}
 */
export default function sanitizeHtml(html) {
	if (typeof html !== "string" || html === "") {
		return "";
	}
	const doc = document.implementation.createHTMLDocument("");
	const container = doc.createElement("div");
	container.innerHTML = html;
	clean(container);
	return container.innerHTML;
}
