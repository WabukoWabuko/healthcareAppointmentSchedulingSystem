import { Card, Button } from 'react-bootstrap';

function AppointmentCard({ appointment, onCancel }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{appointment.datetime}</Card.Title>
        <Card.Text>
          {appointment.patient_name ? `With Patient: ${appointment.patient_name}` : `Doctor: ${appointment.doctor_name}`} - Status: {appointment.status}
        </Card.Text>
        {appointment.status === 'pending' && <Button variant="danger" onClick={() => onCancel(appointment.id)}>Cancel</Button>}
      </Card.Body>
    </Card>
  );
}
export default AppointmentCard;
