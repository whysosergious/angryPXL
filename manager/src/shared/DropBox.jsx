import React, { useRef, useEffect, useState } from 'react';
import './DropBox.css';

// logic
import { uploadFiles } from 'logic/zcm';

// icons
import imageIcon from 'ass/vector/icons/files/image.svg';
import fileIcon from 'ass/vector/icons/files/file.svg';


let updateComponent;

const openFileExplorer = event => {
  event.currentTarget.firstElementChild.click();
}

const handleDroppedFiles = files => {
  // ([...files]).forEach(uploadFiles);
  previewFiles(files);
  messageClass = 'processing';
  setTimeout(()=>{
    messageClass = '';
    updateComponent();
  }, 2000)
}

const handleDragEvents = event => {
	event.preventDefault();
  event.stopPropagation();

  if ( event.currentTarget !== window ) {
    boxClass = /dragenter|dragover/g.test(event.type) ? 'highlight expand' : 'expand' ;
    if ( /drop/g.test(event.type) ) {
      boxClass = '';
      let dt = event.dataTransfer;
      let files = dt.files;
      handleDroppedFiles(files);
    }
  } else {
    boxClass = /dragleave|drop/g.test(event.type) ? '' : 'expand';
  }
  
	updateComponent();
}

const handleDropListeners = (target, action) => {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		target[`${ action }EventListener`](eventName, handleDragEvents, false);
	});
}

var dropBox;
var boxClass = '';
var messageClass = '';
var previewFiles;

var fileInput = React.createElement('input', {
  key: 'mediainput', 
  type: 'file', 
  className: 'File-Input',
  name: 'gallery', 
  accept: 'image/*',
  multiple: true,
});;


const DropBox = ({ processFiles }) => {
	const [ state, setState ] = useState(null);
	const dropBoxRef = useRef();

  previewFiles = processFiles;

	updateComponent = () => {
		setState(Date.now());
	}

	useEffect(() => {
		dropBox = dropBoxRef.current;
		handleDropListeners(dropBox, 'add');
    handleDropListeners(window, 'add');
      
		return () => {
			handleDropListeners(dropBox, 'remove');
      handleDropListeners(window, 'remove');
		}
	}, []);

	return(

    <div className={ `Drop-Box ${ boxClass } ${ messageClass }` } ref={ dropBoxRef } onClick={ openFileExplorer }>
      { fileInput }
      <div className={ `Drop-Box-Message` }>
        <img src={ imageIcon } alt="File icon"/>
        <h2 className={ `small` }>Click to upload files or drag them here</h2>
      </div>
      
    </div>
	);
}

export default DropBox;