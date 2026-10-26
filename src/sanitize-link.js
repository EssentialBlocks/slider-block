/**
 * URL schemes a slider button link may use. Mirrors wp_allowed_protocols().
 */
const ALLOWED_SCHEMES = [
	"http",
	"https",
	"ftp",
	"ftps",
	"mailto",
	"news",
	"irc",
	"irc6",
	"ircs",
	"gopher",
	"nntp",
	"feed",
	"telnet",
	"mms",
	"rtsp",
	"sms",
	"svn",
	"tel",
	"fax",
	"xmpp",
	"webcal",
	"urn",
];

/**
 * Returns the link unchanged when it is relative or uses an allowed scheme,
 * and "#" otherwise. Allowed links are not normalised, so saved markup for
 * existing blocks stays the same.
 *
 * @param {string} link
 * @returns {string}
 */
export default function sanitizeLink(link) {
	if (typeof link !== "string") {
		return "";
	}
	// Browsers ignore leading/trailing control characters and spaces, and
	// tabs or newlines anywhere, when they read a URL's scheme.
	const normalised = link
		.replace(/^[\u0000- ]+|[\u0000- ]+$/g, "")
		.replace(/[\t\n\r]/g, "");
	const scheme = normalised.match(/^([a-z][a-z0-9+.-]*):/i);
	if (scheme && !ALLOWED_SCHEMES.includes(scheme[1].toLowerCase())) {
		return "#";
	}
	return link;
}
