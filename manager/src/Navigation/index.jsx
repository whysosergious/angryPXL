import React from 'react';
import{
	Link
} from "react-router-dom";
import './Navigation.css';

// components
import Anchor from 'shared/Anchor';


const Navigation = props => {

	return(
		<div className="Navigation">
			<Anchor altClass={ `Logo` }
				link=""
				fileName="evilpxl.svg"
				clicked=""
			/>
			<Link className="Route-Button" to="/dash">
				<h3>Dash</h3>
			</Link>
			<Link className="Route-Button" to="/content">
				<h3>Text & Locale</h3>
			</Link>
			<Link className="Route-Button" to="/media">
				<h3>Media</h3>
			</Link>
			<Link className="Route-Button" to="/users">
				<h3>Users</h3>
			</Link>
			<Link className="Route-Button" to="/" style={{ marginLeft: 'auto' }}>
				<h3 style={{ fontSize: '.8rem' }}>Logout</h3>
			</Link>
		</div>
	);
}

export default Navigation;
