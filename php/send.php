<?

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-type: application/json; charset=utf-8');

// ini_set('mbstring.func_overload', 2);
// ini_set('mbstring.internal_encoding', 'UTF-8');
require 'conf.php';


$pdo = new PDO(DSN, USER, PASSWORD);
$pdo->exec('set names utf8');

$stmt = $pdo->prepare(
     'INSERT INTO ticket '
    . '(subject, message, long, lat, city, country, active) '
    . 'VALUES (?, ?, ?, ?, ?, ?, ?)'
//. 'VALUES (:name, :city, :email, :phone, :utm_source, :utm_medium, :utm_campaign, :utm_term, :utm_content, :date, :product)'
);

$stmt->execute(
    array(
        'sub',
        'msg',
        'long',
        'lat',
        'city',
        'country',
        '1'
    )
);
echo $stmt->lastInsertId();
// echo "\nPDO::errorInfo():\n";
// print_r($pdo->errorInfo());
// // exit();
?>