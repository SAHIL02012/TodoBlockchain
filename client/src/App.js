import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config.js';
import TaskAbi from './TaskContract.json';
import ButtonGroup from '@mui/material/ButtonGroup';
 
const { ethers } = require("ethers");
 
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState(0); 
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
 
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  useEffect(() => {
    getAllTasks();
  }, [tasks]);
 
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask not detected.');
        return;
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain: ' + chainId);
      const sepoliaChainId = '0xaa36a7'; // 11155111
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet.');
        return;
      } else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      console.log('MetaMask Account: ' + accounts[0]);
    } catch (error) {
      console.log('Error connecting to MetaMask.', error);
    }
  }
 
  const addTask = async (event) => {
    event.preventDefault();
    let task = {
      'taskText': input,
      'isDeleted': false,
      priority: priority,
    };
    try { 
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        console.log(task.taskText, task.isDeleted,task.priority)
        TaskContract.addTask(task.taskText, task.isDeleted,task.priority)
          .then(response => {
            // spread operator -- copy the elements of 'tasks' array into a new array with new task appended 
            setTasks([...tasks, task]);
            console.log("Task added.");
          })
          .catch(err => {
            console.log("Error when adding new task.",err);
          });
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log("Error submitting new task. ", error);
    }
    setInput('');
    setPriority(0); // Setting default priority to (Low)
  };
 
  const deleteTask = key => async () => {
    console.log("Task ID to delete: " + key);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let deleteTx = await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  return (
<div>
      {currentAccount === '' ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
<Button
          variant="contained" color="info" style={{ justifyContent: "center", margin: "50px", fontSize: "28px", fontWeight: "bold" }}
          onClick={connectWallet}
>Connect 🦊 MetaMask Wallet ➡ Sepolia Testnet</Button></div>
      ) : correctNetwork ? (
<div className="App">
<img src={require('./todo.jpg')} style={{ width: "20%", height: "15%" }} />
<form style={{ margin: "20px 30px 20px" }}>
<TextField id="outlined-basic" helperText="Enter a task then click the '+'" label="Task" style={{ margin: "0px 10px 30px" }} size="normal" value={input}
              onChange={event => setInput(event.target.value)} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <ButtonGroup variant="contained" aria-label="Priority button group">
               <Button onClick={() => setPriority(0)} color={priority === 0 ? "primary" : "default"}>
                Low
              </Button>
              <Button onClick={() => setPriority(1)} color={priority === 1 ? "secondary" : "default"}>
                Medium
              </Button>
              <Button onClick={() => setPriority(2)} color={priority === 2 ? "error" : "default"}>
                High
              </Button>
    </ButtonGroup>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<Button variant="contained" color="info" style={{ fontSize: "28px", fontWeight: "bold" }} onClick={addTask}>+</Button>
</form>
<ul>
            {tasks.map(item =>
<Task
                key={item.id}
                taskText={item.taskText}
                priority={item.priority}
                onClick={deleteTask(item.id)}
              />)
            }
</ul>
</div>
      ) : (
<div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
<div>Connect to the Ethereum Sepolia Testnet and reload the page.</div>
</div>
          )
      }
</div >
  );
}
 
export default App;