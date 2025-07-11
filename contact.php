<?php
// DB config
$host = 'localhost';
$db   = 'messagedb';
$user = 'root';       // default for XAMPP
$pass = '';           // default for XAMPP
$charset = 'utf8mb4';

// Connect
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo "Database connection failed.";
    exit;
}

// Handle POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $message = trim($_POST["message"] ?? '');

    // Validate
    if (!$name || !$email || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please fill out all fields correctly.";
        exit;
    }

    // Insert
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);

    echo "Thank you! Your message has been saved.";
} else {
    http_response_code(405);
    echo "Invalid request.";
}
?>
