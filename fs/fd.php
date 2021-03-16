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

		function deleteFiles($data, $album) {
			$file_name = $data->{'file_name'};
			$file_ext = $data->{'file_ext'};
			$full_file_name = $file_name . $file_ext;

			unlink("{$GLOBALS['app_root']}{$GLOBALS['gallery_dir']}{$album}/{$full_file_name}");
		}

		// write json to file
		function writeFile($folder, $file, $data) {
			$file_path = $folder . $file;			 
			
			$fs_task = fopen($file_path, 'w');
			fwrite($fs_task, json_encode($data));
			fclose($fs_task);
		}
		
		function staticEntryLoop($data_array, $pa='nomad') {
			
			
			function loop($data, $pa='nomad') {
				$album = $data[0]->{'album'} ?? $pa;
				foreach ($data as $entry) {
					deleteFiles($entry, $album);
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
			
			writeFile($GLOBALS['data_folder'], 'GalleryMedia.json', $GLOBALS['post_data']->{'new'});
		}
		
		staticEntryLoop($post_data->{'delete'});
	}
?>