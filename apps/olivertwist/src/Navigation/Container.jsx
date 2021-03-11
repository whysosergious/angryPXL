/**
 *	Navigation menu
 */
import React, { useRef, useState, useEffect } from 'react';
import './Container.css';

// zergski logic
import { useGlobalObj, globalObj } from 'zergski-global';
import { ZCM } from 'logic/zcm';

// media
// import menuImage from 'ass/img/menu.jpg';

// components
import Button from 'shared/Button';
import Anchor from 'shared/Anchor';
// import ImageWrapper from 'shared/ImageWrapper';

const Navigation = () => {
	const Nav = {
		ref: useRef(null),
		index: 1,
		initialState: { sticky: '' }
	}
	// we save our reference to global and get a callback with an individual hook state
	// that we can set from all components that import 'global-access' collection
	const [ state ] = useGlobalObj({ Nav }, 'Sections');
	const [ swipe, setSwipe ] = useState(null);

	const handleClick = target => {
		const { main: { root }, Sections } = globalObj;
		let targetOffset = Sections[target]?.offsetY ?? target;	// ***'obj?.val' not supported by Android Opera and Samsung internet

		if ( root.scrollTop - targetOffset > 2000 ) {
			setSwipe('up');
			root.scrollTop -= 500;
			setTimeout(()=>{
				root.style.scrollBehavior = 'unset';
				root.scrollTop = targetOffset + 500;

				setTimeout(()=>{
					root.style.scrollBehavior = '';
					root.scrollTop -= 500;
				}, 10);
				setTimeout(()=>{
					setSwipe('');
				}, 500);
			}, 550)
		} else if ( root.scrollTop - targetOffset < -2000 ) {
			root.scrollTop += 500;
			setSwipe('down');
			setTimeout(()=>{
				root.style.scrollBehavior = 'unset';
				root.scrollTop = targetOffset - 500;
				setTimeout(()=>{
					root.style.scrollBehavior = '';
					root.scrollTop += 500;
				}, 10);
				setTimeout(()=>{
					setSwipe('');
				}, 500);
			}, 550)
		} else {
			root.scrollTop = targetOffset;
		}
	}

	const openModal = target => {
		globalObj.ModalWindow.setState(target);
	}

	useEffect(() => {
		globalObj.Sections.Nav.scrollTo = handleClick;
	}, [])

   return (
      <nav className={ `${ state.sticky } ${ swipe }` } ref={ Nav.ref }>
			<div className={ `Quick-Bar va` }>
				<Anchor altClass="icon"
					link=""
					fileName="otlogo-minimal.svg"
					style={{ marginRight: 'auto', padding: '.15rem' }}
					clicked={ ()=>handleClick(0) }
				/>

				<Button altClass="minimal lang"
					text={ ZCM.shared.buttons.lang }
					clicked={ '' }
				/>
			</div>
			<div className="Section-Links">
				<Button altClass="minimal"
					text={ ZCM.shared.buttons.news }
					clicked={ ()=>handleClick('News') }
				/>
				<Button altClass="minimal"
					text={ ZCM.shared.buttons.gallery }
					clicked={ ()=>handleClick('Gallery') }
				/>
				<Button altClass="minimal"
					text={ ZCM.shared.buttons.menu }
					clicked={ ()=>handleClick('Menu') }
				/>
				<Button altClass="minimal"
					text={ ZCM.shared.buttons.about }
					clicked={ ()=>handleClick('About') }
				/>
				<Button altClass="minimal"
					text={ ZCM.shared.buttons.contact }
					clicked={ ()=>handleClick('Contact') }
				/>
				<Button altClass="minimal book"
					text={ ZCM.shared.buttons.book }
					clicked={ ()=>openModal('Book') }
				/>
			</div>

      </nav>
   );
}

export default Navigation;