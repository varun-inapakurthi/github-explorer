import { useState, useCallback } from 'react';
import {
  Trash2,
  CheckCircle,
  XCircle,
  CheckSquare,
  Square,
  ChevronDown,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearHistoryItem, clearAllHistory } from '../store/searchSlice';
import UserCard from '../components/UserCard';

export default function History() {
  const searchHistory = useSelector((state) => state.search.history);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemClick = useCallback(
    (item) => {
      if (!item.successful) return;

      if (expandedItem?.id === item.id) {
        setExpandedItem(null);
      } else {
        const user = searchHistory.find((user) => user.id === item.id);
        if (user) {
          setExpandedItem(user);
        }
      }
    },
    [expandedItem, searchHistory]
  );

  if (searchHistory.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600'>No search history yet.</p>
      </div>
    );
  }

  const toggleItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (selectedItems.size === searchHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(searchHistory.map((item) => item.id)));
    }
  };

  const clearSelected = () => {
    selectedItems.forEach((id) => dispatch(clearHistoryItem(id)));
    setSelectedItems(new Set());
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Search History</h2>
        <div className='flex items-center space-x-4'>
          {selectedItems.size > 0 ? (
            <button
              onClick={clearSelected}
              className='px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg'
            >
              Clear Selected ({selectedItems.size})
            </button>
          ) : (
            <button
              onClick={() => dispatch(clearAllHistory())}
              className='px-4 py-2 text-sm text-red-600 hover:text-red-700'
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between bg-white p-4 rounded-lg shadow-sm'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={toggleAll}
              className='text-gray-500 hover:text-gray-700'
            >
              {selectedItems.size === searchHistory.length ? (
                <CheckSquare className='h-5 w-5' />
              ) : (
                <Square className='h-5 w-5' />
              )}
            </button>
            <span className='font-medium text-gray-900'>
              {selectedItems.size === 0
                ? 'Select All'
                : `Selected ${selectedItems.size} of ${searchHistory.length}`}
            </span>
          </div>
        </div>

        {searchHistory.map((item) => (
          <div key={item.id}>
            <div
              className='flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer'
              onClick={() => handleItemClick(item)}
            >
              <div className='flex items-center space-x-4'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {selectedItems.has(item.id) ? (
                    <CheckSquare className='h-5 w-5' />
                  ) : (
                    <Square className='h-5 w-5' />
                  )}
                </button>
                {item.successful ? (
                  <CheckCircle className='h-5 w-5 text-green-500' />
                ) : (
                  <XCircle className='h-5 w-5 text-red-500' />
                )}
                <div>
                  <p className='font-medium text-gray-900'>{item.login || item.query}</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                {item.successful && (
                  <ChevronDown className='h-5 w-5 text-gray-400 hover:text-black' />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(clearHistoryItem(item.id));
                  }}
                  className='text-gray-400 hover:text-red-600'
                >
                  <Trash2 className='h-5 w-5' />
                </button>
              </div>
            </div>
            {expandedItem?.id === item.id && (
              <div className='mt-2 mb-4 mx-8'>
                <UserCard user={expandedItem} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
