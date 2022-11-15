import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback, useState } from 'react';
import styles from '../styles/Home.module.css'
import * as web3 from '@solana/web3.js'


export const SendSolForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [txSig, setTxSig] = useState('');
    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

    const sendSol = event => {
        event.preventDefault()
        if (!connection || !publicKey) { return }
        const transaction = new web3.Transaction()
        const recieverPubKey = new web3.PublicKey(event.target.recipient.value)

        const solInstructions = web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recieverPubKey,
            lamports: event.target.amount.value * web3.LAMPORTS_PER_SOL
            })
        transaction.add(solInstructions)
        sendTransaction(transaction, connection).then(sig => {
            setTxSig(sig)
        })
        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
    }

    return (
        
        <div>     
            {publicKey ?
                <form onSubmit={sendSol} className={styles.form}>
                    <label htmlFor="amount">Amount (in SOL) to send:</label>
                    <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                    <br />
                    <label htmlFor="recipient">Send SOL to:</label>
                    <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                    <button type="submit" className={styles.formButton}>Send</button>
                </form>
            : <span>Connect Your Wallet</span>    
            }
            {
                txSig ? 
                    <div>
                         <p>View your transaction on the </p>
                        <a href={link()}>Solana Explorer</a>
                    </div>
                    : null 
            }
        </div>
    )
}