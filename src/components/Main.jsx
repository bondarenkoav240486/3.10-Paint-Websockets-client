// import './App.css';
import Toolbar from "./Toolbar";
import SettingBar from "./SettingBar";
import Canvas from "./Canvas";
// import toolState from "./store/toolState";
// import Tool from "./tools/Tool";
// import canvasState from "./store/canvasState";


function App() {

    return (
        <div className="App">
            <header>
                <Toolbar />
                <SettingBar />
            </header>
            <Canvas />
        </div>
    );
}

export default App;


