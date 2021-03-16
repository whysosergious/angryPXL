// A thumbnail component for managing media
import React, { useState } from 'react';
import './shared.css';
import './ImageController.css';

// logic
// import { approot } from 'logic/zcm';




const ImageController = ({  sizesCount=0,  index=0, altClass='', root='', imgSrc='', alt="Happy days", onSelect, entry, status }) => {
  const [ state, setState ] = useState('');
  
  const selectImage = () => {
    if ( !state ) {
      onSelect(entry, status);
      setState('checked');
    } else {
      onSelect(entry, status, true);
      setState('');
    }
  }
  

	return(
		<div className={ `Image-Controller ${ altClass }` } data-index={ index } key={ index } >
      <div className={ `Checkbox ${ state }` } onClick={ selectImage }><div className="box"></div></div>
      <h2>{ sizesCount+1 }</h2>
      <img src={ `${ root }${ imgSrc }` } alt={ alt } />
    </div>
	);
}

export default ImageController;