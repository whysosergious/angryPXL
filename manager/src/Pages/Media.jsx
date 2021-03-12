import React, { useRef, useEffect, useState } from 'react';
import './Dash.css';
import './Media.css';

// logic
import imgbit from 'logic/imgbit/script';
import { approot, fetchJSON, uploadFiles } from 'logic/zcm';

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
var sel = [];

// *** TEMP CODE
const inspectImage = (entry, checked) => {
	
	// if ( !checked ) {
	// 	let i = sel.indexOf(entry);
	// 	sel.push(entry);
	// } else {
	// 	let i = sel.indexOf(entry);
	// 	i >= 0 && sel.splice(i, 1);
	// }

	// console.log(sel)

	// let index = event.currentTarget.dataset.index;
	// let w = window.open('about:blank');

	// let image = new Image();
	// image.src = previewData[event.index].url;
	// // previewData[index].url
	// image.addEventListener('load', ()=>{
	// 	w.document.write(image.outerHTML);
	// 	image.remove();
	// }, { passive: true, once: true })

	// previewData[index].sizes?.forEach(e=>{
	// 	let image = new Image();
	// 	image.src = e.url;
	// 	image.style.display = 'block';
	// 	image.style.margin = '1rem';
	// 	image.addEventListener('load', ()=>{
	// 		w.document.write(image.outerHTML);
	// 		image.remove();
	// 	}, { passive: true, once: true })
	// });
}

const createPreviews = imageData => {

	imageData.forEach((entry, i) => {
		let sizesCount = entry.sizes.length;
		let thumb = entry.sizes[sizesCount-1]?.url || entry.url;
		previews.unshift(<ImageController index={ i } status="loaded" dataset-index={ i } clicked={ (ev)=>inspectImage(ev, previewData) } sizesCount={ sizesCount } imgSrc={ thumb } alt="Preview" />)
		// entry.resolutions && createPreviews(entry.resolutions);
	});
}

const prepUpload = files => {
	mediaController.featured = files;
	uploadFiles(mediaController).then(response => {
		// console.log(response);
		// response !== true ? console.log('Some files need attention', response) : console.log('Done');
		previewData = [];
		mediaController.featured = [];
	});
}

const loadMedia = () => {
	fetchJSON('GalleryMedia').then(result => {

		result?.featured.forEach((entry, i) => {
			let sizesCount = entry.sizes.length;
			let thumb = entry.sizes[sizesCount-1]?.url || entry.url;
			loadedMedia.push(<ImageController index={ i } status="loaded" clicked={ inspectImage } sizesCount={ sizesCount } imgSrc={ `${ approot }${ thumb }` } alt={ entry.description } entry={ entry } />)
		});
		previews = [ ...loadedMedia]; // temporary, will be sorted by albums
		updateComponent();
	})
}
loadMedia();

var updateComponent;

const Media = () => {
	const [ state, setState ] = useState(null);

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
			<EditToolbar saveFiles={ ()=>prepUpload(previewData) } />
			<h1 className={ `Page-Heading` }>Text Content and Locale</h1>
			<div className={ `Album` }>
					{ previews }
			</div>
			<DropBox processFiles={ previewFiles } />
		</section>
	);
}

export default Media;