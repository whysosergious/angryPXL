/**
 * About, collaboration and import
 */
import React, { useRef } from 'react';
import './Container.css';

// zergski logic
import { useGlobalObj } from 'zergski-global';
import { ZCM } from 'logic/zcm';

// media
import repslagarBackground from 'ass/vector/files/entrance.svg';
import greatBrandsImage from 'ass/img/about/great-brands-import.jpg';
import swedenColabImage from 'ass/img/about/sweden-colab.jpg';
import mainBarImage from 'ass/img/about/main-bar.jpg';
import caskAleImage from 'ass/img/about/cask-ale.jpg';

// components
import ImageWrapper from 'shared/ImageWrapper';

const AboutContainer = () => {
	const About = {
		ref: useRef(null),
		index: 5,
	}
	const AboutHeading = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle bottom',
	}
	const AboutGroup0 = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle',
	}
	const AboutGroup1 = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle',
	}
	const AboutGroup2 = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle',
	}
	const AboutGroup3 = {
		ref: useRef(null),
		index: 0,
		initialState: 'idle',
	}

	const [ state, setState ] = useGlobalObj({ About }, 'Sections');
	const [ headingState ] = useGlobalObj({ AboutHeading }, 'ViewportAnimated');
	const [ group0State ] = useGlobalObj({ AboutGroup0 }, 'ViewportAnimated');
	const [ group1State ] = useGlobalObj({ AboutGroup1 }, 'ViewportAnimated');
	const [ group2State ] = useGlobalObj({ AboutGroup2 }, 'ViewportAnimated');
	const [ group3State ] = useGlobalObj({ AboutGroup3 }, 'ViewportAnimated');


   return (
		<>
			<section className="About-Container" ref={ About.ref }
				style={{ position: 'relative', paddingBottom: '12rem' }}
			>
				<ImageWrapper imgSrc={ repslagarBackground }
					imgDesc="Vector of the outside of the bar at Repslagargatan, Södermalm"
					style={{
						background: 'none',
						position: 'absolute',
						height: '50rem',
						width: 'unset',
						minWidth: '100%',
						objectFit: 'cover',
						top: '0',
						opacity: '.05'
					}}
				/>
				<div className={ `Heading-Group Intro left ${ headingState } va` } ref={ AboutHeading.ref }>
					<h1 className="dark">
						{ ZCM.about.intro.heading }
					</h1>
					<h3 className="dark">
						{ ZCM.about.intro.body }
					</h3>
				</div>

				<div className={ `About-Group right ${ group0State } va` } ref={ AboutGroup0.ref }>
					<div className="Heading-Group right">
						<h2 className="dark">
							{ ZCM.about.import.heading }
						</h2>
						<h3 className="dark small">
							{ ZCM.about.import.body }
						</h3>
					</div>
					<ImageWrapper imgSrc={ greatBrandsImage }
						imgDesc="Logo of sister import company Great Brands"
					/>
				</div>

				<div className={ `About-Group left ${ group1State } va` } ref={ AboutGroup1.ref }>
					<div className="Heading-Group left">
						<h2 className="dark">
							{ ZCM.about.local.heading }
						</h2>
						<h3 className="dark small">
							{ ZCM.about.local.body }
						</h3>
					</div>
					<ImageWrapper imgSrc={ swedenColabImage }
						imgDesc="Brewers from Swedish Nynäshamn Brewery and American SKA tasting newly brewed beer"
					/>
				</div>
			</section>


			<section className="About-Container dark"
				style={{ paddingTop: '0' }}
			>
				<div className={ `About-Group right ${ group2State } va` } ref={ AboutGroup2.ref }>
					<div className="Heading-Group right">
						<h2>
							{ ZCM.about.service.heading }
						</h2>
						<h3 className="small">
							{ ZCM.about.service.body }
						</h3>
					</div>
					<ImageWrapper imgSrc={ mainBarImage }
						imgDesc="Main bar before service"
					/>
				</div>

				<div className={ `About-Group left ${ group3State } va` } ref={ AboutGroup3.ref }>
					<div className="Heading-Group left">
						<h2>
							{ ZCM.about.cask.heading }
						</h2>
						<h3 className="small">
							{ ZCM.about.cask.body }
						</h3>
					</div>
					<ImageWrapper imgSrc={ caskAleImage }
						imgDesc="Three Real Ale taps with Swedish and Brittish Cask Ale"
					/>
				</div>
			</section>
		</>
   );
}

export default AboutContainer;