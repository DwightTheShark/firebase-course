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


  const handleAdminChange = (e) => {
    if(userDoc == null || userDoc === undefined) return;
    if (uid === user.uid) {
      if (!window.confirm('Are you sure you want to change your own admin status? This could cause problems.')) {
        e.target.checked = !e.target.checked;
        return;
      }
    }
    updateUser(uid, { isAdmin: e.target.checked });
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
        {adminMode && (
          <Card>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Adminstrator Options
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Change user permissions.
                </p>
                <label htmlFor="admin-checkbox">
                  <input
                    id="admin-checkbox"
                    type="checkbox"
                    defaultChecked={userDoc?.isAdmin || false}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    onChange={handleAdminChange}
                  />
                  <span className="ml-2 text-sm leading-5 text-gray-900">
                    Is Admin
                  </span>
                </label>
              </div>
            </div>
          </Card>
        )}
      </LoadingError>
    </main>
  );
};

export default Profile;