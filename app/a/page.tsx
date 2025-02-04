'use client';

import { useSession} from 'next-auth/react';
import { useState, useEffect } from 'react';


function Counter() {
  const [val, setVal] = useState(0);

 

  return (
    <>
    <button  onClick={function on() {setVal(val+1);}}>{val} hello</button>
    <div>

    </div>
    </>

  );
}

interface Users {
  results: {
    name: {
      first: string;
      last: string;
    };
    email: string;
    picture: {
      medium: string;
    };
  }[];
}

export default function A() {
  const [usersData, setUsersData] = useState<Users['results']>([]);
  const { data: session } = useSession();
  //console.log(session);
  
  useEffect(() => {
      fetch('https://randomuser.me/api?results=20')
      .then(data => data.json())
      .then(data => {
        
        console.log(data.results);
        setUsersData(data.results);

      })
      .catch(error => {
        console.error('Error fetching user:', error);
        throw error;
      });
  }, []);

  return (
    <div>
      <button name="myButton" id="btn">Click Me</button>

      <Counter />
      {session?.user?.email} {session?.user?.name} {session?.user?.image} {session?.user?.id}
      
      {/* Display random user data */}
      {usersData.map((user, index) => (
        <div key={index}>
          <h2>Random User</h2>
          <p>Name: {user.name.first} {user.name.last}</p>
          <p>Email: {user.email}</p>
          <img src={user.picture.medium} alt="Random user" />
        </div>
      ))}
    </div>
  );
}
