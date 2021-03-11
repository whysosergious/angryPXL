/**
 * Above the fold content
 */
import React from 'react';
import './Container.css';
import Button from 'shared/Button';
import { globalObj } from 'zergski-global';

// logic
import { ZCM } from 'logic/zcm';

const LandingContainer = () => {

	const handleClick = target => {
		globalObj.ModalWindow.setState(target);
	}

	return (
		<section className="Landing-Container">


			<div className="Greeting-Group">

				<h1><span>{ ZCM.landing.heading_span }</span>{ ZCM.landing.heading }</h1>
				<h2>{ `-${ ZCM.landing.subheading }-` }</h2>
			</div>

			<div className="Button-Group">
				<Button altClass="underline small"
					text={ ZCM.landing.button_hours }
					clicked={ ()=>handleClick('Hours') }
				/>
				<Button altClass="cta"
					text={ ZCM.shared.buttons.book }
					clicked={ ()=>handleClick('Book') }
				/>
			</div>
		</section>
	);
}

export default LandingContainer;