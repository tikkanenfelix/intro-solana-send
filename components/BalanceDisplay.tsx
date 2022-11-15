import { FC, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const BalanceDisplay: FC = () => {
    const [balance, setBalance] = useState(0)
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        if (!connection || !publicKey) {
            return
        }
        connection.getAccountInfo(publicKey).then(info => {
            setBalance(info.lamports);})
        },[connection, publicKey])
        return(
            <div>
                <p>{publicKey ? `Balance ${balance / LAMPORTS_PER_SOL}` : 'No publicKey entered.'}</p>
            </div>
        )
}