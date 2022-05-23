const baseUrl = 'https://express-api-guest-list.herokuapp.com';
let refetch = '';
export const postGuests = async (first, last) => {
  await fetch(`${baseUrl}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: { first },
      lastName: { last },
      attending: 'false',
    }),
  });
  return (refetch = 'post');
};

export const fetchGuests = async () => {
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
  return cleanedUsers;
};
export const deleteOneUser = async (id) => {
  await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
};
export const deleteAll = async (length) => {
  const guestsCopy = [...length];
  console.log(guestsCopy[0].id);
  for (let i = 0; i <= guestsCopy[guestsCopy.length - 1].id; i++) {
    await fetch(`${baseUrl}/guests/${i}`, {
      method: 'DELETE',
    });
  }
};
export const UpdateUser = async (id, at) => {
  await fetch(`${baseUrl}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: !at }),
  });
};
