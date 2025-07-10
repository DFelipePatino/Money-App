import React, { useContext, useState } from 'react';
import { FriendsContext } from '../context/FriendsContext';

export default function FriendsManager() {
  const { friends, addFriend, removeFriend } = useContext(FriendsContext);
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      addFriend(name.trim());
      setName('');
    }
  };

  return (
    <div className="friends-manager">
      <h2>Manage Friends</h2>
      <input
        placeholder="Friend's name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="button" onClick={handleAdd}>Add</button>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            {friend.name}
            <button type="button" onClick={() => removeFriend(friend.id)} style={{ marginLeft: 8 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 