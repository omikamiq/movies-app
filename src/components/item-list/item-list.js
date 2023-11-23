import React from 'react';
import MovieService from '../../services/movie-service';
import Item from '../item/item';
import ErrorComponent from '../error_component/error-component';
import { Spin, Empty } from 'antd';

import './item-list.css';

export default class ItemList extends React.Component {
  MovieService = new MovieService();

  state = {
    movies: [],
    loading: false,
    error: false,
    tip: true,
  };

  componentDidMount() {
    if (this.props.value) this.updateItemList(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.value !== this.props.value ||
      prevProps.page !== this.props.page
    )
      this.updateItemList(this.props.value);
  }

  updateItemList(value) {
    if (!value) return;
    const { onItemListUpdated } = this.props;
    try {
      this.setState({
        loading: true,
        tip: false,
      });
      this.MovieService.searchMovie(value, Math.ceil(this.props.page / 2)).then(
        async (answer) => {
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
          const ratedObj = await this.MovieService.getRatedMovies(
            this.props.sessionId
          );
          const ratedArr = ratedObj.results;
          const finalArr = answer.results?.map((movie) => {
            for (let ratedMovie of ratedArr) {
              if (movie.id === ratedMovie.id) return ratedMovie;
            }
            return movie;
          });
          this.setState({
            movies: finalArr,
            loading: false,
          });
        }
      );
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
    const { loading, error, tip } = this.state;

    const { page, sessionId } = this.props;

    const elements = this.state.movies?.map((movie) => {
      return (
        <Item movie={movie} page={page} sessionId={sessionId} key={movie.id} />
      );
    });

    const hasData = !(loading || error);
    const errorMessage = error ? <ErrorComponent /> : null;
    const spiner = loading ? <Spin size='large' className='spin' /> : null;
    const tipRender = tip ? (
      <Empty className='tip' description='Waiting you to type something...' />
    ) : null;
    return (
      <section className='item-list'>
        {errorMessage}
        {spiner}
        {tipRender}
        {hasData && this.paginate(page, elements)}
      </section>
    );
  }
}
