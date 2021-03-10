import './App.css';
import './AppGeneral.css';
import './typography.css';
import {
	BrowserRouter as Router,
	Route,
	Redirect
} from "react-router-dom";

// components
import Dash from 'Pages/Dash';
import Content from 'Pages/Content';
import Media from 'Pages/Media';
import Users from 'Pages/Users';
import Navigation from 'Navigation/index';


const App = () => {
  return (
    <div className="App">
			
			<Router>
				<Navigation />
				<Route exact path="/">
						<Redirect to="/dash" />
				</Route>
				<Route path="/dash" component={ Dash } />
				<Route path="/content" component={ Content } />
				<Route path="/media" component={ Media } />
				<Route path="/users" component={ Users } />
			</Router>
    </div>
  );
}

export default App;
