// zergski content manager
// copying files before processing 
const copycat = 'http://localhost/angryPXL/fs/cat.php';


// just some tools..
const z = {
	console: true,
	display: false,
	log (a,b,c,d,e,f) {

		if ( console ) {
			// console.log(a,b,c,d,e,f);
		}
	},
}

export var _data = [];

// const _evilcook = {
// TEMP
const _evilcook = {
	/**
	 * @param {boolean} [ log ] : well, display the console log ofcourse 
	 * <p>  
	 * @param {string , null} [ baseUrl ] : set if you have defined a 'baseUrl' in your jsconfig.json. setting to 'src is very handy, is recommended and will simply remove all './' from imports. null will replace them with '../' and is the simplest solution. if a custom 'url' is set, keep in mind to define the child directory ( i.e if set to 'src', but all your imports go through 'src/components', set baseUrl to 'components'.)
	 * </p>
	 */
	components: {
		loaded: {
			index: '.js',
		},
		collection: [],
		count: 0,
	},
	options: {
		log: true,
		baseUrl: 'src',
	},
}
const { baseUrl } = _evilcook.options;
_evilcook.options.importPath = baseUrl === 'src' ? "'" : baseUrl === null ? "'../" : `'${baseUrl}/` ;

window.cook = _evilcook;

/**
 * We make copies of all imported and used components
 * @param {Array} list 
 */
export async function _zcmStart( list=Polly ) {

	const response = await fetch(
		copycat,
		{
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(list),
		}
	);
	const { log, content } = await response.json();

	_evilcook.options.log && log.forEach( entry => console.log(entry));
	
	content.forEach( ( component, index ) => {
		_evilcook.components.collection.push(component);
		_evilcook.components.count++;
		
		_processComponent( content, component, index );
	});
}






async function _processComponent ( content, component, index ) {
	// let { importPath } = _evilcook.options;
	let { rawComponent } = content[index].data;
	let { loaded } = _evilcook.components;


	// just tested by removing comments
	z.log(rawComponent);
	rawComponent = rawComponent.replace(/\B{\/\*\B[\s\S]*\B\*\/}\B/g, '');
	rawComponent = rawComponent.replace(/\B\/\/.*\n/g, '');


	let matches = rawComponent.match(/\B<[A-Z].*\/>\B/g)?.map( res => res.replace(/<|\s+|\/+|>+/g, ''));
	
	let routes = rawComponent.match(/\B<Route.*\/>\B/g)?.map( res => { return res.replace(/^.+{ | }.+$/g, '') });
	let imports = rawComponent.split('import');
	// let body = imports.pop();
	// let variables = splitByVariables(body);
	let componentPath = [];
	matches || ( matches = [matches] );
	let keys = [];
	if ( routes ) {
		keys = [ ...routes, ...keys ];
	}
	if ( matches[0] ) {
		let check = [];
		matches.forEach( match => {
			if ( match !== undefined ) {
				if ( loaded[ match ] === match ) {
					z.log( match, 'already processed' );
				} else {
					check.push( match );
				}
			}
		});

		check[0] && ( keys = [ ...check, ...keys ] );
	}



	imports.forEach( line =>
		keys?.forEach( key => {

			if ( line.includes(key) ) {
				loaded[ key ] = key;
				componentPath.push( line.match(/'.+'|".+"/g)[0].replace(/\.+|"+|'+/g, '').split('/') );
			} else {
				return;
			}
	}));

	Polly.catArray = [];
	filePath = {};
	componentPath.forEach( c => {
		if ( loaded[ c[0] ]?.includes(c[1]) ) {
			console.log( c[1], 'repeated');
		} else {
			// console.log(c);
			c[0] === '' && c.shift();
			filePath = { file: c.pop(), path: c.join('/') === '' ? 'root' : c.join('/') }
			Polly.catArray.push( filePath );
		}
	})




	_data.push(content);
	Polly.catArray[0] && _zcmStart( Polly );
}

// we start with index.js
let filePath = {};
var Polly = { catArray: [ { file: 'index', path: 'root' }]};

