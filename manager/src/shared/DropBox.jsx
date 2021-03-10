import React, { useRef, useEffect, useState } from 'react';
import './DropBox.css';

// logic
import { uploadFile } from 'logic/zcm';


let updateComponent;

const handleDroppedFiles = files => {
  ([...files]).forEach(uploadFile);
}
const handleDragEvents = event => {
	event.preventDefault();
  event.stopPropagation();

	highlight = /dragenter|dragover/g.test(event.type) ? 'highlight' : '' ;
	if ( /drop/g.test(event.type) ) {
		let dt = event.dataTransfer;
		let files = dt.files;
		handleDroppedFiles(files);
	}
	updateComponent();
}

const handleDropListeners = action => {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropBox[`${ action }EventListener`](eventName, handleDragEvents, false)
	});
	console.log(dropBox)
}

var dropBox;
var highlight = '';
var fileInput = undefined;


const DropBox = () => {
	const [ state, setState ] = useState(null);
	const dropBoxRef = useRef();

	updateComponent = () => {
		setState(Date.now());
	}

	useEffect(() => {
		dropBox = dropBoxRef.current;
		handleDropListeners('add');
    fileInput = React.createElement('input', { 
        key: 'mediainput', 
        type: 'file', 
        className: 'File-Input', 
        name: 'gallery', 
        accept: 'image/*',
        multiple: true 
      });
		return () => {
			handleDropListeners('remove');
		}
	}, []);

	return(
    <div className={ `Drop-Box ${ highlight }` } ref={ dropBoxRef }>
      { fileInput }
    </div>
	);
}

export default DropBox;