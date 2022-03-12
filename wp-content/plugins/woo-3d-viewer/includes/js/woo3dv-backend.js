/**
 * @author Sergey Burkov, http://www.wp3dprinting.com
 * @copyright 2017
 */

jQuery(document).ready(function() {
	if (jQuery( "#woo3dv_tabs" ).length) {
		jQuery( "#woo3dv_tabs" ).tabs();
	}
	jQuery( ".woo3dv-color-picker" ).wpColorPicker({

		change : function(event, ui) {
			if (typeof(woo3dv)!='undefined') {
				if (jQuery(event.target).hasClass('woo3dv-background')) {
					woo3dvChangeBackgroundColor(ui.color.toString());
				}
				else if (jQuery(event.target).hasClass('woo3dv-fog')) {
					woo3dvChangeFogColor(ui.color.toString());
				}
				else if (jQuery(event.target).hasClass('woo3dv-grid')) {
					woo3dvChangeGridColor(ui.color.toString());
				}
				else if (jQuery(event.target).hasClass('woo3dv-ground')) {
					woo3dvChangeGroundColor(ui.color.toString());
				}
				else {
					woo3dvChangeModelColor(ui.color.toString());
				}
			}
		},
		clear : function(event, ui) {
			if (typeof(woo3dv)!='undefined') {
				if (jQuery(event.target).hasClass('woo3dv-background')) {
					woo3dvChangeBackGroundColor('#ffffff');
				}
				else if (jQuery(event.target).hasClass('woo3dv-fog')) {
					woo3dvChangeFogColor('#ffffff');
				}
				else if (jQuery(event.target).hasClass('woo3dv-grid')) {
					woo3dvChangeGridColor('#ffffff');
				}
				else if (jQuery(event.target).hasClass('woo3dv-ground')) {
					woo3dvChangeGroundColor('#ffffff');
				}
				else {
					woo3dvChangeModelColor('#ffffff');
				}
			}
		}

	});

jQuery(".woo3dv-noenter").on('keyup', function (e) {
    if (e.keyCode == 13) {
	e.preventDefault();
        return false;
    }
});

});


/**
 * Callback function for the 'click' event of the 'Set Footer Image'
 * anchor in its meta box.
 *
 * Displays the media uploader for selecting an image.
 *
 * @since 0.1.0
 */
