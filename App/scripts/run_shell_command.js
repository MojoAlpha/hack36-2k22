const sudo = require("sudo-prompt");

function run_shell_command(command) {
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

//example run
// run_shell_command("bash wget_test.sh http://edcguest:edcguest@172.31.100.14:3128").then( res => console.log(res) );
module.exports = { run_shell_command };
