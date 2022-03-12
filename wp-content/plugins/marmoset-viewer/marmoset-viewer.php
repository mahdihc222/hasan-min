<?php
/*
Plugin Name: Marmoset Viewer
Plugin URI: http://www.revolutionart.nl/mvwpplugin/
Description: Allows you to embed Marmoset Toolbag 2 aswell as Toolbag 3 mview files, allowing people to view your models in all their glory.
Version: 1.9.3
Author: Revolutionart
Author URI: revolutionart.nl
*/

// v1.9.3 : Vulnerability bypass fixed (Thanks to John Jackson & Erwan from the WPScan team)
// v1.9.2 : Vulnerability fixed (Thanks to John Jackson)
// v1.9.1 : Readme Updated and Plugin tested in Wordpress 5.7.0
// v1.9 : Whole new Dialog for adding marmoset viewer files to your posts. 
// v1.8.0 : Updated styling backend and posts + Added new feature: NoUserInterface Option.
// v1.7.3 : Updated help in general settings.
// v1.7.2 : jQuery Lib now used HTTPS instead of HTTP
// v1.7.1 : Minor fix for iOS Devices
// v1.7 : Minor fixes + Redesign settings page and file modal.
// v1.6 : Adds embed system, previous system had serious flaws.
// v1.5 : Removes the iFrame system, adds html to output the viewer.
// v1.4 : Skipped.
// v1.3 : Cleaned up code and added a new feature.
// v1.2 : Changed get_settings to get_option
// v1.1 : Fixed core issues
// v1.0 : First release

	if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
		function registerCustomAdminCss(){
			$src = "/wp-content/plugins/marmoset-viewer/custom/dialog_stylesheet.css";
			$handle = "customAdminCss";
			wp_register_script($handle, $src);
			wp_enqueue_style($handle, $src, array(), false, false);
		}
    add_action('admin_head', 'registerCustomAdminCss');


// Create shortcode for marmoset viewer
// [marmoset id=""]
	function addmarmoset($atts, $content = null) {
		extract(shortcode_atts(array( "id" => '',
									"autostart" => get_option('marmoset-autostart'),
									"transparantbg" => get_option('marmoset-transparantbg'),
									"nui" => get_option('marmoset-nui'),
									"width" => get_option('marmoset-width'),
									"height" => get_option('marmoset-height'),
							  ), $atts)); 

		return '<iframe frameborder="0" height="'.$height.'" width="'.$width.'" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" src="'.plugins_url( '/mviewer.php?width='.$width.'&height='.$height.'&autostart='.$autostart.'&transparantbg='.$transparantbg.'&nui='.$nui.'&id='.$id.'', __FILE__ ) . '"></iframe>';
	}
	add_shortcode('marmoset', 'addmarmoset');
	
