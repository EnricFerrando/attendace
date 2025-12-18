import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [hours, setHours] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
        } else {
            fetchStats();
            fetchSubjects();
        }
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/absences/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/subjects');
            setSubjects(data);
            if (data.length > 0) setSelectedSubject(data[0]._id);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAddAbsence = async (e) => {
        e.preventDefault();
        try {
            await api.post('/absences', {
                subjectId: selectedSubject,
                hours: Number(hours),
            });
            setHours('');
            fetchStats(); // Refresh stats
        } catch (error) {
            console.error('Error adding absence:', error);
            alert('Failed to add absence');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-white text-xl font-bold">Attendance Tracker</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-white mr-4">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Section */}
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Attendance Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.subjectId} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">{stat.subject}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stat.percentage > 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {stat.percentage}% Absences
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="relative pt-1">
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                                <div
                                                    style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stat.percentage > 20 ? 'bg-red-500' : 'bg-green-500'
                                                        }`}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 flex justify-between">
                                            <span>Missed: {stat.hoursMissed}h</span>
                                            <span>Total: {stat.totalHours}h</span>
                                        </div>
                                        <div className="mt-2 text-xs font-medium border-t pt-2">
                                            {(() => {
                                                const maxAllowed = stat.totalHours * 0.2;
                                                const remaining = maxAllowed - stat.hoursMissed;
                                                return remaining > 0 ? (
                                                    <span className="text-indigo-600">
                                                        Et queden <strong>{parseFloat(remaining.toFixed(1))}h</strong> fins al 20%
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-bold">
                                                        ⚠️ Has superat el límit del 20%
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Absence Section */}
                <div className="mt-8 px-4 py-6 sm:px-0">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Report an Absence</h3>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Select a subject and enter the number of hours missed.</p>
                            </div>
                            <form onSubmit={handleAddAbsence} className="mt-5 sm:flex sm:items-center">
                                <div className="w-full sm:max-w-xs">
                                    <label htmlFor="subject" className="sr-only">Subject</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                    >
                                        {subjects.map((sub) => (
                                            <option key={sub._id} value={sub._id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:max-w-xs sm:ml-4 sm:mt-0 mt-3">
                                    <label htmlFor="hours" className="sr-only">Hours</label>
                                    <input
                                        type="number"
                                        name="hours"
                                        id="hours"
                                        required
                                        min="1"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Hours"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Add Absence
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
