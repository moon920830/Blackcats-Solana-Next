/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo } from "react";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { mintNFT } from '../../actions/nft';
import { useRouter } from "next/router";
import axios from "axios";
import { SetProductTabKeyAction } from "../../redux/actions/productAction";
import {
    IMetadataExtension,
    MetadataCategory,
    getStoreID,
    setProgramIds,
    StringPublicKey,
    WalletSigner,
} from "@oysterr/common";

import {
    clusterApiUrl,
    Connection,
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Store } from "react-notifications-component";
import { string } from "prop-types";


// Usage of DebounceSelect
interface UserValue {
    key: string;
    label: string;
    value: string;
}

interface Royalty {
    creatorKey: string;
    amount: number;
}
enum TransactionState {
    INIT,
    SUCCESS,
    FAIL
}

interface BlackCatsMetaData {
    name: string,
    symbol: string,
    description: string,
    image: { url: string, name: string },   // image url after uploading onto ARWEAVE 
    music: { url: string, name: string },   // music url after uploading onto ARWEAVE 
    feeSol: Number,
    feeUSD: Number,
    creator?: string,
    price: Number,
    length: Number,
    property: string,
    royality: Number,
    account: string,        // nft address after minting
    transactionId: string,  // transaction id after minting
}

const MintNewArea = () => {
    const transfer_data = useSelector((state: { mint: { data: any } }) => state.mint.data);
    // console.log('transfer_data', transfer_data);

    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), 'recent');
    const endpoint: any = { name: 'devnet', label: 'devnet', url: 'https://api.devnet.solana.com', chainId: 103 };
    const user_auth_data = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const [nftCreateProgress, setNFTcreateProgress] = useState<number>(1);
    const [transactionStatus, setTransactionStatus] = useState<TransactionState>(TransactionState.INIT);
    const [metaData, setMetaData] = useState<BlackCatsMetaData>();
    let files: Array<File> = [];
    let attributes: IMetadataExtension;
    const router = useRouter();

    const listButonnHandler = (e) => {
        console.log('listButonnHandler', e);
        dispatch(
            SetProductTabKeyAction('nav-contact', () => {
                router.push({
                    pathname: `/author/${user_auth_data.u_id}`,
                });
            }) as any
        );
    }
    const auctionButonnHandler = (e) => {
        console.log('auctionButonnHandler', e);
        router.push({
            pathname: `/auction/${metaData?.account}`,
        });
    }
    const sellButonnHandler = (e) => {
        console.log('sellButonnHandler', e);
        router.push({
            pathname: `/sell/${metaData?.account}`,
        });
    }
    const backbuttonHandler = async (e) => {
        console.log('backbuttonHandler', e);
        router.push({
            pathname: "/create",
        });
    }

    const setStoreForOwner = useMemo(
        () => async (ownerAddress?: string) => {
            const storeAddress = await getStoreID(ownerAddress);
            setProgramIds(storeAddress); // fallback          
            console.log(`CUSTOM STORE: ${storeAddress}`);
            return storeAddress;
        },
        [],
    );

    useEffect(() => {
        // console.log('useEffect.payload', payload);
        console.log('useEffect.wallet', wallet);
        console.log('useEffect.connection', connection);
        console.log('useEffect.endpoint', endpoint);
        console.log('useEffect.transfer_data', transfer_data);

        // create the store //
        const storeCall = async () => {
            const store = await setStoreForOwner(wallet.publicKey?.toBase58());
            console.log('useEffect.store', store);
        }
        storeCall();

        // set the payload //
        const payload = transfer_data.payload;

        // set the File Blob//
        files = files.concat([payload.imageFile, payload.musicFile]);
        console.log('useEffect.files', files);

        // set the Attributes //
        attributes = transfer_data.attributes;
        console.log('useEffect.attribute', attributes);

        // set the metadata //
        let tmpMetaData: BlackCatsMetaData = {
            name: payload.name,
            symbol: payload.symbol,
            description: payload.description,
            image: { url: '', name: payload.imageFile.name },   // image url after uploading onto ARWEAVE 
            music: { url: '', name: payload.musicFile.name },   // music url after uploading onto ARWEAVE 
            feeSol: payload.feeSol,
            feeUSD: payload.feeUSD,
            creator: wallet.publicKey?.toBase58(),
            price: payload.price,
            length: payload.length,
            property: payload.property,
            royality: payload.royality,
            account: '',                    // nft address after minting
            transactionId: '',              // transaction id after minting
        }
        console.log('useEffect.tmpMetaData', tmpMetaData);
        // setMetaData(tmpMetaData);

        // call the mint function //
        const mintCall = async (tmpMetaData) => {
            await mint(tmpMetaData);
        }
        mintCall(tmpMetaData);

    }, []);

    // store files
    const mint = async (tmpMetaData) => {
        const mtdata = {
            name: attributes.name,
            symbol: attributes.symbol,
            creators: attributes.creators,
            collection: attributes.collection,
            description: attributes.description,
            sellerFeeBasisPoints: attributes.seller_fee_basis_points,
            image: attributes.image,
            animation_url: attributes.animation_url,
            attributes: attributes.attributes,
            external_url: attributes.external_url,
            properties: {
                files: attributes.properties.files,
                category: attributes.properties?.category,
            },
        };
        console.log('mint', files);
        console.log('metadata', mtdata);

        let status: TransactionState = TransactionState.INIT;
        try {
            const _nft = await mintNFT(
                connection,
                wallet as WalletSigner,
                endpoint.name,
                files,
                mtdata,
                setNFTcreateProgress,
                attributes.properties?.maxSupply,
            );
            console.log('nft', _nft);

            if (_nft) {
                // get the uploaded music/image url - arweaveLink//
                let arweaveMeta;
                const arweaveLink = _nft?.arweaveLink || '';
                try {
                    arweaveMeta = await (await fetch(arweaveLink, { method: 'GET' })).json();
                } catch (e) {
                    console.error('Invalid metadata at', arweaveLink);
                    return;
                }
                console.log('arweaveMeta', arweaveMeta);

                const imaageUrl = arweaveMeta.properties.files[0].uri;
                const musicUrl = arweaveMeta.properties.files[1].uri;

                // get the transaction id - sendTransactionWithRetry //
                const transactionId = _nft?.txid;

                // get the NFT account - recipientKey //
                const nft_account = _nft?.mintKey;

                // update the meta data //
                let _metaData = Object.assign({}, tmpMetaData);
                _metaData.transactionId = transactionId;
                _metaData.account = nft_account;
                _metaData.image = { url: imaageUrl, name: tmpMetaData?.image.name || '' };
                _metaData.music = { url: musicUrl, name: tmpMetaData?.music.name || '' };
                console.log('_metaData', _metaData);

                // sent the created meta to backend to store the result //
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                axios
                    .post("/api/nft/createnft", _metaData, config)
                    .then((response) => {
                    })
                    .catch((err) => {
                        console.log("createnft error", err);
                    });

                // pop up the notification when success //
                Store.addNotification({
                    title: "Notice",
                    message: 'You got success to mint. Please the click button [List] to make sure.',
                    type: 'success',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                    }
                });

                // update the ui and 
                setMetaData(_metaData);

                status = TransactionState.SUCCESS;
                console.log('mint._metaData', _metaData);
            }
        }
        catch (e: any) {
            Store.addNotification({
                title: "Notice",
                message: 'You got failed to mint. Please the click button [Back] to try again.',
                type: 'danger',
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                }
            });
            status = TransactionState.FAIL;
            console.log(e);
        }
        finally {
            setNFTcreateProgress(0);
            setTransactionStatus(status);
        }
    };

    return (
        <>
            <div className="mint-progress-area">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
                            <div className="upload-area">
                                <div className="upload-formate mb--30">
                                    <h6 className="title">
                                        {/* {payload ? payload.name : ""} */}
                                        My New NFT
                                    </h6>
                                </div>

                                <div className="brows-file-wrapper">
                                    {transactionStatus == TransactionState.SUCCESS && (
                                        <img
                                            id="createfileImage"
                                            src={metaData?.image?.url}
                                            alt=""
                                            data-black-overlay="6"
                                        />
                                    )}

                                    <label
                                        htmlFor="file"
                                        title="No File Choosen"
                                        className="image-text"
                                    >
                                        <span className="text-center">
                                            {transactionStatus == TransactionState.SUCCESS ? metaData?.name : 'Product Name'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {transactionStatus == TransactionState.SUCCESS && (
                                <>
                                    <div className="mt--30 mt_sm--30 mt_md--30 d-none d-lg-block text-truncate">
                                        <h5> Note: </h5>
                                        <span>
                                            Royality : <strong> {metaData?.royality}% </strong>
                                            <br />
                                        </span>
                                        <span>
                                            Price : <strong> {metaData?.feeSol.toFixed(5)} SOL (${metaData?.feeUSD.toFixed(5)})</strong>
                                            <br />
                                        </span>
                                        <span>
                                            Address :{" "}
                                            <strong>
                                                {" "}
                                                {metaData?.account}
                                            </strong>
                                            <br />
                                        </span>
                                        <span>
                                            Owner :{" "}
                                            <strong>
                                                {" "}
                                                {metaData?.creator}
                                            </strong>
                                            <br />
                                        </span>
                                        <span>
                                            Transaction :{" "}
                                            <strong>
                                                {" "}
                                                {metaData?.transactionId}
                                            </strong>
                                            <br />
                                        </span>
                                    </div>
                                    <div className="mt--30 mt_sm--30 mt_md--30 text-center">
                                        <Button
                                            size="large"
                                            className="mt--10 my--10 d-block m-auto"
                                            type="button"
                                            label=""
                                            onClick={listButonnHandler}
                                            path="#"
                                            color="primary"
                                            shape="square"
                                            fullwidth={true}
                                        >
                                            List
                                        </Button>
                                        <Button
                                            size="large"
                                            className="mt--10 my--10 d-block m-auto"
                                            type="button"
                                            label=""
                                            onClick={sellButonnHandler}
                                            path="#"
                                            color="primary"
                                            shape="square"
                                            fullwidth={true}
                                        >
                                            Sell
                                        </Button>
                                        <Button
                                            size="large"
                                            className="mt--10 my--10 d-block m-auto"
                                            type="button"
                                            label=""
                                            onClick={auctionButonnHandler}
                                            path="#"
                                            color="primary"
                                            shape="square"
                                            fullwidth={true}
                                        >
                                            Auction
                                        </Button>
                                    </div>
                                </>
                            )}

                            {transactionStatus != TransactionState.SUCCESS && (
                                <>
                                    <div className="mt--30 mt_sm--30 mt_md--30 text-center">
                                        <Button
                                            size="large"
                                            className="mt--10 my--10 d-block m-auto"
                                            type="button"
                                            label=""
                                            onClick={backbuttonHandler}
                                            path="#"
                                            color="primary"
                                            shape="square"
                                            fullwidth={true}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </>
                            )}

                        </div>
                        <div className="col-lg-7">
                            <div className="row">
                                <div className="form-wrapper-one">

                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 1) ? "waiting" :
                                            (nftCreateProgress > 1) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">1</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>
                                                Minting <br />
                                                Starting Mint Progress
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 2) ? "waiting" :
                                            (nftCreateProgress > 2) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">2</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>Preparing Assest</p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 3) ? "waiting" :
                                            (nftCreateProgress > 3) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">3</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>
                                                Signing Metadata Transaction <br />
                                                Approve the transaction from your
                                                wallet
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 4) ? "waiting" :
                                            (nftCreateProgress > 4) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">4</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>
                                                Sending Transaction Solana <br />
                                                This will take a few seconds
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 5) ? "waiting" :
                                            (nftCreateProgress > 5) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">5</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>Waiting for Initial Confirmation</p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 6) ? "waiting" :
                                            (nftCreateProgress > 6) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">6</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>Waiting for Final Confirmation</p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 7) ? "waiting" :
                                            (nftCreateProgress > 7) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">7</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>Uploading to Arweave</p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 8) ? "waiting" :
                                            (nftCreateProgress > 8) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">8</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>Updating MetaData</p>
                                        </div>
                                    </div>
                                    <div className={"step-pannel " +
                                        ((nftCreateProgress == 9) ? "waiting" :
                                            (nftCreateProgress > 9) ? "passed" : "normal")}
                                    >
                                        <div className="circle-status-mark">
                                            <span className="number">9</span>
                                            <span className="check">
                                                <i className="feather-check" />
                                            </span>
                                            <span className="spin">
                                                <Spinner
                                                    animation="border"
                                                    role="status"
                                                />
                                            </span>
                                        </div>
                                        <div className="status-text">
                                            <p>
                                                Signing Token Transaction <br />
                                                Approve the final transaction from
                                                your wallet
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

MintNewArea.propTypes = {};
export default MintNewArea;
