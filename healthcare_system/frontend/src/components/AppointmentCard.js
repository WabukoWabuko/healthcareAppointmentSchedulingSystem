import { Card } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function AppointmentCard({ appointment }) {
  const { user } = useContext(AuthContext);

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          {user.role === 'doctor'
            ? `Appointment with ${appointment.patient.name}`
            : `Appointment with ${appointment.doctor.name}`}
        </Card.Title>
        <Card.Text>
          <strong>Date:</strong> {new Date(appointment.datetime).toLocaleString()}<br />
          <strong>Status:</strong> {appointment.status}<br />
          {user.role === 'doctor' ? (
            <>
              <strong>Patient Email:</strong> {appointment.patient.email}<br />
            </>
          ) : (
            <>
              <strong>Specialization:</strong> {appointment.doctor.specialization}<br />
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AppointmentCard;
