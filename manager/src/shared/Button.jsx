// a simple button component

import React from 'react';

const Button = ({ text, clicked, onblur=undefined, altClass, imgSrc=[], imgDesc='' }) => {
	// NOTE** there has to be a better way to pass down both an array or string
	let iconArray = Array.isArray(imgSrc) ? imgSrc : [{ icon: imgSrc, display: true }]
	return(
		<button className={ altClass }
			onClick={ clicked }
			onBlur={ onblur }
		>
			{ iconArray.map((e,i) => {
					let display = e.display ? 'initial' : 'none';
					return <img key={ `${e[4]}${i}` }
						style={{ display }}
						src={ e.icon } 
						alt={ imgDesc } 
					/>;
				})
			}
			{ text ? <h3>{ text }</h3> : '' }
		</button>
	);
}

export default Button;