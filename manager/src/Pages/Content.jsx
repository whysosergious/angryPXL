import React, { useEffect } from 'react';
import './Dash.css';
import EditToolbar from 'Toolbar/Edit';

// components
// import Section from 'shared/Section';

// Data
import { _gc, fetchJSON, useController } from 'logic/zcm';



const handleChange = (event, obj) => {
	if ( _gc.toolbar.saved ) {
		_gc.toolbar.saved = false;
		_gc.toolbar.dispatch(Date.now());
	}
	obj[event.target.dataset.zcm] = event.target.innerText;
}

const setEdit = (event) => {
	event.target.setAttribute('contenteditable', '');
}
const unsetEdit = (event) => {
	event.target.removeAttribute('contenteditable');
}

let entries = [];
let entry = [];
var i = 0;
function entriesFromJSON(obj, parent=[], arrayIndex=null ) {
	Object.entries(obj).forEach( (e) => {
		i++;
		
		let hideEntry = ['exceptions', 'time', 'file'].find(v => e[0] === v)
		if ( hideEntry ) { return }
		if( typeof e[1] === 'object' ) {
			
			if ( !parent[0] ) {
				if ( entry[0] ) {
					entries.push(
						<div key={`entry${parent}.${i}`} className={ `Section-Group` }>
							{ entry }
						</div>
					);
					entry = [];
				}
				entry.push(

					<div className={ `Section-Heading` } key={`head${parent}.${i}`}>
						<h2>{ e[0] }</h2>
						
					</div>,
					<div className={ `Info-Row` } key={`info${parent}.${i}`}>
						<h3>Key</h3>
						<h3 className={ `lang1` }>Swedish</h3>
						<h3 className={ `lang2` }>English</h3>
					</div>

				);
				
			} else if( !e[0].match(/[0-9]/g) ) {
				entry.push(
					<h2 className={ `small stripes Subheading` } key={`sub${parent}.${i}`}>{ e[0] }</h2>
				);
			} else {
				arrayIndex = e[0];
			}

			entriesFromJSON(e[1], [...parent, e[0]], arrayIndex );
		} else {
			let engObj = _gc.textContent;
			parent.forEach(e => {
				engObj = engObj[e];
			})
			
			entry.push(
				<div className={ `Entry-Group` } key={`entrys${parent}.${i}`}>
					<h3 key={`sub${parent}.${i}`} className={ `Entry-Heading` }>{ arrayIndex || e[0] }</h3>
					<h4 className={ `Input-Field` } data-zcm={ e[0] } onInput={ (ev)=>handleChange(ev, obj) } onMouseDown={ (ev)=>setEdit(ev) } onBlur={ (ev)=>unsetEdit(ev) }>{ e[1] }</h4>
					<h4 className={ `Input-Field lang2` } data-zcm={ e[0] } onInput={ (ev)=>handleChange(ev, engObj) } onMouseDown={ (ev)=>setEdit(ev) } onBlur={ (ev)=>unsetEdit(ev) }>{ e[1] }</h4>
				</div>
			);
		}
	});
}


const Content = () => {
	const [ , setState ] = useController(null, 'content');
	
	const updatePage = () => {
		entries = [];
		entry = [];
		entriesFromJSON(_gc.textContent);
		entries.push(
			<div key={`entry-last.${i}`} className={ `Section-Group` }>
				{ entry }
			</div>
		);
		setState(Date.now());
	}

	useEffect(()=>{
		_gc.content.reload = updatePage;
		fetchJSON('TextContent').then(() => {
			updatePage();
		});
	}, [])

	return(
		<section className="Page">
			<EditToolbar buttons="history undo save"/>
			<h1 className={ `Page-Heading` }>Text Content and Locale</h1>
			{ 
				entries
			}
		</section>
	);
}

export default Content;