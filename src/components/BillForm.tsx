import React, { useContext, useState } from 'react';
import { FriendsContext } from '../context/FriendsContext';
import { BillsContext } from '../context/BillsContext';
import { BillSplit } from '../types';

export default function BillForm() {
  const { friends } = useContext(FriendsContext);
  const { addBill } = useContext(BillsContext);
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState('');
  const [payer, setPayer] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<BillSplit[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFriendSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setSelectedFriends(options);
  };

  const handleCustomSplitChange = (name: string, amount: string) => {
    setCustomSplits(splits => {
      const idx = splits.findIndex(s => s.name === name);
      const newSplits = [...splits];
      if (idx >= 0) newSplits[idx] = { name, amount: Number(amount) };
      else newSplits.push({ name, amount: Number(amount) });
      return newSplits;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !total || !payer) return;

    let splits: BillSplit[] = [];

    if (splitType === 'equal') {
      const people = selectedFriends.length > 0 ? selectedFriends : friends.map(f => f.name);
      const share = Number(total) / people.length;
      splits = people.map(name => ({ name, amount: Number(share.toFixed(2)) }));
    } else {
      splits = customSplits.filter(s => s.amount > 0);
      const sum = splits.reduce((a, b) => a + b.amount, 0);
      if (Math.abs(sum - Number(total)) > 0.01) {
        alert('Custom splits must sum to total');
        return;
      }
    }

    addBill({
      id: Date.now().toString(),
      description,
      total: Number(total),
      payer,
      splitType,
      splits,
    });

    setSuccessMessage('New expense added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

    setDescription('');
    setTotal('');
    setPayer('');
    setSplitType('equal');
    setSelectedFriends([]);
    setCustomSplits([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bill-form">
      <h2>Add Expense</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <input
        className="input"
        placeholder="What was paid?"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        className="input"
        placeholder="Total Amount"
        type="number"
        value={total}
        onChange={e => setTotal(e.target.value)}
        required
        min="0.01"
        step="0.01"
      />

      <select
        className="select"
        title="Who paid?"
        value={payer}
        onChange={e => setPayer(e.target.value)}
        required
      >
        <option value="" disabled>Who paid?</option>
        {friends.map(f => (
          <option key={f.id} value={f.name}>{f.name}</option>
        ))}
      </select>

      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            checked={splitType === 'equal'}
            onChange={() => setSplitType('equal')}
          />
          Split Equally
        </label>
        <label className="radio-option">
          <input
            type="radio"
            checked={splitType === 'unequal'}
            onChange={() => setSplitType('unequal')}
          />
          Custom Split
        </label>
      </div>

      {splitType === 'equal' ? (
        <div>
          <label className="select-label">
            Select friends to split with (hold Ctrl/Cmd to select multiple, or leave empty to include all):
          </label>
          <select
            className="select multi-select"
            multiple
            value={selectedFriends}
            onChange={handleFriendSelect}
          >
            {friends.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="custom-split">
          {friends.map(f => (
            <div key={f.id} className="split-row">
              <label>{f.name}:</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={customSplits.find(s => s.name === f.name)?.amount || ''}
                onChange={e => handleCustomSplitChange(f.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-primary submit-btn" type="submit">Add Expense</button>
    </form>
  );
}
