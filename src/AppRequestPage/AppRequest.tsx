import React, { useEffect } from 'react';

import { useState } from 'react';
import styles from "./Body.module.css";
import { Navigate } from 'react-router-dom';
import {useNavigate } from "react-router-dom";



interface doc {
  id: number;
}
interface pac {
  id: number | undefined;
}
interface Patient {
  firstName: string;
  lastName: string;
  cnp: string;
  genre: string;
  birthdate: string;
  address: string;
  phone: string;
}
interface Patientt {
  id: number;
  firstName: string;
  lastName: string;
  cnp: string;
  genre: string;
  birthdate: string;
  address: string;
  phone: string;
}
interface Cabinet {
  id: number;
  name: string;
  address: string;
}
interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  genre: string;
  type: string;
  hourStartProgram: string;
  hourEndProgram: string;
  cabinet: Cabinet;
  username: string;
  password: string;
}
interface Preferences {
  patient: pac;
  doctor: doc;
  date: string;
  hourStart: string;
  hourEnd: string;
}
interface Preference {
  id: number;
  id_patient: number;
  id_doctor: number;
  id_cabinet: number;
  date: string;
  hour_start: string;
  hour_end: string;
}

const AppRequest = () => {
  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    lastName: '',
    cnp: '',
    genre: '',
    birthdate: '',
    address: '',
    phone: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [patientt, setPatientt] = useState<Patientt>();

  useEffect(() => {
    fetch('http://localhost:8082/cabinets')
      .then((response) => response.json())
      .then((data) => {
        setCabinets(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [errors, setErrors] = useState<Record<keyof Patient, string>>({} as Record<keyof Patient, string>);
  const [errorspref, setErrorspref] = useState<Array<string>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      fetch('http://localhost:8082/patients', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
      setIsFormSubmitted(true);
    }
    else {
      console.log(errors);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`http://localhost:8082/patients/cnp/${formData.cnp}`)
        .then(response => response.json())
        .then(patient => {
          console.log(patient);
          setPatientt(patient);
        })
        .catch(error => {
          console.error(error);
        });
    }, 3000);

    return () => clearTimeout(timer);
  }, [isFormSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8082/doctors`)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);



  const [preferences, setPreferences] = useState<Preference[]>([
    {
      id: 0,
      id_patient: 0,
      id_doctor: 0,
      id_cabinet: 0,
      date: '',
      hour_start: '',
      hour_end: ''
    }
  ]);

  const addPreference = () => {
    const newPreference: Preference = {
      id: preferences.length + 1,
      id_patient: 0,
      id_doctor: 0,
      id_cabinet: 0,
      date: '',
      hour_start: '',
      hour_end: ''
    };

    setPreferences([...preferences, newPreference]);
  };


  const deletePreference = (index: number) => {
    const updatedPreferences = [...preferences];
    updatedPreferences.splice(index, 1);
    setPreferences(updatedPreferences);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPreferences((prevPreferences) => {
      const updatedPreferences = [...prevPreferences];
      updatedPreferences[index] = {
        ...updatedPreferences[index],
        [name]: name === 'id_cabinet' ? parseInt(value, 10) : value
      };


      const updatedErrorspref = [...errorspref];
      updatedErrorspref[index] = '';
      setErrorspref(updatedErrorspref);
      return updatedPreferences;
    });
  };
  const navigate = useNavigate();

  const handleSubmitPreferences = async ()  => {
    const updatedErrors = preferences.map((preference) => {
      let error = '';


      if (preference.id_cabinet === 0) {
        error = 'Please select a Cabinet.';
      }


      if (preference.id_doctor === 0) {
        error = 'Please select a Doctor.';
      }


      if (preference.date === '') {
        error = 'Please enter a Date.';
      }


      if (preference.hour_start === '') {
        error = 'Please enter a Start Time.';
      }


      if (preference.hour_end === '') {
        error = 'Please enter an End Time.';
      }

      return error;
    });

    setErrorspref(updatedErrors);
    const hasErrors = updatedErrors.some((error) => error !== '');
    if (!hasErrors) {
      const preferencess: Preferences[] = preferences.map((preference) => {
        const doc: doc = { id: preference.id_doctor };
        const pac: pac = { id: patientt?.id };
        return {
          patient: pac,
          doctor: doc,
          date: preference.date,
          hourStart: preference.hour_start,
          hourEnd: preference.hour_end,
        };
      });

      console.log(preferencess);
      try {
        const response = await fetch('http://localhost:8082/preferences', {
          method: 'POST',
          body: JSON.stringify(preferencess),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);

      
      } catch (error) {
        console.error(error);
      }
      navigate('/Verificare');
    }
   


  };
  function validateForm(formData: Patient): Record<keyof Patient, string> {

    const errors: Record<keyof Patient, string> = {} as Record<keyof Patient, string>;
    if (!formData.firstName) {
      errors.firstName = 'First Name is required';
    }


    if (!formData.lastName) {
      errors.lastName = 'Last Name is required';
    }


    if (!formData.cnp) {
      errors.cnp = 'CNP is required';
    } else if (!/^[0-9]{13}$/.test(formData.cnp)) {
      errors.cnp = 'CNP must be a 13-digit number';
    }


    if (!formData.genre) {
      errors.genre = 'Genre is required';
    }


    if (!formData.birthdate) {
      errors.birthdate = 'Birthdate is required';
    }


    if (!formData.address) {
      errors.address = 'Address is required';
    }


    if (!formData.phone) {
      errors.phone = 'Phone is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Phone must be a 10-digit number';
    }

    return errors;
  }
  return (
    <>

      <div>
        <div className={styles.data}>
          <div className={styles.infoForm}>

          </div>
          <form onSubmit={handleSubmit} className={styles.formular}>
            <p> Introduceti datele personale pentru a crea o noua programare</p>
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange} />
              {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange} />
              {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="cnp">CNP:</label>
              <input
                type="text"
                id="cnp"
                name="cnp"
                value={formData.cnp}
                onChange={handleChange} />
            </div>
            {errors.cnp && <p className={styles.error}>{errors.cnp}</p>}
            <div>
              <label htmlFor="genre">Genre:</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select Genre</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.genre && <p className={styles.error}>{errors.genre}</p>}
            </div>
            <div>
              <label htmlFor="birthdate">Birthdate:</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange} />
              {errors.birthdate && <p className={styles.error}>{errors.birthdate}</p>}
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange} />
              {errors.address && <p className={styles.error}>{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange} />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
            </div>
            {!isFormSubmitted && <button type="submit" className={styles.submit}>Save</button>}
          </form>
        </div>
      </div>


      <div >


        {isFormSubmitted &&
          <div >
            {preferences.map((preference, index) => (
              <div className={styles.data}>
                {index === 0 ?
                  (<div className={styles.infoForm2}></div>
                  ) : (
                    <div className={styles.infoForm3}></div>)}
                <div key={preference.id} className={styles.formularr}>
                  <div>
                    {
                      index === 0 &&
                      <p> Introduceti datele cu privire la programarea dorita</p>
                    }
                    {
                      index > 0 &&
                      <p> Introduceti datele cu privire la programarea pe care doriti sa o verificam</p>
                    }
                    <label>Cabinet:</label>
                    <select
                      value={preference.id_cabinet}
                      name="id_cabinet"
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <option value="">Select Cabinet</option>
                      {cabinets.map((cabinet) => (
                        <option key={cabinet.id} value={cabinet.id}>
                          {cabinet.name} - {cabinet.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Doctor:</label>
                    <select
                      value={preference.id_doctor}
                      name="id_doctor"
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <option value="">Select Doctor</option>
                      {Array.isArray(doctors) &&
                        doctors
                          .filter(
                            (doctor) =>
                              doctor.cabinet && doctor.cabinet.id === preference.id_cabinet
                          )
                          .map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.firstName} {doctor.lastName} - {doctor.type}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div>
                    <label>Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={preference.date}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                  <div>
                    <label>Start Time:</label>
                    <input
                      type="time"
                      name="hour_start"
                      value={preference.hour_start}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                  <div>
                    <label>End Time:</label>
                    <input
                      type="time"
                      name="hour_end"
                      value={preference.hour_end}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                  {}
                  {errorspref[index] && (
                    <div className={styles.error}>{errorspref[index]}</div>
                  )}
                  <button onClick={() => deletePreference(index)} className={styles.delete}>
                    Delete
                  </button>
                </div>

              </div>

            ))}
            {preferences.length === 1 && <div className={styles.info}> Puteti adauga mai multe preferinte de programari, iar in cazul in care
              noi nu va putem solutiona cererea o sa le verificam disponibilitatea celorlalte preferinte</div>}
          </div>
        }
        {isFormSubmitted && (
          <div>
            <button onClick={addPreference} className={styles.add}>Add new preference</button>
            <button onClick={handleSubmitPreferences} className={styles.add}>Send information</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AppRequest;  