import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('weekly'); // weekly, monthly, allTime

  useEffect(() => {
    // Fetch leaderboard data
    fetchLeaderboardData();
  }, [timeFrame]);

  const fetchLeaderboardData = async () => {
    // Implementation for fetching leaderboard data
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      
      <div className="mb-6">
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="allTime">All Time</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quizzes Completed
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((entry, index) => (
              <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.totalScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.quizzesCompleted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard; 