function renderMediaUploader() {
    'use strict';
 
    var file_frame, image_data;
 
    /**
     * If an instance of file_frame already exists, then we can open it
     * rather than creating a new instance.
     */
    if ( undefined !== file_frame ) {
 
        file_frame.open();
        return;
 
    }
 
    /**
     * If we're this far, then an instance does not exist, so we need to
     * create our own.
     *
     * Here, use the wp.media library to define the settings of the Media
     * Uploader. We're opting to use the 'post' frame which is a template
     * defined in WordPress core and are initializing the file frame
     * with the 'insert' state.
     *
     * We're also not allowing the user to select more than one image.
     */
    file_frame = wp.media.frames.file_frame = wp.media({
        frame:    'post',
        state:    'insert',
        multiple: false
    });
 
    /**
     * Setup an event handler for what to do when an image has been
     * selected.
     *
     * Since we're using the 'view' state when initializing
     * the file_frame, we need to make sure that the handler is attached
     * to the insert event.
     */
    file_frame.on( 'insert', function() {

	var json = file_frame.state().get( 'selection' ).first().toJSON();

//	if( /[^a-zA-Z0-9\-]/.test( json.title ) ) {
//		alert('File name must not be  (a-z,0-9,-)');
//		return false;
//	}
//	console.log(json);
	if (jQuery('#woo3dv_shortcode').length>0) {
		woo3dv.model_url = json.url;
		woo3dv.model_mtl = '';
		woo3dv.model_color = woo3dv.model_default_color;
		woo3dv.model_transparency = woo3dv.model_default_transparency;
		woo3dv.model_shininess = woo3dv.model_default_shininess;
		woo3dv.upload_url = jQuery('#woo3dv_upload_url').val();
		woo3dv.stored_position_x = 0;
		woo3dv.stored_position_y = 0;
		woo3dv.stored_position_z = 0;
		woo3dv.stored_lookat_x = 0;
		woo3dv.stored_lookat_y = 0;
		woo3dv.stored_lookat_z = 0;
		woo3dv.stored_controls_target_x = 0;
		woo3dv.stored_controls_target_y = 0;
		woo3dv.stored_controls_target_z = 0;
		woo3dv.offset_z = 0;

		window.woo3dv_canvas = document.getElementById('woo3dv-cv');
		woo3dvDisplayUserDefinedProgressBar(true);
		woo3dvCanvasDetails();
		var logoTimerID = 0;
		woo3dv.targetRotation = 0;
		var model_type=woo3dv.model_url.split('.').pop().toLowerCase();
		jQuery('#woo3dv-viewer').show();
		if (model_type=='zip') {
			jQuery.ajax({
				url:    ajaxurl,
				method: "POST",
				data:    {action : "woo3dv_handle_zip", post_id : json.id, nonce: woo3dv.upload_file_nonce},
				success: function(result) {
						var response = jQuery.parseJSON(result);
						if (response.status=='1') {
							woo3dv.model_url = response.model_url;
							woo3dv.model_mtl = response.material_url;
							model_type = response.model_file.split('.').pop();
						}
						else {
							woo3dv.model_url=false;
							alert(woo3dv.text_model_not_found);
							return;
						}
					},
				async:   false
			});
		}
		if (woo3dv.model_url) {
			jQuery('#woo3dv-details').show();
			woo3dvViewerInit(woo3dv.model_url, woo3dv.model_mtl, model_type, false);
			woo3dvAnimate();
			jQuery( 'button.media-modal-close' ).click();
		}
	}
	jQuery( '#product_model' ).val( json.url );
	jQuery( '#product_attachment_id' ).val( json.id );
	jQuery( 'button.media-modal-close' ).click();
	jQuery( '#woo3dv_save_block' ).show();
	woo3dv_remove_params();


/*
	$( '#footer-thumbnail-src' ).val( json.url );
	$( '#footer-thumbnail-title' ).val( json.title );
	$( '#footer-thumbnail-alt' ).val( json.title );
*/

    });
 
    // Now display the actual file_frame
    file_frame.open();
 
}

function renderThumbUploader() {
    'use strict';
 
	var file_frame, image_data;
	if ( undefined !== file_frame ) {
		file_frame.open();
		return;
	}

	file_frame = wp.media.frames.file_frame = wp.media({
		frame:    'post',
		state:    'insert',
		library: {
			type: 'image',
		},
		multiple: false
	});
 
	file_frame.on( 'insert', function() {
		var json = file_frame.state().get( 'selection' ).first().toJSON();
		var url = json.url.replace('http://', '//');
		url = url.replace('https://', '//');
		jQuery('#woo3dv_thumbnail').val(url);
		jQuery( 'button.media-modal-close' ).click();
	})

	file_frame.open();
 
}
 
(function( $ ) {
    'use strict';
 
    $(function() {
        $( '#set-model' ).on( 'click', function( evt ) {
 
            // Stop the anchor's default behavior
            evt.stopImmediatePropagation();
            evt.preventDefault();
            if (jQuery('#woo3dv_reload_url').length && typeof(woo3dv)=='object' && woo3dv.object) {
             if (document.location.href==jQuery('#woo3dv_reload_url').val()) {
              location.reload();
             }
             else {
              document.location.href=jQuery('#woo3dv_reload_url').val();
             }
            }
            else {
             // Display the media uploader
             renderMediaUploader();
           }
 
        });
        $( '#set-thumbnail' ).on( 'click', function( evt ) {
 
            // Stop the anchor's default behavior
            evt.stopImmediatePropagation();
            evt.preventDefault();
            renderThumbUploader();
        });
 
    });
 
})( jQuery );

