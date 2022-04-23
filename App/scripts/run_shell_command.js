const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);

async function run_shell_command(command) {
   let result;
   try {
     result = await execProm(command);
   } catch(ex) {
      result = ex;
   }
   if ( Error[Symbol.hasInstance](result) )
       return ;

   return result;
}

//example run
run_shell_command("bash wget_test.sh http://edcguest:edcguest@172.31.100.14:3128").then( res => console.log(res) );
module.exports = run_shell_command;