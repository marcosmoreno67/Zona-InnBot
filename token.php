<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $secretKey = "6LcF900qAAAAAG4hnk-7nFK4ihO2EFPam0EMQkkr";
    $responseKey = $_POST['g-recaptcha-response'];
    $userIP = $_SERVER['REMOTE_ADDR'];

    $url = "https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$responseKey}&remoteip={$userIP}";
    $response = file_get_contents($url);
    $responseKeys = json_decode($response, true);

    if (intval($responseKeys["success"]) !== 1) {
        echo "Por favor completa el CAPTCHA correctamente.";
    } else {
        echo "CAPTCHA verificado con éxito.";
        // Procesa el resto del formulario aquí
    }
}
?>
