import React from 'react';
import styles from "./Body.module.css";
import { Link } from 'react-router-dom';

function FirstPage() {
  return (
    <body className={styles.body}>
      <Link to='/Doc'> <button className={styles.login}> </button> </Link>
      <div className={styles.butoane}>
      <Link to='/Appointment' className={styles.but1}> </Link>
      <Link to='/Verificare'className={styles.but2}> </Link>
      </div>
    </body>
  );
}

export default FirstPage;