import React, { FormEvent, useEffect, useState } from 'react';
import styles from "./Body.module.css";

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  genre: string;
  hourStartProgram: string;
  hourEndProgram: string;
  cabinet: {
    id: number;
    name: string;
    address: string;
  };
  username: string;
  password: string;
  type: string;
}

interface Appointment {
  date: string;
  doctor: {
    address: string;
    cabinet: {
      address: string;
      id: number;
      name: string;
    };
    firstName: string;
    genre: string;
    hourEndProgram: string;
    hourStartProgram: string;
    id: number;
    lastName: string;
    password: string;
    type: string;
    username: string;
  };
  hourEnd: string;
  hourStart: string;
  id: number;
  patient: {
    address: string;
    birthdate: string;
    cnp: string;
    firstName: string;
    genre: string;
    id: number;
    lastName: string;
    phone: string;
  };
}

interface doctime
{
  id:number,
  doctor: Doctor,
  hourStart: string,
  hourEnd: string,
  date: string
}
function Doc() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFree, setIsFree] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [start, setStart] = useState(1);
  const [selectedDate, setSelectedDate] = useState(''); 
  const [doctimes,setDoctimes]=useState<doctime[]>([]);


  const handleClicke = () => {
    setStart(start + 5);
    console.log(start)
  };
  const handleClickRev = () => {
    setStart(start - 5);
    console.log(start)
  };

  useEffect(() => {
    if (doctor) {
      handleDoc();
    }
  }, [doctor]);
  const handleFree=() =>
  {
    setIsFree(!isFree);
    setDoctimes([]);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    setIsSubmitted(true);
    try {
      const response = await fetch(`http://localhost:8082/doctors/user/${username}/${password}`);
      const data = await response.json();
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
  useEffect(() => {
    handleDoc();
    console.log(start);
  }, [start]);
  
  const handleDoc = async () => {
    try {
      const response = await fetch(`http://localhost:8082/appointments/doc/${doctor?.id}/${start}/${start+4}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
   
  };

  async function handleDate(): Promise<void> {
    try {
      const response = await fetch(`http://localhost:8082/doctime/${doctor?.id}/${selectedDate}`);
      const data = await response.json();
      console.log(data);
      setDoctimes(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }
 console.log(selectedDate)
 console.log(doctimes)
  return (
    <body>
      
      {!isSubmitted &&
      <div className={styles.data}> 
      
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <p className={styles.textt}> Login to you accout!</p>
            <input className={styles.casete}
              type="text"
              id="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div >
            <input className={styles.casete}
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submit}>Login</button>
        </form>
        <div className={styles.infoForm}></div>
        </div>
      }
      <div>
        {isSubmitted &&
       <> <button onClick={handleFree} className={styles.free}>  </button>
     {isFree && (
      <div> 
      <div className={styles.data2}> 
  <div className={styles.formular}>
    <div>
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
    <button className={styles.submit} onClick={handleDate}>
      Validate
    </button>
    
    </div><div className={styles.infoForm2}></div>
  </div>
  </div>
)}

{isFree && doctimes && (
  <table className={styles.table}>
    <thead className={styles.lista}>
      <tr>
        <th> </th>
        <th>Start</th>
        <th>End</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(doctimes) &&
        doctimes.map((doctime) => (
          <tr key={doctime.id}>
            <td>Free</td>
            <td>{doctime.hourStart}</td>
            <td>{doctime.hourEnd}</td>
          </tr>
        ))}
    </tbody>
  </table>
)}
        <table className={styles.table}>
            <thead className={styles.lista}>
              <tr>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Date </th>
                <th>Hour Start</th>
                <th>Hour End</th>

              </tr>
            </thead>
            <tbody>
              {Array.isArray(appointments) && appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>
                  <td>{appointment.patient.genre}</td>
                  <td>{appointment.patient.birthdate}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.hourStart}</td>
                  <td>{appointment.hourEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
     {start > 1 && (
    <button onClick={handleClickRev} className={styles.butprev}>Previous Page</button>
          )}
          {appointments.length === 5 && (start===1 &&(
                <button onClick={handleClicke} className={styles.but}>Next Page</button>
)
)}
{appointments.length === 5 && (start>1 &&(
                <button onClick={handleClicke} className={styles.butnext}>Next Page</button>
)
)}
          </>
 }
      </div>
    </body>
  );
}

export default Doc;