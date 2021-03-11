import React, { useRef, useEffect, useState } from 'react';
import './Dash.css';
import './Media.css';

// logic
import imgbit from 'logic/imgbit/script';
import { uploadFiles } from 'logic/zcm';

// components
import DropBox from 'shared/DropBox';
import EditToolbar from 'Toolbar/Edit';

// let uploadData = [];
var previewData = [];
let previews = [];
// var loadedMedia = [];
var uc = 0;	// count uploads since last save


// *** TEMP CODE
const inspectImage = event => {
	
	let index = event.currentTarget.dataset.index;
	let w = window.open('about:blank');
	
	let image = new Image();
	image.src = previewData[index].url;
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

const createPreviews = imageData => {

	imageData.forEach((entry, i) => {
		let sizesCount = entry.sizes.length;
		let thumb = entry.sizes[sizesCount-1]?.url || entry.url;
		previews.push(<div key={`preview${uc++}-${i}`} className={ `Image-Wrapper` } data-index={ i } onClick={ inspectImage }>
				<h2>{ sizesCount+1 }</h2>
				<img className={ `Original` } src={ thumb } alt="Preview" />
			</div>);
		// entry.sizes && createPreviews(entry.sizes);
	});
}



const loadFiles = fileData => {

}

const Media = () => {
	const [ state, setState ] = useState(null);

	const previewFiles = files => {

			imgbit(files).then(result=>{
				previewData = result;
				createPreviews(result);
				console.log(result)
				setState(Date.now())
			})
			
		// });
	}

	return(
		<section className="Page">
			<EditToolbar saveFiles={ ()=>uploadFiles(previewData) } />
			<h1 className={ `Page-Heading` }>Text Content and Locale</h1>
			<div className={ `Album` }>
					{ previews }
			</div>
			<DropBox processFiles={ previewFiles } />
		</section>
	);
}

export default Media;