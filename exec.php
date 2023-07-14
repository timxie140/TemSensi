<?php
// File: execute_cpp.php

// Set the appropriate path to the C++ executable
$cppExecutable = './path/to/your/cpp/executable'; // Replace with the actual path

// Execute the C++ program
$output = shell_exec($cppExecutable);

// Output the result
echo "<pre>$output</pre>";
?>
