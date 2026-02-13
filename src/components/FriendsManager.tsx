import React, { useContext, useState } from 'react';
import { FriendsContext } from '../context/FriendsContext';

export default function FriendsManager() {
  const { friends, addFriend, removeFriend } = useContext(FriendsContext);
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addFriend(name.trim());
      setName('');
    }
  };

  return (
    <div className="friends-manager">
      <h2>Friends</h2>
      <form onSubmit={handleAdd} className="friends-form">
        <div className="input-group">
          <input
            className="input"
            placeholder="Friend's name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add Friend</button>
        </div>
      </form>
      {friends.length === 0 ? (
        <p className="empty-state">No friends added yet. Add friends to start splitting bills!</p>
      ) : (
        <ul className="friends-list">
          {friends.map(friend => (
            <li key={friend.id} className="friend-item">
              <span className="friend-name">{friend.name}</span>
              <button 
                type="button" 
                onClick={() => removeFriend(friend.id)}
                className="btn btn-danger btn-sm"
                aria-label={`Remove ${friend.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 