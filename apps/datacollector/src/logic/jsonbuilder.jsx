import React, { useState, useEffect } from 'react';
import './jsonbuilder.css';
import './syntaxhighlight';
import { _zcmStart, _evilcook } from './cat';

// icons
import editIcon from './builder/edit.svg';
import sortIcon from './builder/sort.svg';
import downloadIcon from './builder/download.svg';
import compileIcon from './builder/compile.svg';
import crossIcon from './builder/circlecross.svg';



export const builderHook = {

}

const prepArray = [];
const prepObj = [];
var path = [];

const handleChange = (event, obj) => {
	console.log(event.target.dataset.zcm)
	console.log(obj)
	obj[event.target.dataset.zcm] = event.target.innerText;
	let parent = findRealParent(event.target, 'zkey');
	parent.dataset.zkey = event.target.innerText;
}


const setEdit = (e) => {
	e.stopPropagation();
	// if ( activeTool === 'edit' ) {
		e.target.setAttribute('contenteditable', '');

	// } else if ( activeTool === 'sort' ) {
	// 	e.target.draggable = true;
		
	// 	console.log(e.target)
		
	// } else if ( activeTool === 'json' ) {

	// } else if ( activeTool === 'compile' ) {

	// }
	
}
const unsetEdit = (e) => {
	e.target.removeAttribute('contenteditable');
}

var viewport = {
	height: window.innerHeight,
	width: window.innerWidth,
}

var resizeStartValues = { x: 0, y: 0 }
var startPos = { x: 0, y: 0 }
var dragOffset = { x: 0, y: 0 }
var hitBox = {
	top: {
		val: 0,
		drop: 0,
		hit: false,
	},
	right: {
		val: 0,
		drop: 0,
		hit: false,
	},
	bottom: {
		val: 0,
		drop: 0,
		hit: false,
	},
	left: {
		val: 0,
		drop: 0,
		hit: false,
	}
}

const findRealParent = (el, set, name='any') => {
	let realParent = el;
	if ( name === 'any' ) {
		while ( !realParent.dataset[set] ) {
			realParent = realParent.parentElement;
		}
	} else if ( name !== 'any' ) {
		while ( realParent.dataset[set] !== name ) {
			realParent = realParent.parentElement;
		}
	}
	return realParent;
}

const generateRandomString = () => {
	return Math.random().toString(36).substring(2, 15);
	// + Math.random().toString(36).substring(2, 15)
}

const builderDims = {
	height: 0,
	width: 0,
}

let logTick = true;
const logTimer = () => {
	logTick = false;
	setTimeout(()=>{
		logTick = true;
	}, 200);
}

// init copycat
_zcmStart();

