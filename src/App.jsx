import { useState } from 'react'
import * as Web3 from '@solana/web3.js';
// import * as dotenv from 'dotenv';
// dotenv.config();
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
import './App.css'
import Dice1 from './dice/dice1.png'
import Dice2 from './dice/dice2.png'
import Dice3 from './dice/dice3.png'
import Dice4 from './dice/dice4.png'
import Dice5 from './dice/dice5.png'
import Dice6 from './dice/dice6.png'


function App() {

  const [message, setMessage] = useState('');
  const [succ, setSucc] = useState("");


  async function initializeKeypair(connection) {
    const secret = JSON.parse(import.meta.env.VITE_PRIVATE_KEY);
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecret;

  }

  async function transfor(connection, from, to, amount) {
    const transaction = new Web3.Transaction();
    const Instruction = Web3.SystemProgram.transfer(
      {
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * Web3.LAMPORTS_PER_SOL
      }
    )
    transaction.add(Instruction)
    const sig = await Web3.sendAndConfirmTransaction(connection, transaction, [from])
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`);

  }

  async function main() {
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
    const signer = await initializeKeypair(connection);
    const toPub = new Web3.PublicKey(message)
    await transfor(connection, signer, toPub, 0.1)
  }


  let values = [
    Dice1,
    Dice2,
    Dice3,
    Dice4,
    Dice5,
    Dice6,
  ]

  const [first, setFirst] = useState(values[0])
  const [second, setSecond] = useState(values[1])

  const handleChange = event => {
    setMessage(event.target.value);
  };
  const roll = () => {
    let rand1 = Math.floor(Math.random() * 6);
    let rand2 = Math.floor(Math.random() * 6);
    setFirst(values[rand1]);
    setSecond(values[rand2]);
    if (first === second) {
      main()
        .then(() => {
          console.log("Finished successfully")
          setSucc(sig);
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  return (
    <div className="App">
      <div className="top">ROLL AND WIN🪙</div>
      <div className="input-container">
        <form>
          <input
            placeholder='Enter your solana wallet public key'
            className='pubkey-input' id='pubkey'
            type="text"
            name="message"
            onChange={handleChange}
            value={message}
          ></input>
        </form>

      </div>

      <div className="explain">*NOTE:- Make sure to be on devnet. As a result of a win you will get 0.1 SOL. On account of a loss, no SOL will be deducted from your account. In case you win, check your wallet to see if SOL has been transfered succesfully.</div>
      <div className="game-container">
        <div className="game">
          <div className="dice1"><img src={first} alt="" width="220px" /></div>
          <div className="dice2"><img src={second} alt="" width="220px" /></div>
        </div>
        <button className='roll' onClick={roll}>ROLL🎲</button>
        <h2 className='pub'>Your public key:- {message}</h2>
      </div> 
    </div>
  )
}

export default App
