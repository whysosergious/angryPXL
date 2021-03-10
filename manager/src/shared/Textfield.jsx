import React, { useEffect, useRef } from 'react';
import { unmountComponentAtNode } from "react-dom";

// components
import Button from './Button';

const Textfield = ({ altClass, instance, index }) => {
	let ref = useRef(null);

	useEffect(() => {
		instance(altClass, index, ref.current);
	}, []);

	const deleteTextField = () => {
	}

	return(
		<div className={ `Text-Group ${ altClass }` }>
			<textarea className={ `Textfield ${ altClass }` } type="textarea" ref={ ref }>
				</textarea>
				<Button text={ 'X' }
					altClass="Inner-Button"
					clicked={ deleteTextField }

				/>
		</div>
	);
}

export default Textfield;