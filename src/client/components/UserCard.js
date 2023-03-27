import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from './Card';

const UserCard = ({ userDoc, isCurrentUser }) => {
  const history = useHistory();

  const getInitials = (displayName) => {
    if (!displayName) return 'N/a';

    const nameArray = displayName?.split(' ');
    const initialsArray = nameArray.map((name) => name.charAt(0).toUpperCase());

    return initialsArray.join('');
  };

  const initials = getInitials(userDoc.displayName);

  return (
    <Card>
      <li className="relative flex items-center space-x-3">
        <div className="space-y-4 w-full sm:grid sm:grid-cols-6 sm:gap-6 sm:space-y-0 lg:gap-8">
          <div className="h-full w-full sm:col-span-2 lg:col-span-1 flex justify-center items-center">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex justify-center items-center">
              <span>{initials}</span>
            </div>
          </div>
          <div className="sm:col-span-3 text-center sm:text-left">
            <div className="space-y-4">
              <div className="text-lg leading-6 font-medium space-y-1">
                <h3>
                  {userDoc.displayName}
                  {isCurrentUser && (
                    <span className="inline-flex items-center mx-2.5 px-2.5 py-0.5 rounded-full text-xs bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium">
                      You
                    </span>
                  )}
                </h3>
                <p className="text-indigo-600">
                  {userDoc.isAdmin ? 'Admin' : 'User'}
                </p>
              </div>
            </div>
          </div>
          <div className="sm:col-span-1 lg:col-span-2 space-x-4 flex flex-wrap justify-center sm:justify-end items-center">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={() => history.push(`/users/${userDoc.uid}`)}
            >
            Edit
            </button>
          </div>
        </div>
      </li>
    </Card>
  );
};

export default UserCard;