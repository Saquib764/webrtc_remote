import React from 'react';

import bn from 'utils/bemnames';



import {
	Navbar,
	Nav,
} from 'reactstrap';



const bem = bn.create('header');

class Header extends React.Component {

	constructor(props){
		super(props)

	}


	render() {

		return (
			
			<Navbar light expand style={{backgroundColor: "black", color: "white", height: "70px"}}>
				<Nav navbar>
					<a href="http://saquibalam.com" style={{fontSize: "1.4em", textDecoration: "none", color: "white"}}><b>Saquib</b></a>
						
				</Nav>

				<Nav navbar className={bem.e('nav-right')}>
					<a href='http://saquibalam.com' style={{marginRight: "30px"}}>Profile</a>
				</Nav>
			</Navbar>
		);
	}
}

export default Header;
