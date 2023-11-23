import React from 'react';
import { Pagination } from 'antd';

import './pagination-bar.css';

export default class PaginationBar extends React.Component {
  render() {
    const { onChange, pageTotal } = this.props;
    const onPaginationChange = (page) => {
      onChange(page);
    };

    return (
      <div className='pagination-bar'>
        <Pagination
          defaultCurrent={1}
          total={pageTotal}
          onChange={onPaginationChange}
        />
      </div>
    );
  }
}
