import './App.css';
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
// import toolState from "./store/toolState";
// import Tool from "./tools/Tool";
// import canvasState from "./store/canvasState";

import Main from "./components/Main";

import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    Routes,
    Navigate
} from 'react-router-dom'


function App() {

    return (
        <BrowserRouter>

            <div className="App">
                <Routes>
                    {/* <Route path='/:id' />/ */}
                    <Route path='/:id' element={<Main />}/>
                    {/* <div>
                            <header>
                                <Toolbar />
                                <SettingBar />
                            </header>
                            <Canvas />
                        </div> */}
                    {/* <Redirect to={`f${(+new Date).toString(16)}`} /> */}
                    <Route path="/" element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;

{/* <BrowserRouter>
    <div className="app">
        <Switch>
            <Route path='/:id'>
                <Toolbar />
                <SettingBar />
                <Canvas />
            </Route>
            <Redirect to={`f${(+new Date).toString(16)}`} />
        </Switch>
    </div>
</BrowserRouter> */}
