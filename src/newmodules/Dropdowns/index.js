import React, { Component, PureComponent } from 'react';
import { Dropdown, Menu, Button, Icon } from 'antd';
import _ from 'lodash';

export default class DaoDropdown extends Component {
  constructor(props) {
    super(props);

    this.menu = this.generateMenu(props.menu);

    this.state = {
      dropdownTitle: 'Dropdown'
    };
  }

  generateMenu = (menuData) => {
    const menuItems = _.map(menuData, (menuItemData) => (<Menu.Item key={_.uniqueId()}> {menuItemData} </Menu.Item>));

    // 必须分行，Don't ask me why
    return (
            <Menu onClick={this.handleMenuClick}> 
              {menuItems}
            </Menu>
          );
  };

  handleMenuClick = (e) => {
    const index = parseInt(e.key, 10) - 1;
    this.setState({dropdownTitle: this.props.menu[index]});

    this.props.handleMenuClick && this.props.handleMenuClick(e);
  };

  render() {
    return (
      <Dropdown.Button overlay={this.menu}>
        {this.state.dropdownTitle}
      </Dropdown.Button>
    );
  }
};

// trigger={['click']}> 