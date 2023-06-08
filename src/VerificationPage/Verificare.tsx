import React, { useEffect } from 'react';
import styles from "./Body.module.css";
import { useState } from 'react';
interface Appointment {
  id: number;
  date: string;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    cabinet: {
      address: string;
      id: number;
      name: string;
    };
  };
  patient: {
    id: number;
  };
  hourStart: string;
  hourEnd: string;
}

interface appointmentt
{

  doctor: {
    id: number;
  };
  patient: {
    id: number;
  };
  hourStart: string;
  hourEnd: string;
   date: string;
}
interface Patient {
  id:number;
  firstName: string;
  lastName: string;
  cnp: string;
  genre: string;
  birthdate: string;
  address: string;
  phone: string;
}
function Verificare() {
  const [text, setText] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsChecked, setAppointmentsChecked] = useState<Appointment[]>([]);
  const [appointmentsPossible, setAppointmentsPossible] = useState<Appointment[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [patient, setPatient] = useState<Patient>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
 

  useEffect(() => {
    const storedCNP = localStorage.getItem('cnp');
    if (storedCNP) {
      setText(storedCNP);
      setIsFormSubmitted(true); // Assuming you want to trigger form submission on page refresh as well
    }
  }, []);

  const handleDeleteCNP = () => {
    setText('');
    localStorage.removeItem('cnp');
    window.location.reload();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(text);
    localStorage.setItem('cnp', text);
    setIsFormSubmitted(true);
   
    
    /*
    try {
      const response = await fetch(`http://localhost:8082/appointments/cnp/${text}`);
      const data = await response.json();
      console.log(data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
   
  

    try {
      const response = await fetch(`http://localhost:8082/local-appointments/cnp/${text}`);
      const data = await response.json();
      console.log(data);
      setAppointmentsPossible(data);

    } catch (error) {
      console.error('Error fetching appointments:', error);
    } 
    try {
      const response = await fetch(`http://localhost:8082/chekedappointments/cnp/${text}`);
      const data = await response.json();
      console.log(data);
      setAppointmentsChecked(data);

    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
   */
  } 

  

  useEffect(() => {
    fetch(`http://localhost:8082/patients/cnp/${text}`)
      .then(response => response.json())
      .then(patient => {
        console.log(patient); // Handle the retrieved patient data
        setPatient(patient);
      })
      .catch(error => {
        console.error(error); // Handle any errors that occur during the request
      });
  }, [isFormSubmitted]);

  useEffect(() => {
    const fetchAppointmentsChecked = async () => {
     const storedCNP = localStorage.getItem('cnp');
      if (isFormSubmitted !== null) {
        setTimeout(async () => {
          let url: string = `http://localhost:8082/chekedappointments/cnp/${storedCNP}`;
          const response = await fetch(url);
          const data = await response.json();
          setAppointmentsChecked(data);
          console.log(data);
        }, 1000);
      }
    };
    fetchAppointmentsChecked();
  }, [isFormSubmitted]);

  useEffect(() => {
    const storedCNP = localStorage.getItem('cnp');
    const fetchAppointmentsPossible = async () => {
      if (isFormSubmitted !== null) {
        setTimeout(async () => {
          let url: string = `http://localhost:8082/local-appointments/cnp/${storedCNP}`;
          const response = await fetch(url);
          const data = await response.json();
          setAppointmentsPossible(data);
          console.log(data);
        }, 1000);
      }
    };
    fetchAppointmentsPossible();
  }, [isFormSubmitted]);


  useEffect(() => {
    const fetchAppointments = async () => {
      const storedCNP = localStorage.getItem('cnp');
      if (isFormSubmitted !== null) {
        setTimeout(async () => {
          let url: string = `http://localhost:8082/appointments/cnp/${storedCNP}`;
          const response = await fetch(url);
          const data = await response.json();
          setAppointments(data);
          console.log(data);
        },1000);
      }
    };

    fetchAppointments();
  }, [isFormSubmitted]);

  const handleInsert=(appointment: Appointment) => {
    const appoin: appointmentt=
    {
      doctor: {
        id: appointment.doctor.id
      },
      patient: {
        id: appointment.patient.id
      },
      hourStart:appointment.hourStart ,
      hourEnd: appointment.hourEnd,
      date: appointment.date
    }
    
    fetch('http://localhost:8082/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appoin),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Appointment inserted successfully");
        } else {
          console.log("ceva errori");
        }
      })
      .catch((error) => {
        console.log(error);
      });
      window.location.reload();
  };

  const handleDelete=() => {
    fetch(`http://localhost:8082/local-appointments/patient/${patient?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ })
    })
      .then(response => {
        if (response.ok) {
          console.log('Appointments deleted successfully.');
        
        } else {
          console.error('Error deleting appointments:', response.status);
        }
      })
      .catch(error => {
        console.error('Error deleting appointments:', error);
        
      });
      window.location.reload();
  }
  const handleDeleteCheck=() => {
    fetch(`http://localhost:8082/chekedappointments/patient/${patient?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ })
    })
      .then(response => {
        if (response.ok) {
          console.log('Appointments deleted successfully.');
        
        } else {
          console.error('Error deleting appointments:', response.status);
        }
      })
      .catch(error => {
        console.error('Error deleting appointments:', error);
        
      });
      window.location.reload();
  }

  const handleCancel = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8082/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Appointment deleted');
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('An error occurred while deleting the appointment', error);
    }
    window.location.reload();
  };

  return (
    <>
      <body className={styles.body}>
        {!isFormSubmitted && (
          <div className={styles.data}> 
       
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <input type="text" value={text} onChange={handleChange}
              placeholder='Enter your CNP' className={styles.textt} />

            </label>
            <button type="submit" className={styles.submit}>Save </button>
          </form> 
          <div className={styles.infoForm}> </div>
          </div>  
        )}

        {isFormSubmitted && (
          <div>
            {Array.isArray(appointments) && appointments.length !== 0 && (
              <>
                <h2>Appointments</h2>
                <table className={styles.table}>
                  <thead className={styles.lista}>
                    <tr>
                      <th>Date</th>
                      <th>Hour Start</th>
                      <th>Hour End</th>
                      <th>Doctor</th>
                      <th>Cabinet</th>
                      <th>Address</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.date}>
                        <td>{appointment.date}</td>
                        <td> {appointment.hourStart}</td>
                        <td>{appointment.hourEnd}</td>
                        <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                        <td>{appointment.doctor.cabinet.name}</td>
                        <td>{appointment.doctor.cabinet.address}</td>
                        <td> <button className={styles.submit}  onClick={() => handleCancel(appointment.id)}> Anuleaza </button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            { appointmentsPossible.length!==0 && (
              <>
                <h3>Intervale libere pentru data si doctorul solicitat: </h3>
                <table className={styles.table}>
                  <thead className={styles.lista}>
                    <tr>
                      <th>Date</th>
                      <th>Hour Start</th>
                      <th>Hour End</th>
                      <th>Cabinet</th>
                      <th>Doctor</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(appointmentsPossible) && appointmentsPossible.map((appointment) => (
                      <tr key={appointment.date}>
                        <td>{appointment.date}</td>
                        <td>{appointment.hourStart}</td>
                        <td>{appointment.hourEnd}</td>
                        <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                        <td>{appointment.doctor.cabinet.name}</td>
                        <td>{appointment.doctor.cabinet.address}</td>
                        <td><button className={styles.submit}  onClick={() => handleInsert(appointment)}>Alege</button></td>
                      </tr>
                    ))}
                    <tr> <button className={styles.delete}  onClick={() => handleDelete()}> delete all</button> </tr>
                  </tbody>
                </table>
              </>
            )}

            { appointmentsChecked.length!==0 && (
              <>
                <h3>Lista cu programari disponibile din lista dumneavoastra de preferinte</h3>
                <table className={styles.table}>
                  <thead className={styles.lista}>
                    <tr>
                      <th>Date</th>
                      <th>Hour Start</th>
                      <th>Hour End</th>
                      <th>Doctor</th> 
                      <th>Cabinet</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(appointmentsChecked) && appointmentsChecked.map((appointment) => (
                      <tr key={appointment.date}>
                        <td>{appointment.date}</td>
                        <td>{appointment.hourStart}</td>
                        <td>{appointment.hourEnd}</td>
                        <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                        <td>{appointment.doctor.cabinet.name}</td>
                        <td>{appointment.doctor.cabinet.address}</td>
                        <td><button className={styles.submit} onClick={() => handleInsert(appointment)} >Alege</button></td>
                      </tr>
                    ))}
                    <tr> <button className={styles.delete}  onClick={() => handleDeleteCheck()}> delete all</button> </tr>
                  </tbody>
                </table>
              </>
            )}
                    <button onClick={handleDeleteCNP} className={styles.exit}>EXIT</button>

          </div>
          
        )}
      </body>
    </>
  );
}
export default Verificare;