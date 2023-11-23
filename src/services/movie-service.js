export default class MovieService {
  async createSession() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMTA2ZjY0ZThkNmFkOTBkMGFhNTEwYzc3OWI1YWE1OSIsInN1YiI6IjY1MzYzMGUwYzhhNWFjMDBhYzM5YmY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wV2HsmduYqHxA6ouzxNOC0KJBc8UF25-fG80quW15Go',
      },
    };

    const session = await fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=b106f64e8d6ad90d0aa510c779b5aa59',
      options
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
    return session.guest_session_id;
  }

  async searchMovie(query, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMTA2ZjY0ZThkNmFkOTBkMGFhNTEwYzc3OWI1YWE1OSIsInN1YiI6IjY1MzYzMGUwYzhhNWFjMDBhYzM5YmY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wV2HsmduYqHxA6ouzxNOC0KJBc8UF25-fG80quW15Go',
      },
    };
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=b106f64e8d6ad90d0aa510c779b5aa59&include_adult=true&language=en-US&page=${page}`,
      options
    ).catch((err) => console.error(err));
    const parsedResult = await result?.json();
    return parsedResult;
  }

  rateMovie(sessionId, rating, movieId) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer b106f64e8d6ad90d0aa510c779b5aa59',
      },
      body: `{"value":${rating}}`,
    };
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=b106f64e8d6ad90d0aa510c779b5aa59`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  async getRatedMovies(sessionId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer b106f64e8d6ad90d0aa510c779b5aa59',
      },
    };

    const result = await fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=b106f64e8d6ad90d0aa510c779b5aa59&language=en-US&page=1&sort_by=created_at.asc`,
      options
    ).catch((err) => console.error(err));

    const parsedResult = await result?.json();
    return parsedResult;
  }

  async getGenres() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer b106f64e8d6ad90d0aa510c779b5aa59',
      },
    };

    const genres = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=b106f64e8d6ad90d0aa510c779b5aa59',
      options
    );
    const parsedGenres = await genres.json();
    return parsedGenres.genres;
  }
}