let rawjson = '';
let rawComponents = [];
var mouseMove, mouseUp, resizeMove, resizeEnd;
const JSONBuilder = () => {
	const [ toggleMinimizeState, setToggleMinimize ] = useState('open');
	const [ list, setList ] = useState(null);
	const [ activeTool, setTool ] = useState('edit');


let dragging = false;
let dragY = 0;
let dragged;
let heroIndex, targetIndex;
function startDrag(e) {
	dragY = e.screenY;
	dragged = e.target;
	dragged.style.pointerEvents = 'none';
	dragged.style.zIndex = '10';
	let parent = e.target.parentElement;
	parent.style.userSelect = 'none';
	let siblings = parent.children;
	Object.values(siblings).forEach( s => {
		s.addEventListener('mousemove', dragEntry);
	});
	prepObj.forEach( (c,i) => {
		if ( c.id === e.target.dataset.zid ) {
			heroIndex = i;
			return;
		}
	});
	window.addEventListener('mouseup', dropEntry);
}

let dragEntryOffset;
function dragEntry(e) {
	e.stopPropagation();
	e.preventDefault();
	dragging = true;
	if ( dragged ) {
		dragEntryOffset = e.screenY - dragY;
		dragged.style.transform = `translate3d(0,${ dragEntryOffset }px,0)`;
	}
	
	
	prepObj.forEach( (c,i) => {
		if ( c.id === e.target.dataset.zid ) {
			targetIndex = i;
			// console.log(c.id)
			return;
		}
	});	
}


function dropEntry(e) {
	e.stopPropagation();
	e.preventDefault();
	dragged && dragged.removeAttribute('style');
	dragEntryOffset = 0;
	dragged = null;
	let parent = e.target.parentElement;

	if ( parent ) {
		let siblings = parent.children;

	
		parent.style.userSelect = '';
		
		if ( targetIndex >= 0 && dragging === true ) {
			let hero = prepObj[heroIndex];
			let uiHero = prepArray[heroIndex];
			prepObj.splice(heroIndex, 1);
			prepObj.splice(targetIndex, 0, hero);
			prepArray.splice(heroIndex, 1);
			prepArray.splice(targetIndex, 0, uiHero);


			setList(e.timeStamp);
		}
		dragging = false;
		window.removeEventListener('mouseup', dropEntry);
		Object.values(siblings).forEach( s => {
			s.removeEventListener('mousemove', dragEntry);
		});
	}

// }
}



	function handleMouseMove(e, el, container) {
		e.stopPropagation();
    e.preventDefault();
		let screenPos = container.getBoundingClientRect();
		hitBox.top.val = screenPos.top;
		hitBox.right.val = screenPos.right;
		hitBox.bottom.val = screenPos.bottom;
		hitBox.left.val = screenPos.left;

		
		// hit detection top & bottom
		if ( hitBox.top.val >= 0 && !hitBox.top.hit && hitBox.bottom.val <= viewport.height && !hitBox.bottom.hit ) {
			dragOffset.y = e.screenY - startPos.y;
		} else if ( hitBox.top.val <= 0 && !hitBox.top.hit ) {
			!hitBox.bottom.hit && (hitBox.top.hit = true);
			hitBox.top.drop = e.screenY;
		} else if ( e.screenY > hitBox.top.drop && hitBox.top.hit ) {
			hitBox.top.hit = false;
			!hitBox.bottom.hit && (dragOffset.y += 1);
		} else if ( hitBox.bottom.val >= viewport.height && !hitBox.bottom.hit ) {
			!hitBox.top.hit && (hitBox.bottom.hit = true);
			hitBox.bottom.drop = e.screenY;
		} else if ( e.screenY < hitBox.bottom.drop && hitBox.bottom.hit ) {
			hitBox.bottom.hit = false;
			!hitBox.top.hit && (dragOffset.y -= 1);
		}
		
		// hit detection left & right
		if ( hitBox.left.val >= 0 && !hitBox.left.hit && hitBox.right.val <= viewport.width && !hitBox.right.hit ) {
			dragOffset.x = e.screenX - startPos.x;
		} else if ( hitBox.left.val <= 0 && !hitBox.left.hit ) {
			!hitBox.right.hit && (hitBox.left.hit = true);
			hitBox.left.drop = e.screenX;
		} else if ( e.screenX > hitBox.left.drop && hitBox.left.hit ) {
			hitBox.left.hit = false;
			!hitBox.right.hit && (dragOffset.x += 1);
		} else if ( hitBox.right.val >= 0 && !hitBox.right.hit ) {
			!hitBox.left.hit && (hitBox.right.hit = true);
			hitBox.right.drop = e.screenX;
		} else if ( e.screenX < hitBox.right.drop && hitBox.right.hit ) {
			hitBox.right.hit = false;
			!hitBox.left.hit && (dragOffset.x -= 1);
		}



		// logTick && console.log(`screeX:  ${e.screenX}\n`, `dragOffsetX:  ${dragOffset.x}`);
		// logTick && console.log(`hitRight:  ${hitBox.right.hit}\n`, `hitLeft:  ${hitBox.left.hit}`);
		// logTick && console.log(`leftDrop:  ${hitBox.left.drop}\n`, `leftVal:  ${hitBox.left.val}`);
		// logTick && console.log(`rightDrop:  ${hitBox.right.drop}\n`, `rightVal:  ${hitBox.right.val}`, `vpHeight:  ${viewport.width}`);
		//____________________________________________________________________________________________________________
		// logTick && console.log(`screeY:  ${e.screenY}\n`, `dragOffsetY:  ${dragOffset.y}`);
		// logTick && console.log(`hitBottom:  ${hitBox.bottom.hit}\n`, `hitTop:  ${hitBox.top.hit}`);
		// logTick && console.log(`topDrop:  ${hitBox.top.drop}\n`, `topVal:  ${hitBox.top.val}`);
		// logTick && console.log(`bottomDrop:  ${hitBox.bottom.drop}\n`, `bottomVal:  ${hitBox.bottom.val}`, `vpHeight:  ${viewport.height}`);
		



		// logTick && console.log(e.screenX, hitBox.right.drop, dragOffset.x, hitBox.right.val, viewport.width, hitBox.right.hit);
		
    
		container.style.transform = `translate3d( ${ dragOffset.x }px, ${ dragOffset.y }px,0 )`;
		logTick && logTimer();
  }

  function handleMouseUp(e) {
    e.stopPropagation();
    e.preventDefault();
		window.removeEventListener( 'mousemove', mouseMove );
		window.removeEventListener( 'mouseup', mouseUp );
		hitBox.top.drop = 0;
		hitBox.right.drop = viewport.width;
		hitBox.bottom.drop = viewport.height;
		hitBox.left.drop = 0;
  }

  function handleMouseDown(e) {
		let container = findRealParent(e.target, 'zmain', 'builderContainer');
		e.stopPropagation();
    e.preventDefault();
		mouseMove = (event) => handleMouseMove(event, e, container);
		mouseUp = (event) => handleMouseUp(event, e);
		window.addEventListener( 'mousemove', mouseMove );
		window.addEventListener( 'mouseup', mouseUp );
		startPos = {
			x: e.screenX - dragOffset.x,
			y: e.screenY - dragOffset.y,
		}
  }

	function handleResizeMove(e, el, container, handle, vals) {
		if ( handle === 'bottom' ) {
			container.style.height = `${resizeStartValues.height + e.screenY - resizeStartValues.y}px`;
		} else {
			container.style.width = `${resizeStartValues.width + resizeStartValues.x - e.screenX}px`;
		}

		// logTick && logTimer();
	}

	function handleResizeEnd(e) {
		e.stopPropagation();
    e.preventDefault();
		window.removeEventListener( 'mousemove', resizeMove );
		window.removeEventListener( 'mouseup', resizeEnd );
	}

	function handleStartResize(e) {
		let container = findRealParent(e.target, 'zmain', 'builderContainer');
		
		let handle = e.target.dataset.rh;
		let box = container.getBoundingClientRect();
		resizeStartValues = {
			x: e.screenX,
			y: e.screenY,
			height: box.height,
			width: box.width,
			left: box.left,
			right: box.right,
		}
		e.stopPropagation();
    e.preventDefault();
		resizeMove = (event) => handleResizeMove(event, e, container, handle);
		resizeEnd = (event) => handleResizeEnd(event, e);
		window.addEventListener( 'mousemove', resizeMove );
		window.addEventListener( 'mouseup', resizeEnd );
		
	}

	function minimizeBuilder(e) {
		let container = findRealParent(e.target, 'zmain', 'builderContainer');

		if ( toggleMinimizeState === 'open' ) {
			builderDims.height = container.style.height;
			builderDims.width = container.style.width;
			container.style.height = '';
			container.style.width = '';
			hitBox.top.drop = 0;
			hitBox.right.drop = viewport.width;
			hitBox.bottom.drop = viewport.height;
			hitBox.left.drop = 0;
			hitBox.top.hit = false;
			hitBox.right.hit = false;
			hitBox.bottom.hit = false;
			hitBox.left.hit = false;
			setToggleMinimize('minimized');
		} else {
			container.style.height = builderDims.height;
			container.style.width = builderDims.width;
			setToggleMinimize('open');
		}
	}

	useEffect(()=>{
		builderHook.dispatch = setList;
		window.onclick = (e) => {
			e.stopPropagation();
			e.preventDefault();

			if ( e.target.dataset.zel !== 'builder' && !e.target.dataset.selected ) {
				let key = `key_${generateRandomString()}`;
				let id = `id_${generateRandomString()}`;
				e.target.setAttribute('data-selected', key);

				let entry = { id: id, key: key, type: 'pair', value: e.target.innerHTML.replace(/<span[\s\S]*?\b<\/span>/g, ''), path: JSON.parse(JSON.stringify(path)) }
				prepObj.push(entry);
				
				prepArray.push(
					<div key={ key } className={ `Data-Entry` } data-zel="builder" data-zid={ entry.id } data-zkey={ entry.key } onMouseDown={ (ev)=>startDrag(ev) }>
						<h3 className={ `Input-Field key` } data-zcm={ 'key' } data-zel="builder" onInput={ (ev)=>handleChange(ev, entry) } onMouseDown={ (ev)=>setEdit(ev, activeTool) } onBlur={ (ev)=>unsetEdit(ev) }>{ entry.key }</h3>
						<div className={ `Colon` } data-zel="builder">:</div>
						<h3 className={ `Input-Field value` } data-zcm={ 'value' } data-zel="builder" onInput={ (ev)=>handleChange(ev, entry) } onMouseDown={ (ev)=>setEdit(ev, activeTool) } onBlur={ (ev)=>unsetEdit(ev) }>{ entry.value }</h3>
						<img className={ `Inline-Button` } src={ crossIcon } alt="Delete entry" onMouseDown={ deleteEntry } data-zel="builder" />
					</div>
				);
				setList(e.timeStamp);
			}
		}
	}, []);

	const handleNest = (e) => {
		let key = `key_${generateRandomString()}`;
		let id = `id_${generateRandomString()}`;

		path.push({ type: 'nest', key });
		let entry = { id: id, key: key, type: 'nest', value: {}, path: JSON.parse(JSON.stringify(path)) }
		prepObj.push(entry);

		prepArray.push(
			<div key={ key } className={ `Data-Entry` } data-zel="builder" data-zid={ entry.id } data-zkey={ entry.key } onMouseDown={ (ev)=>startDrag(ev) }>
				<h3 className={ `Input-Field key` } data-zcm={ 'key' } data-zel="builder" onInput={ (ev)=>handleChange(ev, entry) } onMouseDown={ (ev)=>setEdit(ev, activeTool) } onBlur={ (ev)=>unsetEdit(ev) } style={{ color: '#f751b1' }}>{ entry.key }</h3>
				<div className={ `Colon` } data-zel="builder">:</div>
				<div className={ `Colon` } data-zel="builder">{ `{` }</div>
				<img className={ `Inline-Button` } src={ crossIcon } alt="Delete entry" onMouseDown={ deleteEntry } data-zel="builder" />
			</div>
		);
			// console.log(path)
		setList(e.timeStamp);
	}

	const handleNestArray = (e) => {
		let key = `key_${generateRandomString()}`;
		let id = `id_${generateRandomString()}`;

		path.push({ type: 'array', key });
		let entry = { id: id, key: key, type: 'array', value: [], path: JSON.parse(JSON.stringify(path)) }
		prepObj.push(entry);

		prepArray.push(
			<div key={ key } className={ `Data-Entry` } data-zel="builder" data-zid={ entry.id } data-zkey={ entry.key } onMouseDown={ (ev)=>startDrag(ev) }>
				<h3 className={ `Input-Field key` } data-zcm={ 'key' } data-zel="builder" onInput={ (ev)=>handleChange(ev, entry) } onMouseDown={ (ev)=>setEdit(ev, activeTool) } onBlur={ (ev)=>unsetEdit(ev) } style={{ color: '#ffd900' }}>{ entry.key }</h3>
				<div className={ `Colon` } data-zel="builder">:</div>
				<div className={ `Colon` } data-zel="builder">{ `[` }</div>
				<img className={ `Inline-Button` } src={ crossIcon } alt="Delete entry" onMouseDown={ deleteEntry } data-zel="builder" />
			</div>
		);
			// console.log(prepObj)
		setList(e.timeStamp);
	}

	const deleteEntry = event => {
		let parent = event.currentTarget.parentElement;
		prepObj.forEach((e, i) => {
			if ( e.id === parent.dataset.zid ) {
				console.log(e)
				if ( e.type === 'close' ) {
					path.push({ type: prepObj[i].value });
				} else if ( e.type !== 'pair' ) {
					path.pop();
				}
				
				prepObj.splice(i, 1);
				prepArray.splice(i, 1);
			}
		});
		setList(event.timeStamp);
	}
	const closeNest = (e) => {
		// console.log(path)
		let nestType = { type: 'close', value: path[path.length-1].type, id: `${ Date.now() }` };
		prepObj.push(nestType);
		console.log(nestType)
		prepArray.push(
			<div key={ nestType.id } onMouseDown={ (ev)=>startDrag(ev) } className={ `Colon closing` }  data-zid={ nestType.id } data-zel="builder" style={{ paddingLeft: `${ (path.length-1) * .7 }rem` }}>{ ')' }
				<img className={ `Inline-Button` } src={ crossIcon } alt="Delete entry" onMouseDown={ deleteEntry } data-zel="builder" />
			</div>
		);
		path.pop();

		setList(e.timeStamp);
	}


 
	const compileJSON = () => {
		const json = {};
		let shift = {};
		let nest = json;
		const builderPath = [];
		Object.values(prepObj).forEach((e) => {
			// console.log(e)
			if ( e.type === 'close' ) {
				shift = json;
				builderPath.pop();
				builderPath.forEach(e=>{
					shift = Array.isArray(shift) ? shift.find(f=> Object.keys(f)[0] === e)[e] : shift[e];
				})
				nest = shift;
				
			} else {
				if ( e.type === 'pair' ) {
					if ( Array.isArray(nest) ) {
						nest.push({[e.key]: e.value});
					} else {
						nest[e.key] = e.value;
					}
				} else {

					if ( Array.isArray(nest) ) {
						let sub = {[e.key]: e.type === 'nest' ? {} : []};
						nest.push(sub);
						nest = sub[e.key];
					} else {
						nest[e.key] = e.type === 'nest' ? {} : [];
						nest = nest[e.key];
					}
					builderPath.push(e.key);
				}
			}			
		})
		// console.log(JSON.stringify(json));
		rawjson = JSON.stringify(json, null, 3);
		
		// element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  	// element.setAttribute('download', filename);
		// console.log(shift)
		// console.log(nest)
		// console.log(json)
		// console.log(path)
	}

	const findMatch = () => {
		console.log(prepObj)
		prepObj.forEach(e => {
			if ( e.type === 'pair' && e.value ) {
				e.match = [];
				Object.values(_evilcook.components.collection).forEach(c => {
					let component = `${ c.path }_${ c.name }`;
					let escapedString = e.value.replace(/(?=[-[\]{}()*+?.,\\^$|#])/g, '\\');
					
					let regex = new RegExp(`(["'\`{].*|[^>][\\s\\w]*|)(?:` + escapedString + `)(.*["'\`}]|[\\s\\w]*[^<]|)`, 'gi')
					let matches = c.rawComponent.match(regex);	// escape RegEx special characters
					// (?:["']|)(?:Boka Bord)((?!\w).[\s\S])(.*\s+[^"']+)  -- selects reverse
					// ^(?!["'])(?![^[:alpha:]])(?:boka bord)(?=[^[:alpha:]]\B)([\s]*?["']|)   --- selects with letters in the beginning
					matches && e.match.push({ component, matches })
					
				})
			}
			
		});
		Object.values(_evilcook.components.collection).forEach(c => {
			let component = `${ c.path }_${ c.name }`;
			rawComponents.push(

				<pre key={ Date.now() } className={ `Raw-Component` } data-zel="builder">
					<div className={ `Raw-Heading` } onClick={ openCode } data-zel="builder"><h2 data-zel="builder">{ component }</h2></div>
					<h3 data-zel="builder">{ c.rawComponent }</h3>
					
				</pre>
			);
		});
	}

	function openCode(e) {
		if ( 	e.currentTarget.parentElement.style.height === 'auto' ) {
			e.currentTarget.parentElement.style.height = '';
		} else {
			e.currentTarget.parentElement.style.height = 'auto';
		}
		
	}

	const handleToolbarSelection = (e, action) => {

		action === 'json' && compileJSON();
		action === 'dig' && findMatch();
		action !== 'download' && setTool(action);
	}

	return(
		<div className={ `JSON-Builder ${ toggleMinimizeState }` } data-zel="builder" data-zmain="builderContainer">
			<div className={ `JSON-Builder-Header` } onMouseDown={ handleMouseDown } data-zel="builder">
				<button className={ `Builder-Minimize-Button` } onClick={ minimizeBuilder } data-zel="builder"></button>
			</div>
			<div className={ `Builder-Heading-Group` } data-zel="builder">
				<h1 className={ `Builder-Heading` } data-zel="builder">Data Collection</h1>
			</div>
			
			<div className={ `Info-Row` } data-zel="builder">
				<button onClick={ (ev)=>handleToolbarSelection(ev, 'edit') } className={ activeTool === 'edit' ? `active` : '' } data-zel="builder"><img src={ editIcon } alt="Edit Icon" data-zel="builder"/></button>
				<button onClick={ (ev)=>handleToolbarSelection(ev, 'sort') } className={ activeTool === 'sort' ? `active` : '' } data-zel="builder"><img src={ sortIcon } alt="Sort Icon" data-zel="builder"/></button>
				<button onClick={ (ev)=>handleToolbarSelection(ev, 'json') } className={ activeTool === 'json' ? `active` : '' } data-zel="builder"><h2 data-zel="builder">JSON</h2></button>
				<button onClick={ (ev)=>handleToolbarSelection(ev, 'dig') } className={ activeTool === 'dig' ? `active` : '' } data-zel="builder"><img src={ compileIcon } alt="Compile Icon" data-zel="builder"/></button>
				<button onClick={ (ev)=>handleToolbarSelection(ev, 'download') } data-zel="builder"><img src={ downloadIcon } alt="Download Icon" data-zel="builder"/></button>
				
			</div>

			{/* <div className={ `JSON-Builder-Handle-Right` } onMouseDown={ handleStartResize } data-rh="right"></div> */}
			<div className={ `JSON-Container viewer ${ activeTool === 'dig' ? `active` : '' }` } data-zel="builder">
					{ rawComponents }
			</div>
			<div className={ `JSON-Container viewer ${ activeTool === 'json' ? `active` : '' }` } data-zel="builder">
				<pre data-zel="builder">
					{ rawjson }
				</pre>
			</div>
			<div className={ `JSON-Container ${ activeTool === 'edit' ? `active` : '' }` } data-zel="builder">
				<div data-zel="builder">
				{ prepArray }
				</div>
				<div className={ `Controller-Buttons` } data-zel="builder">
					<button onClick={ handleNest } data-zel="builder"><h3 data-zel="builder">{ `{}` }</h3></button>
					<button onClick={ handleNestArray } data-zel="builder"><h3 data-zel="builder">{ `[]` }</h3></button>
					<button onClick={ closeNest } className={ !path[path.length-1]?.type ? 'disabled' : '' } data-zel="builder"><h3 data-zel="builder">{ path[path.length-1]?.type === 'nest' ? `<-{}` : path[path.length-1]?.type === 'array' ? `<-[]` : `<-` }</h3></button>
				</div>
			</div>
			<div className={ `JSON-Builder-Handle-Bottom stripes` } onMouseDown={ handleStartResize } data-rh="bottom" data-zel="builder"></div>
			<div className={ `JSON-Builder-Handle-Left stripes` } onMouseDown={ handleStartResize } data-rh="left" data-zel="builder"></div>
		</div>
	);
}

export default JSONBuilder;