<?php
require 'vendor/autoload.php'; // Include the Composer autoloader

use \Firebase\JWT\JWT;
use \Firebase\JWT\JWK;

// Allow requests from any origin
header("Access-Control-Allow-Origin: http://localhost:3000");

header("Access-Control-Allow-Credentials: true");

// Allow the following HTTP methods
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Allow the following headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, st-auth-mode, rid");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight OPTIONS request
    http_response_code(200); // OK
    exit();
}

$jwks_url = 'https://7l37va4thk.execute-api.ap-south-1.amazonaws.com/dev/auth/jwt/jwks.json';

$jwt_token = null;
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $jwt_token = str_replace('Bearer ', '', $headers['Authorization']);
}

if ($jwt_token) {
    try {
        // Get JWKS from the JWKS URL
        $jwks_json = file_get_contents($jwks_url);
        $jwks = json_decode($jwks_json, true);

        // Verify the JWT using JWKS
        JWT::$leeway = 60; // Accept tokens that are not synchronized with the server's time
        $decoded = JWT::decode($jwt_token, JWK::parseKeySet($jwks), ['RS256']);

        // If the token is verified, we check if the email verification claim is set to true

        echo "Hello, " . $decoded->sub . "!"; // 'sub' claim contains the user ID
    } catch (Exception $e) {
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Access denied.", "error" => $e->getMessage()));
    }
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(array("message" => "Access denied. Token not provided."));
}
?>