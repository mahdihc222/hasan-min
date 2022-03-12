<!DOCTYPE html>
<html>
<head>
    <title>Marmoset Viewer</title>
	<script type="text/javascript" src="//viewer.marmoset.co/main/marmoset.js"></script>
</head>
<body>
	<?php
		$autostart = 0; // Default autostart set to false
		if (isset($_GET['autostart'])) {
			$autostart = $_GET['autostart'];
			if ($autostart != '1' && $autostart != '0') {
				$autostart = 0;
			}
		}

		$transparantbg = 0; // Default transparantbg set to false
		if (isset($_GET['transparantbg'])) {
			$transparantbg = $_GET['transparantbg'];
			if ($transparantbg != '1' && $transparantbg != '0') {
				$transparantbg = 0;
			}
		}
		
		$nui = 0; // Default noUI set to false
		if (isset($_GET['nui'])) {
			$nui = $_GET['nui'];
			if ($nui != '1' && $nui != '0') {
				$nui = 0;
			}
		}

		$width = 300; // Defaut width set to 300
		if (isset($_GET['width'])) {
			$width = $_GET['width'];
			$width = ctype_digit($width) == true ? $width : 300;
		}

		$height = 300; // Defaut height set to 300
		if (isset($_GET['height'])) {
			$height = $_GET['height'];
			$height = ctype_digit($height) == true ? $height : 300;
		}
		
		$url = "";
			if (isset($_GET['id']) && filter_var($_GET['id'], FILTER_SANITIZE_URL)) {
				$url = ($_GET['id']);
			}
			if ($url != null) {
				$url = explode('/',$url,3);
				if (isset($url[2])) {
					$url = $url[2];
				}
			}
	?>

    <script>
		marmoset.transparentBackground = <?= $transparantbg ?>;
		marmoset.noUserInterface = <?= $nui ?>;
        marmoset.embed( '/<?= htmlentities($url, ENT_QUOTES) ?>', 
		
			{ 
			width: <?= $width ?>,
			height: <?= $height ?>,
			autoStart: <?= $autostart ?>,
			pagePreset: false,
			fullFrame: true,
			});
    </script>
	<?php die("Nothing to see here!"); ?>
</body>
</html>