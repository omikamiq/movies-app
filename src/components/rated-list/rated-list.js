import React from 'react';
import MovieService from '../../services/movie-service';
import Item from '../item/item';
import ErrorComponent from '../error_component/error-component';
import { Spin } from 'antd';

import '../item-list/item-list.css';

export default class RatedList extends React.Component {
  MovieService = new MovieService();

  state = {
    movies: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.updateRatedList(this.props?.sessionId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page)
      this.updateRatedList(this.props?.sessionId);
  }

  updateRatedList(sessionId) {
    const { onItemListUpdated } = this.props;
    try {
      this.setState({
        loading: true,
      });
      this.MovieService.getRatedMovies(sessionId)?.then(async (answer) => {
        onItemListUpdated(answer.total_results);
        if (
          answer.results === undefined ||
          answer.results === null ||
          answer.results.length === 0
        ) {
          this.setState({
            error: true,
            loading: false,
          });
        }
        this.setState({
          movies: answer.results,
          loading: false,
        });
      });
    } catch (err) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  }

  paginate = (page, arr) => {
    let copiedArr = [...arr];
    if (page % 2 !== 0) copiedArr = copiedArr.slice(0, 10);
    else copiedArr = copiedArr.slice(10, 20);
    return copiedArr;
  };

  render() {
    const { loading, error } = this.state;

    const { page, sessionId } = this.props;
    const elements = this.state.movies?.map((movie) => {
      return (
        <Item movie={movie} page={page} sessionId={sessionId} key={movie.id} />
      );
    });

    const hasData = !(loading || error);
    const errorMessage = error ? <ErrorComponent /> : null;
    const spiner = loading ? <Spin size='large' className='spin' /> : null;
    return (
      <section className='item-list'>
        {errorMessage}
        {spiner}
        {hasData && this.paginate(page, elements)}
      </section>
    );
  }
}
