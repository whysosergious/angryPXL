<?php

  /**
   * We supply a list of targeted components and copy them to a separate directory for processing. =D
   */

  // ZCM directory
  $zcm_dir = 'ZergskiManager';
  $app_path = '../apps/datacollector/src/';
  $copy_path = '../apps/datacollector/';

  $data = json_decode(file_get_contents('php://input'));  // object with file queue

  $ground_zero_path = $data->{'catArray'}[0]->{'path'};   // path of init file
  $ground_zero_file = $data->{'catArray'}[0]->{'file'};   // name of init file
  $file_list = $data->{'catArray'};   // decoupling data array
  $list_length = count( $file_list );   // total items in queue
  
  // $ground_zero_file != 'index' && print_r($data);
  
  $log[] = "Started processing files with  =>  '$ground_zero_file'";

  // create ZCM directory if none exists
  if(!is_dir("{$copy_path}$zcm_dir")) {

		$dir = mkdir("{$copy_path}$zcm_dir", 0777);
	}
  
  // tracking file queue
  $current_file = $ground_zero_file;
  $current_path =   $ground_zero_path === 'root' ? '' : "{$ground_zero_path}/" ;
  $extension = ".js";
  $count = 0;


  // main copycat function
  function _cat( $file, $path, $dir, $count, $file_list, $list_length ) {
    // print_r($file);
    global $log;
    // ++$count;
    $prep_count = ++$count . "/" . $list_length . " || " ;  // iterate and display progress
    
    // create path directory for current file
    if ( $path != '' && !is_dir("{$GLOBALS['copy_path']}" . $dir . "/" . $path) ) {
      mkdir( "{$GLOBALS['copy_path']}" . $dir . "/" . $path, 0777, true );
    }


    $full_path = "";
    if ( file_exists( "{$GLOBALS['app_path']}$path" . $file . ".js" )) {
      $extension = ".js";
      $full_path = $path . $file . ".js";
    } else {
      $extension = ".jsx";
      $full_path = $path . $file . ".jsx";
    }
    // try {
    // extension description : z-pre-proccessed

    if ( !file_exists("{$GLOBALS['copy_path']}$dir/$full_path" . ".zprep") ) {
      if ( copy( "{$GLOBALS['app_path']}" . $full_path, "{$GLOBALS['copy_path']}$dir/$full_path" . ".zprep") ) {

        $log[] = $prep_count . "Cat copied '$file' to |[ 'src/$dir/$path' ]|.";  // task msg
  
        _prepComponent( $count, $file, $file_list[$count-1]->{'path'}, file_get_contents("{$GLOBALS['copy_path']}$dir/$full_path" . ".zprep") );
        
      } else { 
  
        // else =)
        $log[] = "**!!  Cat failed to copy '$file', check file path and name. If one already exists in 'src/$dir/$path' it needs be rewriteble  !!**.";
      }
      
    } else {
      $log[] = $prep_count . "Cat found '$file' in |[ 'src/$dir/$path' ]| and didn't copy file.";  // task msg
      _prepComponent( $count, $file, $file_list[$count-1]->{'path'}, file_get_contents("{$GLOBALS['copy_path']}$dir/$full_path" . ".zprep") );
    }
    // check if last
    if ( $count < $list_length ) {
      // next path and file
      $path = $file_list[$count]->{'path'} === 'root' ? '' :  $file_list[$count]->{'path'} . "/";
      $file = $file_list[$count]->{'file'};
      _cat( $file, $path, $dir, $count, $file_list, $list_length );   // next
    } else {

      $log[] = "**** Cat done! ^-^ ****";   // copycat finished msg
      _respond();
    }
  }

  _cat( $current_file, $current_path, $zcm_dir, $count, $file_list, $list_length ); // init run

  $response = array();



  function _prepComponent( $count, $file, $path, $code ) {
    global $response, $extension;

    $response[ ] = (object) [ "data" => [
      "name" => $file, 
      "path" => $path, 
      "rawComponent" => $code,
      "queue" => $count,
      "ext" => $extension ]
    ];
  }

  function _respond() {
    global $response, $log;

    echo json_encode([ "log" => $log, "content" => $response ]);
    $data = "";
  }
?>