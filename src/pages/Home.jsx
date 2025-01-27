import { useEffect, useState, useCallback } from 'react';
import { Search as SearchIcon, Github, Loader2 } from 'lucide-react';
import { addToHistory } from '../store/searchSlice';
import UserCard from '../components/UserCard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('user');

  const navigate = useNavigate();
  const searchHistory = useSelector((state) => state.search.history);
  const getUserData = useCallback(
    async (query) => {
      const cachedUser = searchHistory.find(
        (user) => user.login?.toLowerCase() === query?.trim()?.toLowerCase()
      );
      if (cachedUser) return cachedUser;

      const response = await fetch(`https://api.github.com/users/${query}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      return data;
    },
    [searchHistory]
  );

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);
      setUser(null);

      try {
        const data = await getUserData(query);
        const userData = {
          created_at: data.created_at,
          avatar_url: data.avatar_url,
          login: data.login,
          name: data.name,
          bio: data.bio,
          followers: data.followers,
          public_repos: data.public_repos,
          html_url: data.html_url,
        };

        setUser(userData);
        dispatch(
          addToHistory({
            ...userData,
            timestamp: Date.now(),
            successful: true,
          })
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        dispatch(
          addToHistory({
            query,
            timestamp: Date.now(),
            successful: false,
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      handleSearch(queryParam);
    } else {
      setQuery('');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, [queryParam, handleSearch]);

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='text-center mb-12'>
        <Github className='h-16 w-16 mx-auto mb-4 text-gray-900' />
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          GitHub Explorer
        </h1>
        <p className='text-xl text-gray-600 mb-8'>
          Search and explore GitHub user profiles
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/?user=${query}`);
          }}
          className='max-w-2xl mx-auto mb-8'
        >
          <div className='flex gap-4'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Enter GitHub username'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
              />
              <SearchIcon className='absolute right-3 top-3.5 h-5 w-5 text-gray-400' />
            </div>
            <button
              type='submit'
              disabled={loading || !query.trim()}
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium'
            >
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8'>
            {error}
          </div>
        )}

        {user && <UserCard user={user} />}
      </div>
    </div>
  );
}
