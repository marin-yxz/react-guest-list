import './App.css';
import React, { useEffect, useState } from 'react';

const baseUrl = 'https://express-api-guest-list.herokuapp.com';
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
          name: user.firstName,
          surname: user.lastName,
          id: user.id,
          attending: user.attending,
        };
      });
      setGuests(cleanedUsers);
      setTimeout(() => {
        setLoading(false);
      }, '1000');
    }
    fetchGuests().catch(() => {
      console.log('fetch fails');
    });
  }, [refetch]);

  //
  //

  const postGuest = async () => {
    await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        attending: 'false',
      }),
    });
    setRefetch(!refetch);
  };

  const deleteOneUser = async (id) => {
    await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
    setRefetch(!refetch);
  };

  const deleteAll = async (length) => {
    const guestsCopy = [...length];
    console.log(guestsCopy[0].id);
    for (
      let i = guestsCopy[0].id;
      i <= guestsCopy[guestsCopy.length - 1].id;
      i++
    ) {
      await fetch(`${baseUrl}/guests/${i}`, {
        method: 'DELETE',
      });
    }
    setRefetch(!refetch);
  };

  const UpdateUser = async (id, at) => {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !at }),
    });
    setRefetch(!refetch);
  };

  return (
    <div className="App">
      <div className="form">
        <label htmlFor={firstname}>First name</label>
        <input
          onChange={(event) => {
            setFirstname(event.currentTarget.value);
          }}
          disabled={loading}
        />

        <label htmlFor={lastname}>Last name</label>
        <input
          onChange={(event) => {
            setLastname(event.currentTarget.value);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              postGuest().catch({});
            }
          }}
          disabled={loading}
        />
      </div>
      <button
        onClick={() => {
          deleteAll(guests).catch({});
        }}
      >
        Remove All Users
      </button>
      {!loading ? (
        <div>
          <div>
            {guests.map((user) => {
              return (
                <React.Fragment key={user.id}>
                  <div data-test-id="guest">
                    <p>name: {user.name}</p>
                    <p>surname: {user.surname}</p>
                    <button
                      aria-label={`Remove ${user.name} ${user.surname}`}
                      onClick={() => {
                        deleteOneUser(user.id).catch({});
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
                      }}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
