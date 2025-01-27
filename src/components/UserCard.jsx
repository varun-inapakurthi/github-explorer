import { Users, BookOpen, Calendar } from 'lucide-react';

export default function UserCard({ user }) {
  const joinDate = new Date(user.created_at).toLocaleDateString();
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6'>
        <img
          src={user.avatar_url}
          alt={user.login}
          className='w-24 h-24 rounded-full'
        />
        <div className='flex-1 text-center md:text-left'>
          <h2 className='text-2xl font-bold text-gray-900'>
            {user.name || user.login}
          </h2>
          <p className='text-gray-600'>@{user.login}</p>
          {user.bio && <p className='mt-2 text-gray-700'>{user.bio}</p>}

          <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='flex items-center justify-center md:justify-start text-gray-700'>
              <Users className='h-5 w-5 mr-2' />
              <div>
                <div className='font-medium'>{user.followers}</div>
                <div className='text-sm text-gray-500'>Followers</div>
              </div>
            </div>
            <div className='flex items-center justify-center md:justify-start text-gray-700'>
              <BookOpen className='h-5 w-5 mr-2' />
              <div>
                <div className='font-medium'>{user.public_repos}</div>
                <div className='text-sm text-gray-500'>Repositories</div>
              </div>
            </div>
            <div className='flex items-center justify-center md:justify-start text-gray-700'>
              <Calendar className='h-5 w-5 mr-2' />
              <div>
                <div className='font-medium'>{joinDate}</div>
                <div className='text-sm text-gray-500'>Joined</div>
              </div>
            </div>
          </div>

          <div className='mt-6'>
            <a
              href={user.html_url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
