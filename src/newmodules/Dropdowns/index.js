import React, { Component, PureComponent } from 'react';
import { Dropdown, Menu, Button, Icon } from 'antd';
import _ from 'lodash';

export default class DaoDropdown extends Component {
  constructor(props) {
    super(props);

    // this.menu = this.generateMenu(props.menu);

    this.state = {
      dropdownTitle: props.title ? props.title : 'Dropdown',
    };
  }

  generateMenu = (menuData) => {
    const menuItems = _.map(menuData, (menuItemData, index) => (<Menu.Item key={index} value={index}> {menuItemData} </Menu.Item>));

    // 必须分行，Don't ask me why
    return (
            <Menu onClick={this.handleMenuClick}>
              {menuItems}
            </Menu>
          );
  };

  handleMenuClick = (e) => {
    const index = parseInt(e.key, 10);
    this.setState({
      dropdownTitle: this.props.menu[index],
    });

    this.props.handleMenuClick && this.props.handleMenuClick({ index:index, title:  this.props.menu[index] });
  };

  render() {
    return (
      <Dropdown.Button style={this.props.style} overlay={this.generateMenu(this.props.menu)}>
        {this.state.dropdownTitle}
      </Dropdown.Button>
    );
  }
};

// trigger={['click']}>
