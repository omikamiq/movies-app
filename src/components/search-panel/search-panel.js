import React from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';

import './search-panel.css';

export default class SearchPanel extends React.Component {
  render() {
    const { onSearch, value } = this.props;
    const handleChange = debounce((event) => {
      onSearch(event.target.value);
    }, 1500);
    return (
      <form className='search-panel'>
        <Input
          type='text'
          placeholder='Type to search...'
          onChange={handleChange}
          defaultValue={value}
        />
      </form>
    );
  }
}
