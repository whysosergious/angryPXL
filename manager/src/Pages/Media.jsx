import React, { useRef, useEffect, useState } from 'react';
import './Dash.css';
import './Media.css';

// logic
import imgbit from 'logic/imgbit/script';
import { approot, fetchJSON, uploadFiles, deleteFiles } from 'logic/zcm';

// components
import DropBox from 'shared/DropBox';
import ImageController from 'shared/ImageController';
import EditToolbar from 'Toolbar/Edit';

var mediaController = {
	albums: [],
	featured: [

	]
};
var previewData = [];
let previews = [];
var loadedMedia = [];
var loadedData = [];

// *** TEMP CODE
const inspectImage = event => {
	// console.log(event);

		let index = event.currentTarget.dataset.index;
		let w = window.open('about:blank');
		
		let image = new Image();
		image.src = previewData[index].url
		
		image.addEventListener('load', ()=>{
			w.document.write(image.outerHTML);
			image.remove();
		}, { passive: true, once: true })

		previewData[index].sizes?.forEach(e=>{
			let image = new Image();
			image.src = e.url;
			image.style.display = 'block';
			image.style.margin = '1rem';
			image.addEventListener('load', ()=>{
				w.document.write(image.outerHTML);
				image.remove();
			}, { passive: true, once: true })
		});
	
}

const selected = [];
const selectedPreviews = [];
const handleSelect = (entry, type, remove=false) => {
	let array = type === 'loaded' ? selected : selectedPreviews;
	if ( remove ) {
		spliceEntry(entry, array);
	} else {
		array.push(entry);
	}
	console.log(type, selected, selectedPreviews)
}

const createPreviews = imageData => {

	imageData.forEach((entry, i) => {
		let sizesCount = entry.sizes.length;
		let thumb = entry.sizes[sizesCount-1]?.url || entry.url;
		previews.unshift(<ImageController key= { count++ } index={ i } status="preview" clicked={ inspectImage } sizesCount={ sizesCount } imgSrc={ thumb } alt="Preview" entry={ entry } onSelect={ handleSelect } />)
		// entry.resolutions && createPreviews(entry.resolutions);
	});
}

const prepUpload = () => {
	if ( previewData ) {
		mediaController.featured = previewData;
	
		uploadFiles(mediaController).then(() => {
			// console.log(response);
			// response !== true ? console.log('Some files need attention', response) : console.log('Done');
			previewData = [];
			mediaController.featured = [];
		});
	}
}

let count= 0;
const displayMedia = data => {
	loadedMedia = [];
	data.featured.forEach((entry, i) => {
		let sizesCount = entry.sizes.length;
		let thumb = entry.sizes[sizesCount-1]?.url || entry.url;
		loadedMedia.push(<ImageController key= { count++ } index={ i } status="loaded" clicked={ inspectImage } sizesCount={ sizesCount } imgSrc={ `${ approot }${ thumb }` } alt={ entry.description } entry={ entry } onSelect={ handleSelect } />)
	});
	previews = [ ...loadedMedia];
	
}

const loadMedia = () => {
	fetchJSON('GalleryMedia').then(result => {
		if ( result ) {
			loadedData = result;
			displayMedia(result);
		}
		// temporary, will be sorted by albums
		updateComponent();
	})
}
loadMedia();

function spliceEntry(entry, array) {
	let index = array.indexOf(entry);
	array.splice(index, 1);
}

const prepDelete = () => {
	if ( selected ) {
		let actionData = {};
		selected.forEach(entry => {
			spliceEntry(entry, loadedData.featured);
		});
		actionData.delete = selected;
		actionData.new = loadedData;
		deleteFiles(actionData);
		displayMedia(loadedData);
	}
	if ( selectedPreviews ) {
		selectedPreviews.forEach(entry => {
			spliceEntry(entry, previewData);
		});
		createPreviews(previewData);
	}
	updateComponent();
}

var updateComponent=()=>{};

const Media = () => {
	const [ , setState ] = useState(null);

	const previewFiles = files => {
		imgbit(files).then(result=>{
			previewData.push(...result);
			createPreviews(result);
			// setState(Date.now());
			updateComponent();
		})
	}

	updateComponent = (val=Date.now()) => {
		setState(val);
	}

	return(
		<section className="Page">
			<EditToolbar buttons="save delete" deleteFiles={ prepDelete } saveFiles={ ()=>prepUpload() } />
			<h1 className={ `Page-Heading` }>Text Content and Locale</h1>
			<div className={ `Album` }>

				{ previews }

			</div>
			<DropBox processFiles={ previewFiles } />
		</section>
	);
}

export default Media;