function woo3dv_remove_params() {
		jQuery('#woo3dv_display_mode').val('3d_model');
		jQuery('#woo3dv_display_mode_model').val('3d_model');
		jQuery('#woo3dv_product_model_extracted_path').val('');
		jQuery('#woo3dv_rotation_x').val('');
		jQuery('#woo3dv_rotation_y').val('');
		jQuery('#woo3dv_rotation_z').val('');
		jQuery('#product_offset_z').val('');
		woo3dv_remove_camera_params();

}

function woo3dv_remove_camera_params() {
		jQuery('input[name=product_remember_camera_position]').val('0');
		jQuery('#product_camera_position_x').val('');
		jQuery('#product_camera_position_y').val('');
		jQuery('#product_camera_position_z').val('');
		jQuery('#product_camera_lookat_x').val('');
		jQuery('#product_camera_lookat_y').val('');
		jQuery('#product_camera_lookat_z').val('');
		jQuery('#product_controls_target_x').val('');
		jQuery('#product_controls_target_y').val('');
		jQuery('#product_controls_target_z').val('');
}

function woo3dv_remove_model() {
	jQuery('#product_model').val('')
	jQuery('#product_model_name').html('')
	jQuery('#woo3dv-cv').hide()
}



function woo3dvChangeDisplayMode(mode, mobile) {
	if (mode!='png_image') {
		jQuery('#png_block').hide();
		jQuery('#product_image_data').val('');
	}
	else {
		jQuery('#png_block').show();
		jQuery('#woo3dv-canvas-instructions').show();
	}

	if (mode!='gif_image') {
		jQuery('#gif_block').hide();
		jQuery('#product_gif_data').val('');
	}
	else {
		jQuery('#woo3dv-canvas-instructions').show();
		jQuery('#gif_block').show();
	}

	if (mode!='webm_video') {
		jQuery('#webm_block').hide();
		jQuery('#product_webm_data').val('');
	}
	else {
		jQuery('#webm_block').show();
		jQuery('#woo3dv-canvas-instructions').show();
	}
	if (mode=='3d_model') {
		jQuery('#woo3dv-canvas-instructions').hide();
	}
	if (mobile)
		jQuery('#woo3dv_display_mode_mobile').val(mode);
	else 
		jQuery('#woo3dv_display_mode').val(mode);
}

function woo3dvCheckPostSize() {
	var post_max_size = parseInt(woo3dv.post_max_size) * 1048576; //bytes
	var post_size = jQuery('#product_image_data').val().length + jQuery('#product_gif_data').val().length + jQuery('#product_webm_data').val().length;
	if (post_size > post_max_size) {
		alert(woo3dv.text_post_max_size);
		return false;
	}
	return true;


}

/**
 * Callback function for the 'click' event of the 'Set Footer Image'
 * anchor in its meta box.
 *
 * Displays the media uploader for selecting an image.
 *
 * @since 0.1.0
 */
function woo3dvRenderMediaUploader(variation_id) {
    'use strict';
 
    var file_frame, image_data;
 
    /**
     * If an instance of file_frame already exists, then we can open it
     * rather than creating a new instance.
     */
    if ( undefined !== file_frame ) {
 
        file_frame.open();
        return;
 
    }
 
    /**
     * If we're this far, then an instance does not exist, so we need to
     * create our own.
     *
     * Here, use the wp.media library to define the settings of the Media
     * Uploader. We're opting to use the 'post' frame which is a template
     * defined in WordPress core and are initializing the file frame
     * with the 'insert' state.
     *
     * We're also not allowing the user to select more than one image.
     */
    file_frame = wp.media.frames.file_frame = wp.media({
        frame:    'post',
        state:    'insert',
        multiple: false
    });
 
    /**
     * Setup an event handler for what to do when an image has been
     * selected.
     *
     * Since we're using the 'view' state when initializing
     * the file_frame, we need to make sure that the handler is attached
     * to the insert event.
     */
    file_frame.on( 'insert', function() {

	var json = file_frame.state().get( 'selection' ).first().toJSON();

//	if( /[^a-zA-Z0-9\-]/.test( json.title ) ) {
//		alert('File name must not be  (a-z,0-9,-)');
//		return false;
//	}
	console.log(json.url);
	jQuery( '#woo3dv_variation_file_url_'+variation_id ).val( json.url );
	jQuery( '#woo3dv_variation_attachment_id_'+variation_id ).val( json.id );
	jQuery( 'button.media-modal-close' ).click();


/*
	$( '#footer-thumbnail-src' ).val( json.url );
	$( '#footer-thumbnail-title' ).val( json.title );
	$( '#footer-thumbnail-alt' ).val( json.title );
*/

    });
 
    // Now display the actual file_frame
    file_frame.open();
 
}

