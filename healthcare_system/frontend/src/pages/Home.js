import React from 'react';
import { Container } from 'react-bootstrap';

function Home() {
  return (
    <Container>
      <div className="bg-light p-5 rounded-lg mt-4 text-center">
        <h1>Welcome to the Healthcare Appointment Scheduling System</h1>
        <p className="lead">
          Book appointments with doctors, manage your schedule, and more.
        </p>
      </div>
    </Container>
  );
}

export default Home;
