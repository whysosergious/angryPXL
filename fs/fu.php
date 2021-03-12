<?php

	// filter CORS preflights?
	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

		// get manager settings
		// TODO separate this
		$settings = json_decode(file_get_contents('../settings.json'));
		$app = $settings->{'active_app'};
		// $response = [];
		
		// recieve json
		// TODO adapt for separate files ( pages, lazy loaded content, etc )
		$post_data = json_decode(file_get_contents('php://input'));
		
		// dir
		$app_root = '../apps/';
		$data_folder = "{$app_root}{$app}/data/";
		$gallery_dir = "{$app}/data/gallery/";	
		!is_dir($data_folder) && mkdir($data_folder, 0777);
		!is_dir("{$app_root}{$gallery_dir}") && mkdir("{$app_root}{$gallery_dir}", 0777);

		function uploadFiles($data, $album) {
			$file = explode( ',', $data->{'url'} );
			$file_name = $data->{'file_name'};
			$file_ext = $data->{'file_ext'};
			$full_file_name = $file_name . $file_ext;

			$data->{'url'} = "{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}";
			!is_dir("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}") && mkdir("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}", 0777);
			$decoded = base64_decode($file[1]);
			file_put_contents("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}", $decoded);
		}

		// write json to file
		function writeFile($folder, $file, $data) {
			$file_path = $folder . $file;
			if ( file_exists($folder . $file) ) {
				$existing_data = json_decode(file_get_contents($file_path));
				if ( !is_null($existing_data) ) {
					array_push($data->{'featured'}, ...$existing_data->{'featured'});
				}
			}
			 
			
			$fs_task = fopen($file_path, 'w');
			fwrite($fs_task, json_encode($data));
			fclose($fs_task);
		}
		
		function staticEntryLoop($data_array, $pa='nomad') {
			
			
			function loop($data, $pa='nomad') {
				$album = $data[0]->{'album'} ?? $pa;
				foreach ($data as $entry) {
					uploadFiles($entry, $album);
					isset($entry->{'album'}) && loop($entry->{'sizes'}, $album);
					
					// if ( isset($entry->{'album'}) && file_exists("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}/{$entry->{'file_name'}}{$entry->{'file_ext'}}")) {
					// 	$GLOBALS['response'][] = $entry;
					// } else if ( isset($entry->{'album'}) ) {
					// 	uploadFiles($entry, $album);
					// 	staticEntryLoop($entry->{'sizes'}, $album);
					// } else {
					// 	uploadFiles($entry, $album);
					// }
				}
			}
			loop($data_array);
			
			writeFile($GLOBALS['data_folder'], 'GalleryMedia.json', $GLOBALS['post_data']);
		}
		
		staticEntryLoop($post_data->{'featured'});
		

		// if ( count($response) > 0 ) { echo json_encode($response); }

		// if ( file_exists($gallery_folder . $file_name) ) {
		// 	echo "$file_name already exists ";
		// } else {
		// 	move_uploaded_file($_FILES['file']['tmp_name'], $gallery_folder . $file_name);
		// 	echo "$file_name saved to $gallery_album";
		// }
		
	}
?>