function woo3dvSetModel(evt, variation_id) {
            // Stop the anchor's default behavior
            evt.preventDefault();
 
            // Display the media uploader
            woo3dvRenderMediaUploader(variation_id);
}




function woo3dvGenerateShortcode() {
	if (typeof(woo3dv.object)=='undefined') {
		alert(woo3dv.text_upload_model);
		return false;
	}
	var model_url = woo3dv.model_url.replace('http:','').replace('https:',''); //avoid mixed content issues
	var mtl_url = woo3dv.model_mtl.replace('http:','').replace('https:',''); //avoid mixed content issues
	var display_mode = jQuery('#woo3dv-display-mode').val();
	var display_mode_mobile = jQuery('#woo3dv-display-mode-mobile').val();
	var model_color = jQuery('#woo3dv-model-color').val();
	var background_color = jQuery('#woo3dv-background-color').val();
	var background_transparency = jQuery('#woo3dv-background-transparency').prop('checked');
	var model_shininess = jQuery('#woo3dv-model-shininess').val();
	var grid_color = jQuery('#woo3dv-grid-color').val();
	var show_grid = jQuery('#woo3dv-show-grid').prop('checked');
	var model_transparency = jQuery('#woo3dv-model-transparency').val();
	var ground_color = jQuery('#woo3dv-ground-color').val();
	var show_ground = jQuery('#woo3dv-show-ground').prop('checked');
	var light_source1 = jQuery('#woo3dv-show-light-source1').prop('checked');
	var light_source2 = jQuery('#woo3dv-show-light-source2').prop('checked');
	var light_source3 = jQuery('#woo3dv-show-light-source3').prop('checked');
	var light_source4 = jQuery('#woo3dv-show-light-source4').prop('checked');
	var light_source5 = jQuery('#woo3dv-show-light-source5').prop('checked');
	var light_source6 = jQuery('#woo3dv-show-light-source6').prop('checked');
	var light_source7 = jQuery('#woo3dv-show-light-source7').prop('checked');
	var light_source8 = jQuery('#woo3dv-show-light-source8').prop('checked');
	var light_source9 = jQuery('#woo3dv-show-light-source9').prop('checked');
	var show_shadow = jQuery('#woo3dv-show-shadow').prop('checked');
	var show_mirror = jQuery('#woo3dv-show-mirror').prop('checked');
	var auto_rotation = jQuery('#woo3dv-auto-rotation').prop('checked');
	var remember_camera_position = jQuery('#woo3dv-remember-camera-position').prop('checked');
	var show_controls = jQuery('#woo3dv-show-controls').prop('checked');
	var rotation_x = jQuery('#rotation_x').val();
	var rotation_y = jQuery('#rotation_y').val();
	var rotation_z = jQuery('#rotation_z').val();
	var z_offset = jQuery('#z_offset').val();
	var canvas_width = jQuery('#woo3dv-canvas-width').val();
	var canvas_height = jQuery('#woo3dv-canvas-height').val();
	var canvas_border = jQuery('#woo3dv-canvas-border').prop('checked');

	if (display_mode == 'webm_video' || display_mode_mobile == 'webm_video') {
		var rendered_file_url = woo3dv.upload_dir.replace('http:','').replace('https:','') + woo3dv.uniqid + '.webm'
	}
	else if (display_mode == 'gif_image' || display_mode_mobile == 'webm_video') {
		var rendered_file_url = woo3dv.upload_dir.replace('http:','').replace('https:','') + woo3dv.uniqid + '.gif'
	}
	else {
		var rendered_file_url = '';
	}
	var thumbnail_url = jQuery('#woo3dv_thumbnail').val();
	var shortcode = '[woo3dviewer';

//	if (model_url.length>0) {
	shortcode += ' model_url="'+model_url+'"';
	shortcode += ' material_url="'+mtl_url+'"';
	shortcode += ' thumbnail_url="'+thumbnail_url+'"';
	shortcode += ' canvas_width="'+canvas_width+'"';
	shortcode += ' canvas_height="'+canvas_height+'"';
	shortcode += ' canvas_border="'+canvas_border+'"';
	shortcode += ' display_mode="'+display_mode+'"';
	shortcode += ' display_mode_mobile="'+display_mode_mobile+'"';
	shortcode += ' rendered_file_url="'+rendered_file_url+'"';
	shortcode += ' model_color="'+model_color+'"';
	shortcode += ' background_color="'+background_color+'"';
	shortcode += ' background_transparency="'+background_transparency+'"';
	shortcode += ' model_transparency="'+model_transparency+'"';
	shortcode += ' model_shininess="'+model_shininess+'"';
	shortcode += ' show_grid="'+show_grid.toString()+'"';
	shortcode += ' grid_color="'+grid_color+'"';
	shortcode += ' show_ground="'+show_ground.toString()+'"';
	shortcode += ' ground_color="'+ground_color+'"';
	shortcode += ' show_shadow="'+show_shadow.toString()+'"';
	shortcode += ' show_mirror="'+show_mirror.toString()+'"';
	shortcode += ' auto_rotation="'+auto_rotation.toString()+'"';
	shortcode += ' rotation_x="'+rotation_x+'"';
	shortcode += ' rotation_y="'+rotation_y+'"';
	shortcode += ' rotation_z="'+rotation_z+'"';
	shortcode += ' offset_z="'+z_offset+'"';
	shortcode += ' light_source1="'+light_source1.toString()+'"';
	shortcode += ' light_source2="'+light_source2.toString()+'"';
	shortcode += ' light_source3="'+light_source3.toString()+'"';
	shortcode += ' light_source4="'+light_source4.toString()+'"';
	shortcode += ' light_source5="'+light_source5.toString()+'"';
	shortcode += ' light_source6="'+light_source6.toString()+'"';
	shortcode += ' light_source7="'+light_source7.toString()+'"';
	shortcode += ' light_source8="'+light_source8.toString()+'"';
	shortcode += ' light_source9="'+light_source9.toString()+'"';
	shortcode += ' remember_camera_position="'+remember_camera_position.toString()+'"';
	shortcode += ' show_controls="'+show_controls.toString()+'"';
	if (remember_camera_position) {
		var vec = woo3dv.camera.getWorldDirection( woo3dv.vec );

		shortcode += ' camera_position_x="'+woo3dv.camera.position.x+'"';
		shortcode += ' camera_position_y="'+woo3dv.camera.position.y+'"';
		shortcode += ' camera_position_z="'+woo3dv.camera.position.z+'"';

		shortcode += ' camera_lookat_x="'+vec.x+'"';
		shortcode += ' camera_lookat_y="'+vec.y+'"';
		shortcode += ' camera_lookat_z="'+vec.z+'"';

		shortcode += ' controls_target_x="'+woo3dv.controls.target.x+'"';
		shortcode += ' controls_target_y="'+woo3dv.controls.target.y+'"';
		shortcode += ' controls_target_z="'+woo3dv.controls.target.z+'"';
	}

	shortcode += ']';

	jQuery('#woo3dv_shortcode').val(shortcode);
//	}
//	else {
//		alert(woo3dv.text_upload_model);
//	}
}

function woo3dvToggleBorder() {
	if (jQuery('#woo3dv-cv').hasClass('woo3dv-canvas-border')) {
		jQuery('#woo3dv-cv').removeClass('woo3dv-canvas-border');
	}
	else {
		jQuery('#woo3dv-cv').addClass('woo3dv-canvas-border');
	}
}