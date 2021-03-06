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
      setLoading(false);
      const cleanedUsers = await allGuests.map((user) => {
        return {
          name: user.firstName,
          surname: user.lastName,
          id: user.id,
          attending: user.attending,
        };
      });
      setGuests(cleanedUsers);
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
    setFirstname('');
    setLastname('');
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
      <div className="inputArea">
        <label>
          First name
          <input
            disabled={loading ? true : false}
            value={firstname}
            onChange={(event) => {
              setFirstname(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Last name
          <input
            disabled={loading ? true : false}
            value={lastname}
            onChange={(event) => {
              setLastname(event.currentTarget.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                postGuest().catch({});
              }
            }}
          />
        </label>
      </div>
      <button
        onClick={() => {
          deleteAll(guests).catch({});
        }}
      >
        Remove All Users
      </button>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div>
          <div>
            {guests.map((user) => {
              return (
                <React.Fragment key={user.id}>
                  <div data-test-id="guest">
                    <span className="name">
                      {`${user.name} ${user.surname}`}
                    </span>

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
                      aria-label="attending"
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
      )}
    </div>
  );
}

export default App;
