import React, { useState } from 'react';
import './Section.css';

// components
import Textfield from './Textfield';
import Button from './Button';

let key = 0;

const array = [];
const dataArray = [];
const closure = [];
let cc = 0;
let isInArray = false;

const addToData = ( type, index, ref ) => {

}

// let textFields = [ <Textfield altClass={ `Key` } key={ key } index={ key } /> ];

const Section = props => {

	const [ state, setState ] = useState(0);

	const addEntry = type => {

		array[++key] =	<Textfield
			altClass={ type }
			key={ key }
			index={ key }
			instance={ addToData }
		/>

		setState(key);
	};

	const closeEntry = event => {

	}

	const saveData = event => {

	}

	return(
		<div className="Section">

			<div className="Text-Field-Wrapper">
				{ array }
			</div>

			<div className="Button-Group">
				<div className="Button-Group">
					<Button text={ 'Key' }
						clicked={ ()=>addEntry('Key') }
					/>
					<Button text={ 'Value' }
						clicked={ ()=>addEntry('Value') }
					/>
					<Button text={ 'Array' }
						clicked={ ()=>addEntry('Array') }
					/>
					<Button text={ 'Break' }
						clicked={ closeEntry }
					/>
					<Button text={ 'Save' }
						clicked={ saveData }
					/>
				</div>
			</div>
		</div>
	);
}

export default Section;





// {
// 	Language: 'Sve.',
// 	Landing:
// 	{
// 		Greeting:
// 		{
// 			[ Welcome, Wekcome ],
// 			[ Title, 'Oliver-Twist'],
// 			Buttons: {
// 				<
// 			}
// 		}
// 	}
// }