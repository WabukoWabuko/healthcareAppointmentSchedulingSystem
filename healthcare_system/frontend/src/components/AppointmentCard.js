import { Card, Button } from 'react-bootstrap';

function AppointmentCard({ appointment, onCancel }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Appointment</Card.Title>
        <Card.Text>
          <strong>Patient:</strong> {appointment.patient_name || 'Unknown'}<br />
          <strong>Doctor:</strong> {appointment.doctor_name || 'Unknown'}<br />
          <strong>Date & Time:</strong> {new Date(appointment.datetime).toLocaleString()}<br />
          <strong>Status:</strong> {appointment.status}
        </Card.Text>
        {onCancel && (
          <Button variant="danger" onClick={() => onCancel(appointment.id)}>Cancel</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default AppointmentCard;
