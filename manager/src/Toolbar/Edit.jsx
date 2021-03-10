import React, { useEffect } from 'react';
import './Edit.css';

// logic
import { rollBackChanges, saveData, _gc, fetchJSON, useController } from 'logic/zcm.js';

// components
import Button from 'shared/Button';

//icons
import saveIcon from 'ass/vector/icons/files/save.svg';
import cancelIcon from 'ass/vector/icons/files/cancel.svg';
import historyIcon from 'ass/vector/icons/files/history.svg';
import simpleSpinner from 'ass/vector/icons/files/simple_spinner.svg';
import closeIcon from 'ass/vector/icons/files/cross.svg';

const icons = [
  { icon: historyIcon },
  { icon: simpleSpinner },
  { icon: closeIcon },
];


const saveContentChanges = () => {
  _gc.toolbar.dispatch('saveData');
  saveData();
}

const handleRevertData = event => {
  _gc.toolbar.saved = false;
  _gc.toolbar.dispatch(Date.now());
  fetchJSON(`history/${ event.currentTarget.dataset.historyentry }`, { backup: false }).then(() => {
    _gc.content.reload();
  });
}

let historyEntries = [];
const fetchHistory = async () => {
  await fetchJSON('HistoryTextContent').then(result => {
    historyEntries = [];
    result.forEach(e => {
      historyEntries.unshift(
        <div className={ `History-Entry` } key={ e['time_stamp'] } data-historyentry={ e['file_name'] } onMouseDown={ handleRevertData }>
          <h5>{ e['human_date'] }</h5>
        </div>
      )
    });
  });
}

const revertContentChanges = () => {
  rollBackChanges();
  _gc.toolbar.saved = true;
  _gc.toolbar.dispatch(Date.now());
  _gc.content.reload();
}

const EditToolbar = () => {
  const [ state, setState ] = useController(null, 'toolbar');

  icons[0].display = !/loadHistory|displayHistory/g.test(state);
  icons[1].display = /loadHistory/.test(state);
  icons[2].display = /displayHistory/g.test(state);

  const showHistory = () => {
    setState('loadHistory');
    fetchHistory().then(() => setState('displayHistory'));
  }
  const hideHistory = () => {
    setState(null);
  }

  // useEffect(()=>{
  // }, []);

	return(
		<div className={ `Edit-Toolbar ${ !icons[0].display ? `Show-History` : '' }` }>
      <div className={ `History-List` }>
        <img className={ !icons[1].display ? 'hidden' : '' } src={ simpleSpinner } alt={ `Loading spinner` } />
        { historyEntries }
      </div>
      <Button altClass={ `Toolbar-Button` }
        imgSrc={ icons }
        imgDesc={ `History list, close, loading spinner icons` }
        clicked={ icons[2].display ? hideHistory : showHistory }
        onblur={ hideHistory }
      />
      <Button altClass={ `Toolbar-Button ${ _gc.toolbar.saved ? 'disabled' : '' }` }
        imgSrc={ cancelIcon }
        imgDesc={ `Revert unsaved changes icon` }
        clicked={ revertContentChanges }
      />
      <Button altClass={ `Toolbar-Button ${ _gc.toolbar.saved ? 'disabled' : '' }` }
        imgSrc={ state === 'saveData' ? simpleSpinner : saveIcon }
        imgDesc={ `Save Icon` }
        clicked={ saveContentChanges }
      />
		</div>
	);
}

export default EditToolbar;