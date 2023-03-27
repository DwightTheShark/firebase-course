import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { USERS, updateUser } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import { useUser } from '../components/user-context';
import LoadingError from '../components/LoadingError';
import Card from '../components/Card';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const { user } = useUser();
  const { uid } = useParams();

  const db = firebase.firestore();

  const [userDoc, loading, error] = useDocumentData(
    db.collection(USERS).doc(uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const submitPermissionsChange = () => {
    if (uid === user.uid) {
      if (!window.confirm('Are you sure you want to change your own permissions? This could cause problems.')) {
        return;
      }
    }
    updateUser(uid, { isAdmin: userDoc.isAdmin });
  };


  // Check if current user is an admin
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    if (user) {
      db.collection(USERS)
        .doc(user.uid)
        .get()
        .then((currentUser) => setAdminMode(currentUser.data().isAdmin));
    }

  }, []);

  return (
    <main>
      <Card>
        <h1 className="text-2xl leading-6 font-medium text-gray-900">
          {`Edit ${userDoc?.uid === user.uid ? 'your' : 'user'} profile`}
        </h1>
      </Card>

      <LoadingError data={userDoc} loading={loading} error={error}>
        {userDoc && (
          <>
            <Card>
              <ProfileForm
                userDoc={userDoc}
                isCurrentUser={userDoc.uid === user.uid}
                adminMode={adminMode}
              />
            </Card>
          </>
        )}
        {userDoc && adminMode && (
          <Card>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Adminstrator Options
                </h3>
                <p className="mt-1 text-md text-gray-500">User permissions</p>
                <div className="flex justify-between items-center my-2 h-5">
                  <label
                    htmlFor="item"
                    className="flex items-center text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      onChange={() => { userDoc.isAdmin = !userDoc.isAdmin}}
                      defaultChecked={userDoc.isAdmin}
                      className="mr-3 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    Is Admin
                  </label>
                </div>
              </div>
              <div className="pt-5 flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => submitPermissionsChange()}
                >
                  Save
                </button>
              </div>
            </div>
          </Card>
        )}
      </LoadingError>
    </main>
  );
};

export default Profile;