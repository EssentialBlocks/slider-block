<?php
/**
 * Plugin Name:     Slider Block
 * Description:     Display Multiple Images In Beautiful Slider & Reduce Page Scroll
 * Version:         1.0.0
 * Author:          WPDeveloper
 * Author URI: 		https://wpdeveloper.net
 * License:         GPL-3.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:     slider-block
 *
 * @package         slider-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_slider_block_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "block/slider-block" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-block-slider-block-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'create-block-slider-block-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

  $frontend_js = 'src/frontend.js';
  wp_enqueue_script(
    'essential-blocks-slider-frontend',
    plugins_url($frontend_js, __FILE__),
    array( "jquery","wp-editor"),
    true
  );


  $slick_css = 'src/css/slick.css';
  wp_enqueue_style(
    'slick-style',
    plugins_url($slick_css, __FILE__),
    array()
  );

  $slick_js = 'src/js/slick.min.js';
  wp_enqueue_script(
    'essential-blocks-slickjs',
    plugins_url($slick_js, __FILE__),
    array( "jquery","wp-editor"),
    true
  );

	register_block_type( 'block/slider-block', array(
		'editor_script' => 'create-block-slider-block-block-editor',
		'style'         => 'create-block-slider-block-block',
	) );
}
add_action( 'init', 'create_block_slider_block_block_init' );
