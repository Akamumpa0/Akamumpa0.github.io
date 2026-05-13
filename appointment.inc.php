<?php
// Start session and set JSON response
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['userid'])) {
    echo json_encode(['success' => false, 'error' => 'notloggedin']);
    exit;
}

// Include classes
include "../classes/dbh.classes.php";
include "../classes/appointment.classes.php";
include "../classes/appointment_contr.classes.php";

// Initialize controller
$userId = $_SESSION['userid'];
$appointment = new AppointmentContr($userId);

// Handle create appointment request
if (isset($_POST['create_appointment'])) {
    $departmentId = isset($_POST['department_id']) ? trim($_POST['department_id']) : '';
    $doctorId = isset($_POST['doctor_id']) ? trim($_POST['doctor_id']) : '';
    $appointmentDate = isset($_POST['appointment_date']) ? trim($_POST['appointment_date']) : '';
    $appointmentTime = isset($_POST['appointment_time']) ? trim($_POST['appointment_time']) : '';
    error_log("appointment.inc.php: Create appointment request, userID=$userId, departmentID=$departmentId, doctorID=$doctorId");

    try {
        $appointmentId = $appointment->createNewAppointment($departmentId, $doctorId, $appointmentDate, $appointmentTime);
        echo json_encode(['success' => true, 'message' => 'Appointment created successfully.', 'appointment_id' => $appointmentId]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Handle cancel appointment request
if (isset($_POST['cancel_appointment'])) {
    $appointmentId = isset($_POST['appointment_id']) ? trim($_POST['appointment_id']) : '';
    error_log("appointment.inc.php: Cancel appointment request, appointmentID=$appointmentId, userID=$userId");

    try {
        $appointment->cancelUserAppointment($appointmentId);
        echo json_encode(['success' => true, 'message' => 'Appointment cancelled successfully.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);