<?php

/**
 * Plugin Name:     Image Slider Block
 * Description:     Display Multiple Images In Beautiful Slider & Reduce Page Scroll
 * Version:         1.5.0
 * Author:          WPDeveloper
 * Author URI:           https://wpdeveloper.net
 * License:         GPL-3.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:     slider-block
 * Requires at least: 6.0
 * Tested up to:    7.0
 * Requires PHP:    7.4
 *
 * @package         slider-block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */

require_once __DIR__ . '/includes/font-loader.php';
require_once __DIR__ . '/includes/post-meta.php';
require_once __DIR__ . '/includes/helpers.php';

/**
 * Shipped as a git submodule, so it is absent from an uninitialised checkout
 * and from GitHub's "Download ZIP" (which never includes submodules).
 *
 * EbStyleHandler is what turns each block's saved `blockMeta` attribute into
 * the per-post stylesheet under uploads/eb-style/ and enqueues it on the front
 * end. Without it the editor still looks right -- it injects its own <style>
 * tag live -- while the front end silently loses every configured dot, arrow,
 * spacing and sizing rule. Keep the require guarded so a partial checkout does
 * not fatal, but surface the state in wp-admin so it cannot go unnoticed.
 */
if ( file_exists( __DIR__ . '/lib/style-handler/style-handler.php' ) ) {
    require_once __DIR__ . '/lib/style-handler/style-handler.php';
} else {
    add_action( 'admin_notices', 'slider_block_style_handler_missing_notice' );
}

function slider_block_style_handler_missing_notice() {
    if ( ! current_user_can( 'activate_plugins' ) ) {
        return;
    }

    printf(
        '<div class="notice notice-error"><p><strong>%1$s</strong> %2$s <code>git submodule update --init --recursive</code></p></div>',
        esc_html__( 'Image Slider Block:', 'slider-block' ),
        esc_html__( 'the bundled style-handler library is missing, so slider styling will not be applied on the front end. If you installed this plugin from a git checkout, run:', 'slider-block' )
    );
}

function create_block_slider_block_init() {
    if ( ! defined( 'SLIDER_BLOCK_VERSION' ) ) {
        define( 'SLIDER_BLOCK_VERSION', "1.5.0" );
    }
    if ( ! defined( 'SLIDER_BLOCK_ADMIN_URL' ) ) {
        define( 'SLIDER_BLOCK_ADMIN_URL', plugin_dir_url( __FILE__ ) );
    }
    if ( ! defined( 'SLIDER_BLOCK_ADMIN_PATH' ) ) {
        define( 'SLIDER_BLOCK_ADMIN_PATH', dirname( __FILE__ ) );
    }

    $script_asset_path   = SLIDER_BLOCK_ADMIN_PATH . "/dist/index.asset.php";
    $frontend_asset_path = SLIDER_BLOCK_ADMIN_PATH . '/dist/frontend/index.asset.php';
    if ( ! file_exists( $script_asset_path ) || ! file_exists( $frontend_asset_path ) ) {
        throw new Error(
            'You need to run `npm start` or `npm run build` for the "block/testimonial" block first.'
        );
    }
    $index_js         = SLIDER_BLOCK_ADMIN_URL . 'dist/index.js';
    $script_asset     = require $script_asset_path;
    $script_asset     = is_array( $script_asset ) ? $script_asset : [];
    $all_dependencies = array_merge( isset( $script_asset['dependencies'] ) ? $script_asset['dependencies'] : [], [
        'wp-blocks',
        'wp-i18n',
        'wp-element',
        'wp-block-editor',
        'slider-block-controls-util',
        'essential-blocks-slickjs',
        'essential-blocks-eb-animation'
    ] );

    wp_register_script(
        'create-block-slider-block-editor-script',
        $index_js,
        $all_dependencies,
        isset( $script_asset['version'] ) ? $script_asset['version'] : SLIDER_BLOCK_VERSION,
        true
    );

    $animate_css = SLIDER_BLOCK_ADMIN_URL . 'lib/css/animate.min.css';
    wp_register_style(
        'essential-blocks-animation',
        $animate_css,
        [],
        SLIDER_BLOCK_VERSION
    );

    $slick_css = SLIDER_BLOCK_ADMIN_URL . 'lib/css/slick.css';
    wp_register_style(
        'slick-style',
        $slick_css,
        [],
        SLIDER_BLOCK_VERSION
    );

    $slick_js = SLIDER_BLOCK_ADMIN_URL . 'lib/js/slick.min.js';
    wp_register_script(
        'essential-blocks-slickjs',
        $slick_js,
        ["jquery"],
        SLIDER_BLOCK_VERSION,
        true
    );

    $load_animation_js = SLIDER_BLOCK_ADMIN_URL . 'lib/js/eb-animation-load.js';
    wp_register_script(
        'essential-blocks-eb-animation',
        $load_animation_js,
        ["jquery"],
        SLIDER_BLOCK_VERSION,
        true
    );

		wp_register_style(
			'essential-blocks-fontawesome',
			SLIDER_BLOCK_ADMIN_URL . 'lib/css/fontawesome/css/all.min.css',
			[],
			SLIDER_BLOCK_VERSION
		);

    $style_css = SLIDER_BLOCK_ADMIN_URL . 'dist/style.css';
    //Frontend & Editor Style
    wp_register_style(
        'create-block-slider-block-frontend-style',
        $style_css,
        [
            'slick-style',
            'essential-blocks-animation',
						'essential-blocks-fontawesome'
        ],
        SLIDER_BLOCK_VERSION
    );

    //Frontend Style
    $frontend_js    = SLIDER_BLOCK_ADMIN_URL . 'dist/frontend/index.js';
    $frontend_asset = require $frontend_asset_path;
    $frontend_asset = is_array( $frontend_asset ) ? $frontend_asset : [];
    wp_register_script(
        'slider-block-frontend-js',
        $frontend_js,
        isset( $frontend_asset['dependencies'] ) ? $frontend_asset['dependencies'] : [],
        isset( $frontend_asset['version'] ) ? $frontend_asset['version'] : SLIDER_BLOCK_VERSION,
        true
    );

    if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'essential-blocks/slider' ) ) {
        register_block_type(
            Slider_Helper::get_block_register_path( "slider-block/slider-block", SLIDER_BLOCK_ADMIN_PATH ),
            [
                'editor_script'   => 'create-block-slider-block-editor-script',
                'editor_style'    => 'create-block-slider-block-frontend-style',
                'render_callback' => function ( $attributes, $content ) {
                    if ( ! is_admin() ) {
                        wp_enqueue_style( 'create-block-slider-block-frontend-style' );
                        wp_enqueue_script( 'essential-blocks-slickjs' );
                        wp_enqueue_script( 'essential-blocks-eb-animation' );
                        wp_enqueue_script( 'slider-block-frontend-js' );
                    }
                    return $content;
                }
            ]
        );
    }
}
add_action( 'init', 'create_block_slider_block_init', 99 );
