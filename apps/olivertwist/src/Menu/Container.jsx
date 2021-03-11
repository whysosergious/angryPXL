/**
 * Menues and specials
 */
import React, { useRef } from 'react';
import './Container.css';
import Button from 'shared/Button';

// zergski logic
import { useGlobalObj } from 'zergski-global';
import { ZCM } from 'logic/zcm';

// media
import menuImage from 'ass/img/menu.jpg';

// components
import ImageWrapper from 'shared/ImageWrapper';

const MenuContainer = props => {
	const Menu = {
		ref: useRef(null),
		index: 4,
	}
	const MenuHeading = {
		ref: useRef(null),
		index: 4,
		initialState: 'idle bottom',
	}
	const MenuButtons = {
		ref: useRef(null),
		index: 4,
		initialState: 'idle bottom',
	}
	const [ state ] = useGlobalObj({ Menu }, 'Sections');
	const [ headingState ] = useGlobalObj({ MenuHeading }, 'ViewportAnimated');
	const [ buttonsState ] = useGlobalObj({ MenuButtons }, 'ViewportAnimated');

   return (
      <section className={ `Menu-Container accent ${ state }` }>

			<div className="Menu-Group" ref={ Menu.ref }>
				<ImageWrapper imgSrc= { menuImage }
					imgDesc="A la carté risotto rätt"
					altClass="background overlay"
					style={{ opacity: 1 }}
				/>
				<div className={ `Heading-Group ${ headingState } va` } ref={ MenuHeading.ref }>
					<h1>
						{ ZCM.menu.heading }
					</h1>
					<h3>
						{ ZCM.menu.body }
					</h3>
				</div>
			</div>

			<div className={ `Button-Group ${ buttonsState } va` } ref={ MenuButtons.ref }>
				{
					ZCM.menu.items.map( (e,i) => {
						return <Button key={ i } altClass="menu"
							text={ e.name }
						/>
					})
				}
			</div>
      </section>
   );
}

export default MenuContainer;