/**
 * Promotion and introductory content
 */
import React, { useRef, useEffect } from 'react';
import './Container.css';
import styles from './Doormat.module.css';

// zergski logic
import { useGlobalObj, globalObj } from 'zergski-global';

// media
import promoBackgroundImage from 'ass/img/promo/waob.jpg';
import doormatBackgroundImage from 'ass/vector/files/fridge.svg';

// components
import Button from 'shared/Button';
import ImageWrapper from 'shared/ImageWrapper';
import { ZCM } from 'logic/zcm';


const DoormatContainer = () => {
	const Promo = {
		ref: useRef(null),
		index: 2,
		initialState: 'idle bottom',
	}
	const Doormat = {
		ref: useRef(null),
		index: 3,
		initialState: 'idle right',
	}
	const [ promoState ] = useGlobalObj({ Promo }, 'ViewportAnimated');
	const [ doormatState ] = useGlobalObj({ Doormat }, 'ViewportAnimated');

	const scrollToMenu = () => {
		globalObj.Sections.Nav.scrollTo('Menu');
	}

	useEffect(() => {
	}, [])

   return (
		<>
			<section className={ `Promo-Container accent` } ref={ Promo.ref }>
				<ImageWrapper imgSrc={ promoBackgroundImage }
					imgDesc="World Atlas of Beer guide 2021 edition by Timm Webb and Stephen Beumont"
					altClass={ styles.background_filter }
				/>


				<div className={ `${ styles.headingGroup } ${ promoState } va` }>
					<h1><span>{ ZCM.promo.heading_span }</span>{ ZCM.promo.heading }</h1>
					<h3>{ ZCM.promo.body }
					</h3>
					<Button altClass="underline"
						text={ ZCM.shared.buttons.more }
						style={{ marginTop: '3rem' }}
					/>
				</div>

			</section>
			<section className={ `Doormat-Container dark` } ref={ Doormat.ref }>
				<ImageWrapper imgSrc={ doormatBackgroundImage }
					imgDesc="Shelves with beer cans in the bars fridge"
					altClass="background"

					style={{ opacity: 0.07 }}
				/>
				<div className={ `${ styles.headingGroup_left } ${ doormatState } va` }>
					<h2>
					{ ZCM.doormat.heading }
					</h2>
					<h3 className="small">
						{ ZCM.doormat.body }
					</h3>
					<Button altClass="underline small"
						text={ ZCM.shared.buttons.more }
						style={{ marginTop: '2rem' }}
						clicked={ scrollToMenu }
					/>
				</div>
			</section>
		</>
   );
}

export default DoormatContainer;