import React from 'react';
import PageToggle from '../page-toggle/page-toggle';
import SearchPanel from '../search-panel/search-panel';
import ItemList from '../item-list/item-list';
import RatedList from '../rated-list/rated-list';
import PaginationBar from '../pagination-bar/pagination-bar';
import MovieService from '../../services/movie-service';
import { Provider } from '../../services/movie-service-context/movie-service-context';
export default class App extends React.Component {
  state = {
    value: '',
    page: 1,
    tab: 'Rated',
    sessionId: null,
    pageTotal: null,
  };
  MovieService = new MovieService();
  handleInputChange = (value) => {
    this.setState({
      value,
    });
  };
  handlePaginationChange = (page) => {
    this.setState({
      page,
    });
  };
  handleMenuChange = (tab) => {
    this.setState({
      tab,
    });
  };
  handlePageTotal = (pageTotal) => {
    this.setState({
      pageTotal,
    });
  };
  async componentDidMount() {
    this.genres = await this.MovieService.getGenres();
    try {
      const sessionId = await this.MovieService.createSession();
      this.setState({
        sessionId,
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { tab, value, page, sessionId, pageTotal } = this.state;
    return (
      <Provider value={this.genres}>
        <PageToggle onClick={(tab) => this.handleMenuChange(tab)} />
        {tab === 'Search' ? (
          <SearchPanel
            onSearch={(value) => this.handleInputChange(value)}
            value={value}
          />
        ) : null}
        {tab === 'Search' ? (
          <ItemList
            value={value}
            page={page}
            sessionId={sessionId}
            onItemListUpdated={(pageTotal) => this.handlePageTotal(pageTotal)}
          />
        ) : (
          <RatedList
            sessionId={sessionId}
            page={page}
            onItemListUpdated={(pageTotal) => this.handlePageTotal(pageTotal)}
          />
        )}
        <PaginationBar
          pageTotal={pageTotal}
          onChange={(page) => this.handlePaginationChange(page)}
        />
      </Provider>
    );
  }
}
