<?php
// Configuration
$to_email = "diego12delcastillo@gmail.com"; // REPLACE THIS WITH YOUR EMAIL
$subject_prefix = "[Vextria Lead] ";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and Validate Inputs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $website = filter_input(INPUT_POST, 'website', FILTER_SANITIZE_URL);
    $budget = filter_input(INPUT_POST, 'budget', FILTER_SANITIZE_STRING);
    $timeline = filter_input(INPUT_POST, 'timeline', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Basic Validation
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?status=error&msg=invalid_input");
        exit;
    }

    // Construct Email
    $subject = $subject_prefix . $name . " - " . $budget;
    
    $email_content = "New Lead Application:\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Website: $website\n";
    $email_content .= "Budget: $budget\n";
    $email_content .= "Timeline: $timeline\n\n";
    $email_content .= "Pain Point / Message:\n$message\n";

    // Headers
    $headers = "From: noreply@vextria.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send
    if (mail($to_email, $subject, $email_content, $headers)) {
        header("Location: index.html?status=success");
    } else {
        header("Location: index.html?status=error&msg=server_error");
    }
} else {
    // Not a POST request
    header("Location: index.html");
}
?>
