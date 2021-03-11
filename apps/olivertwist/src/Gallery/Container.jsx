/**
 * Image Gallery
 */
import React, { useRef } from 'react';
import './Container.css';

// zergski logic
import { useGlobalObj } from 'zergski-global';
import { routerHook } from 'logic/router';
import { ZCM } from 'logic/zcm';

// components
import GalleryGrid from 'shared/GalleryGrid';
import Button from 'shared/Button';

const GalleryContainer = () => {
	// deconstructing
	// const { MediaViewer } = globalObj;

	const Gallery = {
		ref: useRef(null),
		index: 3,
	}
	const GalleryHeading = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle',
	}
	// const GalleryGrid = {
	// 	ref: useRef(null),
	// 	index: 1,
	// 	initialState: 'idle',
	// }
	const [ state, setState ] = useGlobalObj({ Gallery }, 'Sections');
	const [ headingState ] = useGlobalObj({ GalleryHeading }, 'ViewportAnimated');
	// const [ gridState ] = useGlobalObj({ GalleryGrid }, 'ViewportAnimated');

	// const handleClick = index => {
	// 	MediaViewer.setState({ display: 'show', index });
	// }

	const routeToGallery = () => {
		routerHook.routeTo('gallery');
	}

   return (
      <section className="Gallery-Container dark" ref={ Gallery.ref }>
			<div className={ `Heading-Group ${ headingState } va` } ref={ GalleryHeading.ref }>
				<h1>
					{ ZCM.gallery.heading }
				</h1>
			</div>

			<GalleryGrid />

			<Button text="Fler bilder"
				style={{ marginTop: '5rem' }}
				clicked={ routeToGallery }
			/>
      </section>
   );
}

export default GalleryContainer;