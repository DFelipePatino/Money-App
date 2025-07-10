import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Friend } from '../types';

interface FriendsContextType {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
}

export const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  addFriend: () => {},
  removeFriend: () => {},
});

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const stored = localStorage.getItem('friends');
    return stored ? JSON.parse(stored) : [
      { id: '1', name: 'Daniel' },
      { id: '2', name: 'Jorge' },
      { id: '3', name: 'Jose' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  const addFriend = (name: string) => {
    if (!friends.some(f => f.name === name)) {
      setFriends([...friends, { id: Date.now().toString(), name }]);
    }
  };
  const removeFriend = (id: string) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  return (
    <FriendsContext.Provider value={{ friends, addFriend, removeFriend }}>
      {children}
    </FriendsContext.Provider>
  );
}; 