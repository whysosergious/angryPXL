import { useState } from 'react';

const cmsroot = 'http://localhost/angrypxl/';
export const approot = 'http://localhost/angrypxl/apps/';
export const targetApp = 'testapp';
const dataUrl =  `${ approot }${ targetApp }/data/`;


export const fetchJSON = async (fileName, { fileExt='.json', backup=true } = {}) => {

  let result = null;
  let filePath = `${ dataUrl }${ fileName }${ fileExt }`;
  await fetch(filePath
  ,{
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  })
    .then(function(response){
      // console.log(response)
      return response.json();
    })
    .then(function(myJson) {
      // /(?!History)^(TextContent)/g     // useful.. match second group with negative lookahead ( needed the lookbehind )
      if ( /(?<!History)(TextContent)/g.test(fileName) ) {
        _gc.textContent = myJson;
        backup && (_gc.textBackup = JSON.parse(JSON.stringify(_gc.textContent)));
      } else {
        result = myJson;
      }
    }).catch(err => { console.log(err) });
  return result;
}

const postData = async (contentData) => {
  const response = await fetch(
    `${ cmsroot }fs/fw.php`,
    {
      method: "POST",
      headers: {
            'Content-Type': 'application/json',
          },
      body: JSON.stringify(contentData),
    }
  ).catch(err => { console.log(err) });

  await response.text();
}

export const uploadFiles = async fileData => {
// console.log(fileData);
  const response = await fetch(
    `${ cmsroot }fs/fu.php`,
    {
      method: "POST",
      body: JSON.stringify(fileData),
    }
  ).catch(err => { console.log(err) });

  return await response.text();
}

export const deleteFiles = async fileData => {
  // console.log(fileData);
    const response = await fetch(
      `${ cmsroot }fs/fd.php`,
      {
        method: "POST",
        body: JSON.stringify(fileData),
      }
    ).catch(err => { console.log(err) });
  
    return await response.text();
  }

export const rollBackChanges = () => {
  _gc.textContent = JSON.parse(JSON.stringify(_gc.textBackup));
}
export const saveData = () => {
  _gc.textBackup = JSON.parse(JSON.stringify(_gc.textContent));
  postData(_gc.textContent).then(() => {
    _gc.toolbar.saved = true;
    _gc.toolbar.dispatch(Date.now());
  });
}

// global controller
export var _gc = {
  textContent: {},
  textBackup: {},
  toolbar: {
    saved: true,
  },
}



// constructor for _gc entries
class Controller {
  constructor(state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
  }
}

/**
 * 
 * @param {*} initVal | Initial state value
 * @param {*} nest | _gc object position
 * @returns custom hook ( [ state, dispatch ] )
 */
export const useController = (initVal=null, nest={ components: {} }) => {
  const [ state, setState ] = useState(initVal);
  const hook = new Controller(state, setState);
  _gc[nest] = _gc[nest] || {};
  Object.assign(_gc[nest], hook);

  return [ hook.state, hook.dispatch ];
}



