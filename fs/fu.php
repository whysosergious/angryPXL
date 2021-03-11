<?php

	// filter CORS preflights?
	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

		// get manager settings
		// TODO separate this
		$settings = json_decode(file_get_contents('../settings.json'));
		$app = $settings->{'active_app'};
		
		

		// recieve json
		// TODO adapt for separate files ( pages, lazy loaded content, etc )
		$post_data = json_decode(file_get_contents('php://input'));
		$file_name = $post_data[0]->{'file_name'};
		$file_ext = $post_data[0]->{'file_ext'};
		$full_file_name = $file_name . $file_ext;

		// folders .. folders
		$gallery_album = "featured";
		$gallery_folder = "../apps/{$app}/data/gallery/{$gallery_album}/";

		!is_dir($gallery_folder) && mkdir($gallery_folder, 0777);
		$file = explode( ',', $post_data[0]->{'url'} );
		$post_data[0]->{'url'} = $gallery_folder . 'aaa.jpeg';


		print_r($post_data);
		// print_r(json_encode($post_data));
		$decoded=base64_decode($file[1]);
		file_put_contents("{$gallery_folder}{$full_file_name}",$decoded);

		
		// if ( file_exists($gallery_folder . $file_name) ) {
		// 	echo "$file_name already exists ";
		// } else {
		// 	move_uploaded_file($_FILES['file']['tmp_name'], $gallery_folder . $file_name);
		// 	echo "$file_name saved to $gallery_album";
		// }
		
	}
?>