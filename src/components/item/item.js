import React from 'react';
import { Rate } from 'antd';
import { format, parseISO } from 'date-fns';

import ErrorComponent from '../error_component/error-component';
import Spiner from '../spiner/spiner';
import MovieService from '../../services/movie-service';
import { Consumer } from '../../services/movie-service-context/movie-service-context';
import errorIcon from '../error_component/error_icon.jpg';
import './item.css';

export default class Item extends React.Component {
  state = {
    image: '',
    loading: true,
    page: 1,
  };
  MovieService = new MovieService();
  async getImage() {
    try {
      let imageUrl;
      if (
        this.props.movie.poster_path !== null &&
        this.props.movie.poster_path !== undefined
      ) {
        imageUrl = await fetch(
          `https://image.tmdb.org/t/p/w500${this.props.movie.poster_path}`
        );
        this.setState({
          image: imageUrl.url,
          loading: false,
        });
      } else {
        this.setState({
          image: errorIcon,
          loading: false,
        });
      }
    } catch (e) {
      this.setState({
        image: errorIcon,
        loading: false,
      });
    }
  }

  rateCompare = (rate) => {
    if (rate >= 0 && rate <= 3) return 'rating worst-rating';

    if (rate > 3 && rate <= 5) return ' rating bad-rating';

    if (rate > 5 && rate <= 7) return 'rating good-rating';

    if (rate > 7) return 'rating perfect-rating';
  };

  onRateHolder = (rating) => {
    const { movie, sessionId } = this.props;
    this.MovieService.rateMovie(sessionId, rating, movie.id);
  };

  componentDidMount() {
    this.getImage();
  }
  render() {
    const { movie } = this.props;
    const { image, loading } = this.state;
    function descriptionSlice(str, maxLen = 180) {
      if (movie.title.length > 20) {
        maxLen = 160;
      }
      if (movie.title.length > 40) {
        maxLen = 140;
      }
      if (str.length <= maxLen) return str;
      return str.substr(0, str.lastIndexOf(' ', maxLen));
    }

    function createGenresElements(genres) {
      const movieGenresNames = movie?.genre_ids?.map((genreId) => {
        for (let genre of genres) {
          if (genreId === genre.id) return genre.name;
        }
        return null;
      });
      const genresElements = movieGenresNames?.map((genreName) => (
        <div className='genre'>{genreName}</div>
      ));
      if (movie.genre_ids.length === 0)
        return <div className='genre'>No data for genres</div>;
      return genresElements.slice(0, 3);
    }
    return (
      <Consumer>
        {(genres) => {
          return (
            <div className='card'>
              {loading ? (
                <Spiner />
              ) : (
                <img
                  className='image-wrapper'
                  alt='movie preview'
                  src={image}
                ></img>
              )}

              <div className='description-wrapper'>
                <div className='card-title-wrapper'>
                  <h2 className='card-title'>{movie.title}</h2>
                  <div
                    className={this.rateCompare(movie.vote_average?.toFixed(1))}
                  >
                    {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
                <span className='relising-date'>
                  {movie.release_date
                    ? format(parseISO(movie?.release_date), 'MMMM d, y')
                    : 'unknown release date'}
                </span>
                <div className='genres-wrapper'>
                  {createGenresElements(genres)}
                </div>
                <div className='card-description'>
                  {descriptionSlice(movie.overview) + '...'}
                </div>
                <div className='user-rate'>
                  <Rate
                    defaultValue={movie.rating}
                    count={10}
                    className='rate'
                    onChange={(rating) => this.onRateHolder(rating)}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
