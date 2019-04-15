import React from 'react';

import bn from 'utils/bemnames';

import {
  Navbar,
  Nav,
  NavItem,
  NavLink as BSNavLink,
  // UncontrolledTooltip,
  Collapse,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import {
  MdDashboard,
  MdWidgets,
  MdTextFields,
  MdNotificationsActive,
  MdBorderAll,
  MdRadioButtonChecked,
  MdWeb,
  MdStar,
  MdGroupWork,
  MdArrowDropDownCircle,
  MdBrush,
  MdViewDay,
  MdChromeReaderMode,
  MdViewList,
  MdInsertChart,
  MdExtension,
  MdSend,
  MdKeyboardArrowDown,
} from 'react-icons/lib/md';
import FaGithub from 'react-icons/lib/fa/github';

import SourceLink from 'components/SourceLink';

const sidebarBackground = {
  // backgroundImage: 'url("/img/sidebar/sidebar-4.jpg")',
  // backgroundSize: 'cover',
  // backgroundRepeat: 'no-repeat',
  background: "black",
};


const navItems = [
  { to: '/', name: 'dashboard', exact: true, Icon: MdDashboard, role: 'user' },
  { to: '/', name: 'dashboard', exact: true, Icon: MdDashboard, role: 'admin' },
  { to: '/admin/users', name: 'Admin/User', exact: true, Icon: MdDashboard, role: "admin" },
  // { to: '/publisher', name: 'publisher', exact: true, Icon: MdDashboard },
  // { to: '/campaign', name: 'campaign', exact: true, Icon: MdDashboard },
];

const bem = bn.create('sidebar');


class Sidebar extends React.Component {
  constructor(props){
    super(props)
  }

  state = {
    isOpenComponents: true,
    isOpenContents: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    let user_role = 'user'
    let {authenticated, isadmin} = this.props
    if(isadmin)
      user_role = 'admin'
    if(!authenticated){
      return null
    }

    return (
      <aside className={bem.b()} >
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>

          <Nav vertical style={{marginTop: "150px"}}>
            {navItems.map(({ to, name, exact, Icon, role }, index) => {
              if(role != user_role)
                return
              return (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} size="1.5rem" />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            )})}


          </Nav>
        </div>
      </aside>
    );
  }
}

/*
            <SourceLink className="navbar-brand d-flex">
              <img
                src="http://www.plakc.com/images2/black.png"
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">
                SpottLive
              </span>
            </SourceLink>


*/

export default Sidebar;
