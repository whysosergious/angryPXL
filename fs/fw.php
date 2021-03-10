<?php

	// filter CORS preflights?
	if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

	// get manager settings
	// TODO separate this
	$settings = json_decode(file_get_contents('../settings.json'));
	$history_cap = $settings->{'history_cap'};
	$app = $settings->{'active_app'};
	

	// recieve json data
	// TODO adapt for separate files ( pages, lazy loaded content, etc )
	$post_data = file_get_contents('php://input');
	$file_name = 'TextContent';
	$file_ext = '.json';
	$full_file_name = $file_name . $file_ext;
	
	// folders .. folders
	$data_folder = "../apps/{$app}/data/";
	$history_folder = "../apps/{$app}/data/history/";

	$history_data = file_exists( "{$data_folder}History{$full_file_name}" ) ? 
		json_decode(file_get_contents( "{$data_folder}History{$full_file_name}" )) : 
		[];

	$history_count = count($history_data);
	$history_entry['time_stamp'] = time();
	$history_entry['human_date'] = date('H:i - j/n/y', $history_entry['time_stamp']);
	$history_entry['file_name'] = $file_name . $history_entry['time_stamp'];
	$history_entry['file_ext'] = $file_ext;

	// this condition is temporary because of CORS preflights
	// if ( $history_entry['time_stamp'] - $history_data[$history_count-1]->{'time_stamp'} >= 2 ) {
		$history_data[] = $history_entry;
		if ( $history_count >= $history_cap ) {
			$oldest_file = "{$history_folder}{$history_data[0]->{'file_name'}}{$history_data[0]->{'file_ext'}}";
			unlink($oldest_file);
			array_splice($history_data, 0, 1);
		}
	// }


	
	
	!is_dir($data_folder) && mkdir($data_folder, 0777);
	!is_dir($history_folder) && mkdir($history_folder, 0777);
	

	// write to file
	function writeFile($folder, $file, $data) {
		$filename = $folder . $file;
		$filetask = fopen($filename, 'w');
		fwrite($filetask, $data);
		fclose($filetask);
	}

	writeFile($data_folder, $full_file_name, $post_data);
	writeFile($history_folder, "{$history_entry['file_name']}{$file_ext}", $post_data);
	writeFile($data_folder, "History{$full_file_name}", json_encode($history_data));




	// 	$filename = 'test/test.txt';
	// $config['upload_path'] = $data_folder;
	// 	if (file_exists($filename)) {
	// 		echo "The file $filename exists ";
	// 		// TODO** rename file to keep as history
	// 	} else {
	// 		// open or create file ( 'w' stands for write, 'a' for append )
	// 		$filetask = fopen($filename, 'w');
	// 		fwrite($filetask, $data);
	// 		fclose($filetask);

	// 		echo "$filename created and saved";
	// 	}
	// $dh = opendir($dir);
	// 	// closedir($dh);
	// }


	// move_uploaded_file($image['tmp_name'],"photos/".$image['name']);



// 		$dir = "/images/";

// // Open a directory, and read its contents
// if (is_dir($dir)){
//   if ($dh = opendir($dir)){
//     while (($file = readdir($dh)) !== false){
//       echo "filename:" . $file . "<br>";
//     }
//
//   }
// }



// rename("images","pictures");
	}
?>