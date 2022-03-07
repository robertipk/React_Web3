import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';

function App() {
  const [account, setAccount] = useState(); // state variable to set account.
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      // Instantiate smart contract using ABI and address.
      const taskContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      // Get total number of tasks
      const counter = await taskContract.methods.count().call();
      for (var i = 1; i <= counter; i++) {
        // Retrieve every task from the tasks variable on smart contract
        const task = await taskContract.methods.tasks(i).call();
        // Add the the task to our list of tasks.
        setTasks((tasks) => [...tasks, task]);
      }
    }
   load();
  }, []);
  
   return (
     <div>
       Account address: {account}
       <h1>Tasks</h1>
      <ol>
      {
        Object.keys(tasks).map((_, index) => (
          <li>
            <h4>Task: {tasks[index].name}</h4>
            <span><b>Description: </b>{tasks[index].description}</span>
          </li>
        ))
      }
      </ol>
     </div>
   );
}

export default App;