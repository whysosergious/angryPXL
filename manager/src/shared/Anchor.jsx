/**
 * Anchor element
 */
import './Anchor.css';

// media
import Logo from 'ass/vector/icons/files/evilpxl.svg';

const Anchor = ({ text, altClass, style, link, fileName, clicked }) => {

	// const handleClick = event => {
	// 	event.preventDefault();
	// 	clicked();
	// }

   return (
      <a className={ `Anchor ${ altClass }` }
			// style={ style }
			href={ link }
			// target="_blank"
			rel="noreferrer"
			// onClick={ clicked && handleClick }
		>
			<img src={ Logo }
				alt={ `${ fileName } icon` }
			/>
			<h4>{ text }</h4>
		</a>
   );
}

export default Anchor;