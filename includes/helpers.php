<?php

/**
 * Load google fonts.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class Slider_Helper
{

    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * The Constructor.
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueues'));
    }

    /**
     * Load fonts.
     *
     * @access public
     */
    public function enqueues($hook)
    {
        global $pagenow;

        /**
         * Only for admin add/edit pages/posts
         */
        $query_string = isset($_SERVER['QUERY_STRING']) ? sanitize_text_field(wp_unslash($_SERVER['QUERY_STRING'])) : '';

        if ($pagenow == 'post-new.php' || $pagenow == 'post.php' || $pagenow == 'site-editor.php' || ($pagenow == 'themes.php' && !empty($query_string) && strpos($query_string, 'gutenberg-edit-site') !== false)) {

            $controls_asset_path = SLIDER_BLOCK_ADMIN_PATH . '/dist/modules.asset.php';
            if (!file_exists($controls_asset_path)) {
                return;
            }
            $controls_dependencies = require $controls_asset_path;
            $controls_dependencies = is_array($controls_dependencies) ? $controls_dependencies : array();
            $controls_version      = isset($controls_dependencies['version']) ? $controls_dependencies['version'] : SLIDER_BLOCK_VERSION;

            wp_register_script(
                "slider-block-controls-util",
                SLIDER_BLOCK_ADMIN_URL . 'dist/modules.js',
                array_merge(isset($controls_dependencies['dependencies']) ? $controls_dependencies['dependencies'] : array(), ['lodash']),
                $controls_version,
                true
            );

            wp_localize_script('slider-block-controls-util', 'EssentialBlocksLocalize', array(
                'eb_wp_version' => (float) get_bloginfo('version'),
                'rest_rootURL' => get_rest_url(),
								'fontAwesome' => "true"
            ));

            if ($pagenow == 'post-new.php' || $pagenow == 'post.php') {
                wp_localize_script('slider-block-controls-util', 'eb_conditional_localize', array(
                    'editor_type' => 'edit-post'
                ));
            } else if ($pagenow == 'site-editor.php' || $pagenow == 'themes.php') {
                wp_localize_script('slider-block-controls-util', 'eb_conditional_localize', array(
                    'editor_type' => 'edit-site'
                ));
            }

						wp_register_style(
							'essential-blocks-icon-picker-css',
							SLIDER_BLOCK_ADMIN_URL . 'dist/style-modules.css',
							array(),
							$controls_version
						);

            /**
             * This handle must stay plugin-specific. `dist/modules.css` is built from
             * this plugin's own `controls` submodule pin, so it differs between the
             * Essential Blocks single-block plugins. Registering it under a shared
             * name (it used to be `essential-blocks-editor-css`) meant that whichever
             * plugin loaded first won the handle outright — WP_Dependencies::add()
             * returns false for an already-registered handle — and every later
             * plugin's stylesheet *and its dependencies* were silently dropped. That
             * is what broke the arrow icon pickers whenever Button Group was active:
             * the two dependencies below only ever reach the queue through this call.
             */
            wp_enqueue_style(
                'slider-block-editor-css',
                SLIDER_BLOCK_ADMIN_URL . 'dist/modules.css',
                array('essential-blocks-icon-picker-css', 'essential-blocks-fontawesome'),
                $controls_version,
                'all'
            );
        }
    }
    public static function get_block_register_path($blockname, $blockPath)
    {
        // Minimum supported WP is 6.0, so path-based registration is always available.
        return $blockPath;
    }

    /**
     * Clean the slide data the front-end script renders from `data-images`,
     * and the links in the saved markup.
     *
     * Rich text fields keep what wp_kses_post() allows, and links whose URL
     * scheme is not allowed become "#". `data-images` is only rewritten when
     * something was removed, so existing blocks render byte for byte as saved.
     * Needs the HTML API (WordPress 6.2+); on older versions the markup is
     * returned as is.
     *
     * @param string $content Saved block markup.
     * @return string
     */
    public static function sanitize_slider_markup($content)
    {
        if (!is_string($content) || !class_exists('WP_HTML_Tag_Processor')) {
            return $content;
        }

        $tags = new WP_HTML_Tag_Processor($content);
        while ($tags->next_tag()) {
            if ('A' === $tags->get_tag()) {
                $href = $tags->get_attribute('href');
                if (is_string($href) && !self::is_allowed_link($href)) {
                    $tags->set_attribute('href', '#');
                }
                continue;
            }

            $images = $tags->get_attribute('data-images');
            if (!is_string($images)) {
                continue;
            }
            $data = json_decode($images, true);
            if (!is_array($data)) {
                $tags->set_attribute('data-images', '[]');
                continue;
            }

            $changed = false;
            foreach ($data as $index => $image) {
                if (!is_array($image)) {
                    unset($data[$index]);
                    $changed = true;
                    continue;
                }
                foreach (array('title', 'subtitle', 'buttonText', 'secondButtonText') as $key) {
                    if (!isset($image[$key])) {
                        continue;
                    }
                    $clean = is_string($image[$key]) ? wp_kses_post($image[$key]) : '';
                    if ($clean !== $image[$key]) {
                        $data[$index][$key] = $clean;
                        $changed = true;
                    }
                }
                foreach (array('buttonUrl', 'secondButtonUrl') as $key) {
                    if (!isset($image[$key])) {
                        continue;
                    }
                    if (!is_string($image[$key]) || !self::is_allowed_link($image[$key])) {
                        $data[$index][$key] = '#';
                        $changed = true;
                    }
                }
            }

            if ($changed) {
                $tags->set_attribute('data-images', wp_json_encode(array_values($data), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }
        }

        return $tags->get_updated_html();
    }

    /**
     * Whether a link is relative or uses a scheme from wp_allowed_protocols().
     *
     * @param string $link
     * @return bool
     */
    private static function is_allowed_link($link)
    {
        // Browsers ignore leading/trailing control characters and spaces,
        // and tabs or newlines anywhere, when they read a URL's scheme.
        $normalised = preg_replace('/[\t\n\r]/', '', trim($link, "\x00..\x20"));
        if (!preg_match('/^([a-z][a-z0-9+.\-]*):/i', $normalised, $scheme)) {
            return true;
        }
        return in_array(strtolower($scheme[1]), array_map('strtolower', wp_allowed_protocols()), true);
    }
}
Slider_Helper::register();
