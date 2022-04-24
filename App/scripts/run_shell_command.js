const sudo = require("sudo-prompt");
const { exec } = require("child_process");

function sudo_run_shell_command(command) {
  const options = {
    name: "Electrom",
    icns: "./icn.png",
  };
  return new Promise((resolve, reject) => {
    sudo.exec(command, options, (err, stdout, stderr) => {
      if (err) return reject(err);
      return resolve(stdout);
    });
  });
}

function run_shell_command(command) {
  console.log(command);
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      return resolve(stdout);
    });
  });
}

//example run
// sudo_run_shell_command("bash wget_test.sh http://edcguest:edcguest@172.31.100.14:3128").then( res => console.log(res) );
module.exports = { sudo_run_shell_command, run_shell_command };
