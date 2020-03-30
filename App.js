import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import Router from './src/scenes/Router';
import RootScene from "./src/components/RootScene";

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

const App = () => (<Provider store={store}><RootScene><Router /></RootScene></Provider>);

export default App;