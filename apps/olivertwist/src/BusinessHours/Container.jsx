/**
 * Business hours component to display in multiple places
 */
import React, { useState } from 'react';
import './Container.css';

// contexts
// import { kernel } from 'logic/kernel';
// logic
import { ZCM } from 'logic/zcm';

// components
import Button from 'shared/Button';
import Day from './Day';
import HoursMessage from './Message';


const BusinessHours = ({ altClass }) => {
	const [ state, setState ] = useState('regular');

	const handleClick = value => {
		setState(value);
	}

   return (
		<div className={ `Business-Hours ${ altClass }` }>
			<h2 className="headline" >{ ZCM.hours.heading }</h2>
			<div className="Hours-Container">
				<div className={ `Regular-Hours ${ state === 'regular' ? '' : 'idle' } va` }>
					{ 
						ZCM.hours.regular.map( (e, i) => {
							return <Day key={ i } day={ e.day } hours= { e.time } /> 
						})
					}
				</div>

				<div className={ `Irregular-Hours ${ state === 'irregular' ? '' : 'idle' } va` }>
					{ 
						ZCM.hours.exceptions.map( (e, i) => {
							let entry;
							if ( e.type === 'info' ) {
								entry = <HoursMessage key={ i } text={ e.message } />;
							} else {
								entry = <Day key={ i } day={ e.day } hours= { e.time } />;
							}
							return entry;
						})
					}
				</div>
			</div>

			<div className="Button-Group">
				<Button altClass="conditional small underline"
					text={ ZCM.hours.button_regular }
					textColor={ state === 'regular' ? 'white' : '' }
					clicked={ ()=>handleClick('regular') }
				/>
				<Button altClass="conditional small underline"
					text={ ZCM.hours.button_exceptions }
					textColor={ state === 'irregular' ? 'white' : '' }
					clicked={ ()=>handleClick('irregular') }
				/>
			</div>
		</div>
   );
}

export default BusinessHours;