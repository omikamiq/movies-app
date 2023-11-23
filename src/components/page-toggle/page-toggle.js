import React from 'react';
import { Tabs } from 'antd';

import './page-toggle.css';

export default class PageToggle extends React.Component {
  render() {
    const { onClick } = this.props;
    const onTabsClick = (e) => {
      onClick(e);
    };
    const items = [
      {
        label: 'Search',
        key: 'Search',
      },
      {
        label: 'Rated',
        key: 'Rated',
      },
    ];
    return (
      <div className='page-toggle'>
        <Tabs
          className='tabs'
          destroyInactiveTabPane
          defaultActiveKey='Rated'
          size='large'
          items={items}
          onTabClick={onTabsClick}
        />
      </div>
    );
  }
}
