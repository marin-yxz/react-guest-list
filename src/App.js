import './App.css';
import React, { useEffect, useState } from 'react';
import { deleteAll, deleteOneUser, postGuests, UpdateUser } from './functions';

const baseUrl = 'http://localhost:4000';
function App() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [guests, setGuests] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      const cleanedUsers = await allGuests.map((user) => {
        return {
          name: user.firstName.first,
          surname: user.lastName.last,
          id: user.id,
          attending: user.attending,
        };
      });
      setGuests(cleanedUsers);
      setInterval(() => {
        setLoading(false);
      }, 2000);
    }
    fetchGuests().catch(() => {
      console.log('fetch fails');
    });
  }, [refetch]);

  const handleClick = () => {
    setInterval(() => {
      setRefetch(!refetch);
    }, 200);
  };
  return loading ? (
    <h1>loading...</h1>
  ) : (
    <div className="App">
      <form>
        <label>
          {' '}
          First Name
          <input
            value={firstname}
            onChange={(event) => {
              setFirstname(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          {' '}
          Last Name
          <input
            value={lastname}
            onChange={(event) => {
              setLastname(event.currentTarget.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                postGuests(firstname, lastname).catch({});
                setFirstname('');
                setLastname('');
                setRefetch(!refetch);
              }
            }}
          />
        </label>
      </form>
      <button
        onClick={() => {
          deleteAll(guests).catch({});
          handleClick();
        }}
      >
        Remove All Users
      </button>
      <div>
        {guests.map((user) => {
          return (
            <React.Fragment key={user.id}>
              <div data-test-id="guest">
                <p>name: {user.name}</p>
                <p>surname: {user.surname}</p>
              </div>
              <button
                aria-label={`Remove ${user.name} ${user.surname}`}
                onClick={() => {
                  deleteOneUser(user.id).catch({});
                  setRefetch(!refetch);
                }}
              >
                {' '}
                Remove
              </button>
              <input
                aria-label={`${user.name} ${user.surname} ${user.attending}`}
                type="checkbox"
                checked={user.attending}
                key={user.id}
                onChange={() => {
                  UpdateUser(user.id, user.attending).catch((err) => {
                    console.log(err);
                  });
                  setRefetch(!refetch);
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default App;
