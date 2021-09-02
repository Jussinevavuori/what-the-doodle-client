import { Route, Switch } from 'react-router';
import { Home } from './components/Home/Home';
import { HooksRoot } from './components/HooksRoot/HooksRoot';
import { PopupGraphicMessageCenter } from './components/PopupGraphicMessageCenter/PopupGraphicMessageCenter';
import { Room } from './components/Room/Room';
import { RoomSocketContextProvider } from './contexts/RoomSocketContext';
import { Routes } from './routes';

function App() {
	return (<>
		<HooksRoot />
		<div className="App">
			<Switch>
				<Route path={Routes.room.path}>
					<RoomSocketContextProvider>
						<Room />
					</RoomSocketContextProvider>
				</Route>
				<Route path={Routes.home.path}>
					<Home />
				</Route>
			</Switch>
		</div>
		<PopupGraphicMessageCenter />
	</>
	);
}

export default App;
