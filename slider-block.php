<?php
/**
 * Plugin Name:     Image Slider Block
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
			'You need to run `npm start` or `npm run build` for the "slider-block/slider-block" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'slider-block-slider-block-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-block-editor',
      'essential-blocks-slickjs',
		),
		$script_asset['version']
	);

  $editor_css = 'build/index.css';
	wp_register_style(
		'slider-block-slider-block-block-editor-style',
		plugins_url($editor_css, __FILE__),
		array('slider-block-slider-block-block', 'slick-style'),
		filemtime("$dir/$editor_css")
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'slider-block-slider-block-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

  $frontend_js = 'src/frontend.js';
  wp_register_script(
    'slider-block-slider-block-frontend',
    plugins_url($frontend_js, __FILE__),
    array( "jquery","wp-editor"),
    true
  );


  $slick_css = 'lib/css/slick.css';
  wp_register_style(
    'slick-style',
    plugins_url($slick_css, __FILE__),
    array()
  );

  $slick_js = 'lib/js/slick.min.js';
  wp_register_script(
    'essential-blocks-slickjs',
    plugins_url($slick_js, __FILE__),
    array( "jquery","wp-editor"),
    true
  );

	if( ! WP_Block_Type_Registry::get_instance()->is_registered( 'essential-blocks/slider' ) ) {
    register_block_type( 'slider-block/slider-block', array(
      'editor_script' => 'slider-block-slider-block-block-editor',
      'editor_style'  => 'slider-block-slider-block-block-editor-style',
      'render_callback' => function( $attributes, $content ) {
        if( !is_admin() ) {
          wp_enqueue_style('slider-block-slider-block-block');
          wp_enqueue_style('slick-style');
          wp_enqueue_script('essential-blocks-slickjs');
          wp_enqueue_script('slider-block-slider-block-frontend');
        }
          return $content;
        }
    ) );
  }
}
add_action( 'init', 'create_block_slider_block_block_init' );
