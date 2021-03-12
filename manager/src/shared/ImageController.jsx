// A thumbnail component for managing media
import React, { useState } from 'react';
import './shared.css';
import './ImageController.css';

// logic
import { approot } from 'logic/zcm';

const handleSelection = event => {
  // console.log(event.target);
}

// var checked = '';

const ImageController = ({ entry, sizesCount=0, selected = handleSelection, clicked = undefined, index = 0, status, altClass='', root='', imgSrc='', alt="Happy days" }) => {
  // const [ state, setState ] = useState(null);

  // const selectImage = (event, entry) => {
  //   if ( !checked ) {
  //     clicked(entry, true);
  //     checked = 'checked';
  //   } else {
  //     clicked(entry, false)
  //     checked = '';
  //   }

  //   // selected(event);
  //   setState(Date.now());
  // }

	return(
		<div key={ `${ status }-${ index}` } className={ `Image-Controller ${ altClass }` } data-index={ index } >
      <div className={ `Checkbox ${ 0 }` } onClick={ `` }><div className="box"></div></div>
      <h2>{ sizesCount+1 }</h2>
      <img src={ `${ root }${ imgSrc }` } alt={ alt } onClick={ clicked }/>
    </div>
	);
}

export default ImageController;