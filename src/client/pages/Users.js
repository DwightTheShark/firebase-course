import React from 'react';
import { Helmet } from 'react-helmet';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { USERS } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import LoadingError from '../components/LoadingError';
import { useUser } from '../components/user-context';
import Card from '../components/Card';
import UserCard from '../components/UserCard';

const Users = () => {
  const { user } = useUser();
  const db = firebase.firestore();

  const [userDocs, loading, error] = useCollectionData(db.collection(USERS), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });


  return (
    <>
      <Helmet>
        <title>Users - React & Firebase Starter</title>
        <meta
          name="description"
          content="This is a default page from React & Firebase Starter. Change this content by editing Users.js."
        />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <main>
        <Card>
          <h1 className="text-2xl leading-6 font-medium text-gray-900">
            Meet other users
          </h1>
        </Card>

        <LoadingError data={userDocs} loading={loading} error={error}>
          {!userDocs?.length ? (
            <Card>
              <p className="mt-2 max-w-xl text-sm text-gray-700">
                No one here yet 👀
              </p>
            </Card>
          ) : (
            <ul className="space-y-4 lg:items-start pb-12">
              {userDocs.map((userDoc) => (
                <UserCard
                  key={`user-${userDoc.uid}`}
                  userDoc={userDoc}
                  isCurrentUser={user.uid === userDoc.uid}
                />
              ))}
            </ul>
          )}
        </LoadingError>
      </main>
    </>
  );
};

export default Users;