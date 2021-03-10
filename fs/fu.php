<?php

	// filter CORS preflights?
	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

		// get manager settings
		// TODO separate this
		$settings = json_decode(file_get_contents('../settings.json'));
		$app = $settings->{'active_app'};
		

		// recieve json
		// TODO adapt for separate files ( pages, lazy loaded content, etc )
		$post_data = file_get_contents('php://input');
		$file_name = $_FILES['file']['name'];
		$file_ext = '.jpeg';
		
		// folders .. folders
		$gallery_album = "featured";
		$gallery_folder = "../apps/{$app}/data/gallery/{$gallery_album}/";

		!is_dir($gallery_folder) && mkdir($gallery_folder, 0777);

		print_r($_FILES);

		if ( file_exists($gallery_folder . $file_name) ) {
			echo "$file_name already exists ";
		} else {
			move_uploaded_file($_FILES['file']['tmp_name'], $gallery_folder . $file_name);
			echo "$file_name saved to $gallery_album";
		}
		
	}
?>