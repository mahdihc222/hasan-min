(function() {

	tinymce.create('tinymce.plugins.marmosetEmbedPlugin', {

	/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
	 */

		init : function(ed, url) {
			
		
			ed.addButton('marmosetEmbed', {
				title: 'Insert Marmoset Toolbag2 mview file',
				image: url+'/marmoset-24x24-mce.svg',
				 href: url + '/css/fontawesome.css',
				onclick: function() {
					
					ed.windowManager.open ({
					  
						title:'Add Marmoset Viewer', 
						file: url + '/mv_modal.html',
						classes: 'mviewer-modal',

						width: 750,
						height: 330,
						inline: 1,
					
					
					}, {
						plugin_url : url,
						wp: wp
					});
					function image() {
									
						var image = document.createElement("IMG");
						image.alt = "Marmoset Logo"
						image.setAttribute('class', 'photo');
						image.src= url+'/marmoset-24x24-mce.svg';
						image.style="height: 720px; position: absolute; top: -350px; width: 100%; z-index: 999;"
						jQuery('#mce-modal-block').html(image);
						
					}
					image();
				}
			});


		},
	
		createControl: function(n, cm) {
			return null;
		},
		
		getInfo: function() {
			return {
				longname: 'marmoset viewer shortcode',
				author: 'Marmoset',
				authorurl: 'http://revolutionart.nl',
				infourl: 'http://www.marmoset.co/',
				version: '1.9'
			};
		},
	
	});
	// Register plugin
	tinymce.PluginManager.add('marmosetEmbed', tinymce.plugins.marmosetEmbedPlugin);
 })();


