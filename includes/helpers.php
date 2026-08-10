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

            wp_enqueue_style(
                'essential-blocks-editor-css',
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
}
Slider_Helper::register();
