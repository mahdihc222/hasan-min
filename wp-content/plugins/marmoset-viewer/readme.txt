=== Marmoset Viewer ===
Contributors: Revolutionart
Tags: marmoset,viewer,3d,design
Requires at least: 3.5.0
Tested up to: 5.7.2
Stable tag: 1.9.3
License: GPLv3
License URI: http://www.gnu.org/licenses/lgpl-3.0.html

Marmoset Toolbag Web Viewer

== Description ==
### Description
Allows you to embed Marmoset Toolbag mview files, allowing people to view your models in all their glory

Marmoset pushed the boundaries to deliver cutting edge 3D rendering to the web and mobile devices. Bring your Marmoset Toolbag scenes to life in interactive 3D for all to see!

Physically accurate rendering coupled with image-based lighting and advanced shaders delivers a 3D web experience second to none. Marmoset Viewer faithfully reproduces Toolbag's famous look and features for top notch render quality.

Marmoset Viewer Plugin works with Toolbag 2, Toolbag 3 and Toolbag 4.

More Info: http://www.marmoset.co/viewer

### Marmoset shortcode options: Autostart & Disable UI
You can autostart the viewer by using the following shortcode: 
    
    [marmoset id="fullurlwpcontentyourscene.mview" autoStart="1" nui="0"]

	Change the setting from 0 (off) to 1 (on)

### Marmoset Settings
The values in the settings page are the default values. If you want the viewer to be fullscreen use 100% (% required after number) 
if you want a custom size use for example: 900px by 600px

You can also enable a transparant background.

== Installation ==
### Installation
1. Upload the `marmoset-viewer` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the \'Plugins\' menu in WordPress
3. Use the new button in the wordpress post editor to add your mview scene.
4. You can change the width/height in the Marmoset viewer settings page.
5. You can also use a php shortcode [marmoset id=""]

IMPORTANT: When you export your scene from Marmoset Toolbag 2/3 or 4 make sure it has the .mview file extension, else you won't be able to upload the file. Example: yourscenename.mview

== Screenshots ==

1. A new button appears in the editor toolbar.
2. Upload/Add your .mview file
3. Use the settings to change the appearance
4. 
5. 

== 403 BPS ==

If you use bulletproof security pro (BPS Plugin) and you encounter a 403 Forbidden Error Page then please follow the following solution:

Thanks to Rafael De Jongh.

Source: http://forum.ait-pro.com/forums/topic/marmoset-viewer-403-error/ 

== Changelog ==
= 1.9.3 =

* Vulnerability bypass fixed (Thanks to John Jackson & Erwan from the WPScan team)

= 1.9.2 =

* Vulnerability fixed (Thanks to John Jackson)

= 1.9.1 =

* Readme Updated and Plugin tested in Wordpress 5.7.0

= 1.9 =

* Whole new Dialog for adding marmoset viewer files to your posts. 

= 1.8.0 =

* Updated styling backend and posts + Added new feature: NoUserInterface Option.

= 1.7.3 =

* Updated help in general settings.

= 1.7.2 =

* jQuery Lib now used HTTPS instead of HTTP.

= 1.7.1 =

* Minor fix for iOS Devices.

= 1.7 =

* Minor fixes + Redesign settings page and file modal.

= 1.6 =

* Adds embed system, previous system had serious flaws.

= 1.5 =

* Removes the iFrame system, adds html to output the viewer.

= 1.4 =

* Fixed an issue

= 1.3 =

* Cleaned up code and added a new feature

= 1.2 =

* Changed get_settings to get_option

= 1.1 =

* Fixed core issues

= 1.0 =

* First release.