// Create marmoset Gutenberg button
function init_constants() {
  define( 'GUTENBERG_BUTTON_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
  define( 'GUTENBERG_BUTTON_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
  define( 'GUTENBERG_BUTTON_VERSION', get_file_data( __FILE__, [ 'Version' ], 'plugin' )[0] );
}//end init_constants()
add_action( 'plugins_loaded', __NAMESPACE__ . '\init_constants', 1 );

function enqueue_script() {
  wp_enqueue_script(
    'gutenberg-button',
    GUTENBERG_BUTTON_URL . '/build/index.js',
    [],
    GUTENBERG_BUTTON_VERSION
  );
}//end enqueue_script()
add_action(
  'enqueue_block_editor_assets',
  __NAMESPACE__ . '\enqueue_script'
);


// Create marmoset TinyMCE button
	function add_marmoset_button() {
		if( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
		  return;

		if( get_user_option('rich_editing') == 'true') {
		  add_filter('mce_external_plugins', 'add_marmoset_tinymce_plugin');
		  add_filter('mce_buttons', 'register_marmoset_button');
		 }
	}
	
	add_action('init', 'add_marmoset_button');
	
	function register_marmoset_button($buttons) {
		array_push($buttons, "|", "marmosetEmbed");
		return $buttons;
	}

	function add_marmoset_tinymce_plugin($plugin_array) {
		$plugin_array['marmosetEmbed'] = plugins_url( '/custom/editor_plugin.js' , __FILE__ );
		return $plugin_array;
	}

// Add file extension 'mview' with mime type 'application/marmoset-web-viewer'
	function custom_mview_mime_type ( $existing_mimes=array() ) {
			$existing_mimes['mview'] = 'application/marmoset-web-viewer';
			return $existing_mimes;
		}
	add_filter('upload_mimes', 'custom_mview_mime_type');

// Create global settings menu button in Wordpress Dashboard
	if ( is_admin() ){ // admin actions
		add_action( 'admin_menu', 'marmoset_create_menu' );
	}

	function marmoset_create_menu() {
    // Add button to menu name + icon
		add_menu_page('marmoset Plugin Settings', 'Marmoset Viewer', 'administrator',
		__FILE__, 'marmoset_settings_page', plugins_url('/img/marmoset-16x16-menu-icon.svg', __FILE__));
  
    // Register settings
		add_action( 'admin_init', 'register_marmoset_settings' );
	}
	// Register marmoset settings
	function register_marmoset_settings() {
		register_setting( 'settings-group', 'marmoset-width' );
		register_setting( 'settings-group', 'marmoset-height' );
		register_setting( 'settings-group', 'marmoset-autostart' );
		register_setting( 'settings-group', 'marmoset-transparantbg' );
		register_setting( 'settings-group', 'marmoset-nui' );
	}

  // Settings page
	function marmoset_settings_page() {
?>
	<style>
		.help-block {
			color: #737373;
			display: block !important;
			margin-bottom: 10px;
			margin-top: 5px;
		}
		.plugin-info {
			border-radius: 4px;
			overflow: hidden;
			position: absolute;
			right: 25px;
			top: 25px;
			width: 300px;
		}		
		.plugin-info .plugin-info-version {
			color: #fff;
			font-size: 16px;
			font-weight: bold;
			position: absolute;
			right: 10px;
			text-transform: uppercase;
			top: 157px;
		}
		.plugin-info figure {
			border-radius: 4px;
			-webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
				    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
			height: 187px;
			margin: 0 0 15px;
			overflow: hidden;
			top: 0;
			width: 100%;
		}
		.plugin-info figure.author-logo {
			height: 299px;
		}	
		.plugin-info figure img {
			width: 100%;
		}
		
		.plugin-info > ul > header {
			font-weight: bold;
			margin-bottom: 10px;
			text-transform: uppercase;
		}
		.plugin-info > ul > li span {
			font-weight: bold;
		}
		.plugin-info > ul > li {
			font-size: 11px;
		}
		.table-mviewer-options {
			background: #fff none repeat scroll 0 0;
			border-radius: 4px !important;
			box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
			display: block;
			width: 95%;
		}
		.table-mviewer-options label {
		  width: 100% !important;
		  display: flex;
		  align-items: center;
		  vertical-align: middle;
		  padding: 25px 15px;
		}
		.table-mviewer-options label p {
		  margin: -2px 0 0 10px;
		}
		.table-mviewer-options td, .table-mviewer-options th {
		  padding: 0;
		}
		.table-mviewer-options td {
		}
		.table-mviewer-options td:hover {
		  background: #EFEFEF;
		}
		.table-mviewer-options tr {
			border-bottom: 1px solid #ddd;
			display: block;
			width: 100%;
		}

		.table-mviewer-options tr th {
			background: #f7f7f7 none repeat scroll 0 0;
			padding-left: 15px;
			vertical-align: middle;
		}
		.table-mviewer-options td .help-block {
			font-size: 12px;
			font-weight: bold;
		}
		.table-mviewer-options tr:last-child {
			border: medium none;
		}
		.table-mviewer-options tbody {
			display: block;
			width: 100% !important;
		}
		.mv-about-wrap {
			margin: 25px 40px 0 20px;
			max-width: 1050px;
			font-size: 15px;
		}
		.mv-about-title {
			margin: .2em 200px 0 0 !important;
			padding: 0 !important;
			color: #32373c;
			line-height: 1.2em !important;
			font-size: 2.8em !important;
			font-weight: 400 !important;
		}
		.mv-about-text {
			margin-top: 1.4em;
			font-weight: 400;
			line-height: 1.6em;
			font-size: 19px;
			max-width: 100%;
		}
	</style>
	<div class="mv-about-wrap">
		<div class="plugin-info">
			<span class="plugin-info-version">version 1.9</span>
			<figure class="plugin-thumb"><a href="https://www.marmoset.co/viewer/" target="blank"><img src="<?php echo plugin_dir_url( __FILE__ ) . 'img/marmoset_viewer_thumb.jpg'; ?>"></a></figure>
			<figure class="author-logo"><a href="https://www.artstation.com/revolutionart" target="blank"><img src="<?php echo plugin_dir_url( __FILE__ ) . 'img/revolutionart_logo.png'; ?>"></a></figure>
		</div>
		<h1 class="mv-about-title">Marmoset Web Viewer</h1>

		<form method="post" action="options.php">
		<?php settings_fields( 'settings-group' ); ?>

		<p class="mv-about-text">The settings below are the global settings. These settings will affect every Marmoset Toolbag Viewer file your site has. <br>You can control each file individually via the post editor.</p>
			<table class="form-table table-mviewer-options">
			  <tr valign="top">
				<th scope="row">Width</th>
				<td>
					<label>
						<input type="text" name="marmoset-width" placeholder="100px" value="<?php echo get_option('marmoset-width'); ?>" />
						<p class="help-block">Use px or % Example:  "100%" or "100px" Without Quotes</p>
					</label>
				</td>
			  </tr>
			  <tr valign="top">
				<th scope="row">Height</th>
				<td>
					<label>
						<input type="text" name="marmoset-height" placeholder="100px" value="<?php echo get_option('marmoset-height'); ?>" />
						<p class="help-block">Use px or % Example:  "100%" or "100px" Without Quotes</p>
					</label>
				</td>
				
			  </tr>
			  <tr valign="top">
				<th scope="row">Autostart</th>
				<td>
					<label>
						<input type="checkbox" name="marmoset-autostart" value="1" <?php checked(get_option('marmoset-autostart'), 1); ?>/>
						<p class="help-block">Check this if you want the viewer to automatically start.</p>
					</label>
				</td>
			  </tr>
			  <tr valign="top">
				<th scope="row">Transparant Background</th>
				<td>
					<label>
						<input type="checkbox" name="marmoset-transparantbg" value="1" <?php checked(get_option('marmoset-transparantbg'), 1); ?>/>
						<p class="help-block">Check this if you want the viewer to have a transparant background.</p>
					</label>
				</td>
			  </tr>
			  <tr valign="top">
				<th scope="row">Disable UserInterface (UI)</th>
				<td>
					<label>
						<input type="checkbox" name="marmoset-nui" value="1" <?php checked(get_option('marmoset-nui'), 1); ?>/>
						<p class="help-block">Check this if you want the user interface to be removed entirely, leaving a bare 3D view with no controls for layer views, help, fullscreen, and so on.</p>
					</label>
				</td>
			  </tr>
			</table>
		<?php submit_button(); ?>
		</form> 
	</div>

<?php } ?>