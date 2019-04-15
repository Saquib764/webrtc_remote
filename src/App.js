// Used- https://reduction-admin.firebaseapp.com/

import React from 'react';

import componentQueries from 'react-component-queries';



import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// layouts
import { Header, Sidebar, Content, Footer } from 'components/Layout';


// pages

import ThreePage from 'pages/ThreePage';
import ControllerPage from 'pages/ControllerPage';

import Page from 'components/Page';


import './styles/reduction.css';

class App extends React.Component {
	constructor(){
		super()
		this.state = {
			loading: false,
			redirect: false,
			redirect_to: "",
		}
	}

	componentWillReceiveProps({ breakpoint }) {
		if (breakpoint !== this.props.breakpoint) {
			this.checkBreakpoint(breakpoint);
		}
	}

	componentWillMount(){

	}

	componentWillUnmount(){
	}


	componentDidMount() {
		this.checkBreakpoint(this.props.breakpoint);

		if(this.state.redirect){
			console.log("Redirect to", this.state.redirect_to)
			return 0
		}

	}


	checkBreakpoint(breakpoint) {
		switch (breakpoint) {
			case 'xs':
			case 'sm':
			case 'md':
				// return this.openSidebar('close');

			case 'lg':
			case 'xl':
			default:
				// return this.openSidebar('open');
		}
	}


	render() {
		let {user} = this.state;
		if(this.state.loading){
			return (
				<Page className="LoadPage">
					<div style={{width: "100%", height: "100%", left: 0, top: 0, position: "fixed", background: "white"}}>
						<img style={{margin: "auto", marginTop: "30vh", display: "block"}} src="/loader.gif" />
					</div>
				</Page>	
			)
		}
		let routes = (
				<Switch>
					<Route exact path="/control"  render={(props) => <ControllerPage {...props}/>}/>
					<Route exact path="/control/:code"  render={(props) => <ControllerPage {...props}/>}/>
					<Route exact path="/"  render={(props) => <ThreePage {...props}/>}/>
					<Route exact path="/:code"  render={(props) => <ThreePage {...props}/>}/>
				</Switch>
			)
		let header = <Header />;
		

		return (
			<HashRouter>
				<main className="cr-app bg-light">
					<Content fluid >
						{header}
						{routes}
						<Footer />
					</Content>
				</main>
			</HashRouter>
		);
	}
}

const query = ({ width }) => {
	if (width < 575) {
		return { breakpoint: 'xs' };
	}

	if (576 < width && width < 767) {
		return { breakpoint: 'sm' };
	}

	if (768 < width && width < 991) {
		return { breakpoint: 'md' };
	}

	if (992 < width && width < 1199) {
		return { breakpoint: 'lg' };
	}

	if (width > 1200) {
		return { breakpoint: 'xl' };
	}

	return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
