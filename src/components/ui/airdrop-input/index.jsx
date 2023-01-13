/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import clsx from "clsx";
import ErrorText from "@ui/error-text";
import { useForm } from "react-hook-form";
import NiceSelect from "@ui/nice-select";
import { useState } from "react";
import Link from "next/link";

// import { Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import { getOrCreateAssociatedTokenAccount } from './getOrCreateAssociatedTokenAccount'
// import { createTransferInstruction } from './createTransferInstructions'

// import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
// import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';


const AirdropInput = ({ className, id, name, placeholder }) => {
    const [pairs, setPairs] = useState([]);
    const [address, setAddress] = useState("");
    const [tokenId, setTokenId] = useState("");

    const { connection } = useConnection()
    console.log('AirdropInput.connection', connection);

    const { publicKey, signTransaction, sendTransaction } = useWallet()
    const onSendSPLTransaction = async (toPubkey) => {
        try {

            const toPublicKey = new PublicKey(toPubkey)
            const mint = new PublicKey('77rQGky8igxvjFZXSgeA1rk3w1dvS6LK4s3otsR8eR63')

            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                mint,
                publicKey,
                signTransaction
            )

            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                mint,
                toPublicKey,
                signTransaction
            )

            const transaction = new Transaction().add(
                createTransferInstruction(
                    fromTokenAccount.address, // source
                    toTokenAccount.address, // dest
                    publicKey,
                    1 * LAMPORTS_PER_SOL,
                    [],
                    TOKEN_PROGRAM_ID
                )
            )

            const blockHash = await connection.getRecentBlockhash()
            transaction.feePayer = await publicKey
            transaction.recentBlockhash = await blockHash.blockhash
            const signed = await signTransaction(transaction)

            await connection.sendRawTransaction(signed.serialize())
        } catch (error) {
            console.log('error', error.message);
        }
    }

    const removeButtonClick = (e, index) => {
        e.preventDefault();
        const newPairs = Object.assign([], pairs);
        newPairs.splice(index, 1);
        setPairs(newPairs);
    };
    const addButtonClickHandler = (e) => {
        console.log(e);
        e.preventDefault();

        const newObject = { address, tokenId };
        const newPair = pairs.filter(
            (pair) =>
                !(
                    pair.address === newObject.address &&
                    pair.tokenId === newObject.tokenId
                )
        );
        newPair.push(newObject);
        setPairs(newPair);
    };

    const airDropButtonClickHandler = (e) => {
        e.preventDefault();
        console.log("airdropButtonClickHandler");

        onSendSPLTransaction('BdrkBZPm7yuzG9bBHz8aCdXkYG1ZFt73QDoC8amMfnJ4');
    };
    const tokenChangeHandler = (e) => {
        const tid = e && e.text ? e.text : "";
        setTokenId(tid);
        console.log(tid);
    };
    const changeHandler = (e) => {
        const addr = e && e.target.value ? e.target.value : "";
        setAddress(addr);
        console.log(address);
    };

    const hoverOnHandler = (e) => {
        const { target } = e;
        const thisDiv = target.querySelector(".address-list-item.row");
        if (!thisDiv) return;

        const divs = document.querySelectorAll(".address-list-item.row");

        divs.forEach((item) => {
            item.classList.remove("hover");
            item.querySelector(".action-bar").classList.remove("reveal");
        });

        thisDiv.classList.add("hover");
        thisDiv.querySelector(".action-bar").classList.add("reveal");
    };

    const hoverOutHandler = (e) => {
        const divs = document.querySelectorAll(".address-list-item.row");
        divs.forEach((item) => {
            item.classList.remove("hover");
            item.querySelector(".action-bar").classList.remove("reveal");
        });
    };

    return (
        <div className={clsx("airdrop-input", className)}>
            <div className="section">
                <div className="d-flex justify-content-between">
                    <div className="align-self-center address-pair">
                        <input
                            id={id}
                            name={name}
                            placeholder={placeholder}
                            onChange={changeHandler}
                        />
                        <NiceSelect
                            style={{
                                margin: "0px",
                            }}
                            name="token"
                            placeholder="token id"
                            options={[
                                {
                                    value: 1,
                                    text: "231",
                                },
                                {
                                    value: 2,
                                    text: "450",
                                },
                                {
                                    value: 3,
                                    text: "929",
                                },
                            ]}
                            onChange={tokenChangeHandler}
                        />
                    </div>
                    <div className="align-self-center">
                        <button
                            className="btn btn-primary-alta btn-outline-secondary"
                            onClick={addButtonClickHandler}
                            type="button"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="preview d-flex justify-content-around">
                    <span className="align-self-center">Preview</span>
                    <span className="align-self-center">
                        NFT Count:
                        <span className="added_nft_count">
                            {pairs ? pairs.length : 0}
                        </span>
                        /<span className="totoal_nft_count">0</span> NFTS
                    </span>
                </div>
            </div>
            <div className="section">
                <div className="address-list container">
                    <ul>
                        {pairs?.map((pair, index) => (
                            <li
                                key={pair}
                                onMouseEnter={hoverOnHandler}
                                onMouseLeave={hoverOutHandler}
                            >
                                <div className="address-list-item row">
                                    <div className="address col-md-7">
                                        {pair.address}
                                    </div>
                                    <div className="tokenid col-md-2">{`#${pair.tokenId}`}</div>
                                    <div className="color-mark col-md-1" />
                                    <div className="action-bar col-md-2 d-flex justify-content-evenly">
                                        <div className="action">
                                            <Link
                                                href="/"
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                <i className="feather-external-link" />
                                            </Link>
                                        </div>
                                        <div className="action">
                                            <Link
                                                href="/"
                                                target="_blank"
                                                rel="noopener"
                                                onClick={(e) =>
                                                    removeButtonClick(e, index)
                                                }
                                            >
                                                <i className="feather-x" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="section" style={{ paddingTop: "50px" }}>
                <div className="button-row" style={{ textAlign: "center" }}>
                    <button
                        className="btn btn-primary btn-outline-secondary"
                        style={{ width: "80%" }}
                        type="button"
                        onClick={airDropButtonClickHandler}
                    >
                        Airdrop
                    </button>
                </div>
            </div>
        </div>
    );
};

AirdropInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default AirdropInput;
