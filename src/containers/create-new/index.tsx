/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo } from "react";
import PropTypes, { any } from "prop-types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import ConfirmModal from "@components/modals/confirm-modal";
import Button from "@ui/button";
import ProductModal from "@components/modals/product-modal";
import ErrorText from "@ui/error-text";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { MintRequestAction } from "../../redux/actions/mintActions";
import { MintLayout } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { getLast } from "@utils/utils";
import {
    MAX_METADATA_LEN,
    IMetadataExtension,
    MetadataCategory,
    getStoreID,
    setProgramIds,
    Creator,
    shortenAddress,
    MetaplexModal,
    MetaplexOverlay,
    MetadataFile,
    StringPublicKey,
    WRAPPED_SOL_MINT,
    getAssetCostToStore,
    LAMPORT_MULTIPLIER,
    WalletSigner,
    formatAmount
} from "@oysterr/common";

import {
    useConnection
} from 'src/contexts/connection'

// import {
//     useUserAccounts
// } from 'src/hooks_market'

// import {
//     clusterApiUrl,
//     Connection,
// } from '@solana/web3.js';

// import {
//     useUserBalance,
// } from 'src/hooks_market';

// import { useSolPrice, useAllSplPrices } from 'src/contexts/coingecko';

const CreateNewArea = ({ className, space }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>();
    const [selectedMusic, setSelectedMusic] = useState<any>();
    const [hasImageError, setHasImageError] = useState(false);
    const [hasMusicError, setHasMusicError] = useState(false);
    const [sol, setSol] = useState<Number>(0);
    const [usd, setUsd] = useState<Number>(0);
    const [previewData, setPreviewData] = useState({});
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    // This function will be triggered when the file field change
    const musicChange = (e) => {
        console.log('musicFilechange', e);
        if (e.target.files && e.target.files.length > 0) {
            // const file = e.target.files[0];
            // const sizeKB = file.size / 1024;
            // if (sizeKB < 25) {
            //   setCoverArtError(
            //     `The file ${file.name} is too small. It is ${
            //       Math.round(10 * sizeKB) / 10
            //     }KB but should be at least 25KB.`,
            //   );
            //   return;
            // }
            setSelectedMusic(e.target.files[0]);
        }
    };
    const imageChange = (e) => {
        console.log('imageFilechange', e);
        if (e.target.files && e.target.files.length > 0) {
            // const file = e.target.files[0];
            // const sizeKB = file.size / 1024;

            // if (sizeKB < 25) {
            //     setCoverArtError(
            //         `The file ${file.name} is too small. It is ${Math.round(10 * sizeKB) / 10
            //         }KB but should be at least 25KB.`,
            //     );
            //     return;
            // }
            setSelectedImage(e.target.files[0]);
        }
    };

    const connection = useConnection();
    console.log('CreateNewArea.useConnection', connection);
    const wallet = useWallet();
    // const connection = new Connection(clusterApiUrl('devnet'), 'recent');
    // const endpoint = { name: 'devnet', label: 'devnet', url: 'https://api.devnet.solana.com', chainId: 103 };

    // const { accountByMint } = useUserAccounts();
    // const balance = useUserBalance(WRAPPED_SOL_MINT.toBase58(), wallet.publicKey?.toBase58());
    // console.log('accountByMint', accountByMint);
    // console.log('balance', balance);

    const [files, setFiles] = useState<Array<File>>([]);
    const [payload, setPayload] = useState<any>();
    const [attributes, setAttributes] = useState<IMetadataExtension>();

    const setStoreForOwner = useMemo(
        () => async (ownerAddress?: string) => {
            const storeAddress = await getStoreID(ownerAddress);
            setProgramIds(storeAddress); // fallback          
            console.log(`CUSTOM STORE: ${storeAddress}`);
            return storeAddress;
        }, [],
    );

    useEffect(() => {
        console.log('useEffect.wallet', wallet);
        console.log('useEffect.connection', connection);
        // console.log('useEffect.endpoint', endpoint);

        const getStore = async () => {
            await setStoreForOwner(wallet.publicKey?.toBase58());
        };

        // create the store //
        getStore();
    }, []);

    const getCost = async (attr: IMetadataExtension, fileblobs: any[]) => {
        // create the meta data //
        const metadata = {
            name: attr.name,
            symbol: attr.symbol,
            creators: attr.creators,
            collection: attr.collection,
            description: attr.description,
            sellerFeeBasisPoints: attr.seller_fee_basis_points,
            image: attr.image,
            animation_url: attr.animation_url,
            attributes: attr.attributes,
            external_url: attr.external_url,
            properties: {
                files: attr.properties.files,
                category: attr.properties?.category,
            },
        };

        const rentCall = Promise.all([
            connection.getMinimumBalanceForRentExemption(MintLayout.span),
            connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
        ]);

        // fetch the cost by api //
        if (fileblobs.length)
            return await getAssetCostToStore([
                ...fileblobs,
                new File([JSON.stringify(metadata)], 'metadata.json'),
            ]).then(async lamports => {
                const sol = lamports / LAMPORT_MULTIPLIER;

                // TODO: cache this and batch in one call
                const [mintRent, metadataRent] = await rentCall;
                const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

                // TODO: add fees based on number of transactions and signers
                return sol + additionalSol;
            });
        else
            return 0;
    }

    const handleConfirmModal = () => {
        // send the data to mint page //
        const transfer_data = { payload, attributes };
        console.log('handleConfirmModal', transfer_data)

        dispatch(
            MintRequestAction(transfer_data, (message, type) => {
                if (type === "success") {
                    router.push({
                        pathname: "/mint",
                    });
                }
            }) as any
        );

        setShowConfirmModal(false);
    };

    const handleCancelModal = () => {
        setShowConfirmModal(false);
    };

    const onSubmit = async (data, e) => {
        console.log("onSummit.selectMusic", selectedMusic);
        if (!selectedMusic) {
            setHasMusicError(true);
            return;
        }
        setHasMusicError(false);

        console.log("onSummit.selectImage", selectedImage);
        if (!selectedImage) {
            setHasImageError(true);
            return;
        }
        setHasImageError(false);

        // set the Payload //
        let pload = {
            name: data.name,
            description: data.description,
            symbol: data.symbol,
            price: data.price,
            length: data.length,
            property: data.propertiy,
            royality: data.royality,
            musicFile: selectedMusic,
            imageFile: selectedImage,
        };
        setPayload(pload);

        // set the File Blob//
        let fs = [pload.imageFile, pload.musicFile];
        setFiles(fs);

        // set the Attributes //
        let attrs: IMetadataExtension = {
            name: '',
            symbol: '',
            collection: '',
            description: '',
            external_url: '',
            image: '',
            animation_url: undefined,
            attributes: undefined,
            seller_fee_basis_points: 0,
            creators: [],
            properties: {
                files: [],
                category: MetadataCategory.Audio,
            },
        };

        // load the (name, symbole, description) //
        attrs = {
            ...attrs, ...{
                name: pload.name,
                symbol: pload.symbol,
                description: pload.description,
            }
        }

        // load the attribute (price, length, property) //
        attrs = {
            ...attrs, ...{
                attributes: [
                    { trait_type: 'price', value: pload.price, display_type: 'price' },
                    { trait_type: 'length', value: pload.length, display_type: 'length' },
                    { trait_type: 'property', value: pload.property, display_type: 'property' }
                ],
            }
        }

        // load the files (musicFile, imageFile) //
        attrs = {
            ...attrs, ...{
                image: pload.imageFile.name || '',
                properties: {
                    files: fs
                        .filter(f => f)
                        .map(f => {
                            const uri = typeof f === 'string' ? f : f?.name || '';
                            const type =
                                typeof f === 'string' || !f
                                    ? 'unknown'
                                    : f.type || getLast(f.name.split('.')) || 'unknown';

                            return {
                                uri,
                                type,
                            } as MetadataFile;
                        }),
                    category: MetadataCategory.Audio,
                },
            }
        }

        // compute the royalty (royalty) //
        attrs = {
            ...attrs, ...{
                seller_fee_basis_points: pload.royality * 100
            }
        }

        // create the creator //
        if (wallet.publicKey) {
            attrs = {
                ...attrs, ...{
                    creators: [new Creator({ address: wallet.publicKey.toBase58(), verified: true, share: 100 })]
                }
            }
        }
        setAttributes(attrs);
        console.log('onSubmit.attrs', attrs);

        // compute the $usd from sol //
        const cost = await getCost(attrs, fs);
        console.log('onSubmit.cost', cost);

        const amount = typeof cost === 'string' ? parseFloat(cost) : cost;
        let formattedAmount = `${amount}`;
        if (amount >= 1) {
            formattedAmount = formatAmount(amount);
        }
        const solprice = await solToUSD();
        const usd = solprice * amount;
        setSol(parseFloat(cost.toFixed(5)));
        setUsd(parseFloat(usd.toFixed(5)));
        console.log('onSubmit', cost.toFixed(5), usd.toFixed(5));

        // update the payload to send the to mint page, with the fee/usd //
        pload = Object.assign(pload, { feeSol: cost, feeUSD: usd });
        setPayload(pload)

        // show the confirm dialog //
        setShowConfirmModal(true);

        // make sure to call the following in order to input-component validation 
        e.preventDefault();
    };

    const COINGECKO_API = 'https://api.coingecko.com/api/v3/';
    const COINGECKO_COIN_PRICE_API = `${COINGECKO_API}simple/price`;

    const solToUSD = async (): Promise<number> => {
        const url = `${COINGECKO_COIN_PRICE_API}?ids=solana&vs_currencies=usd`;
        const resp = await window.fetch(url).then(resp => resp.json());
        return resp.solana.usd;
    };

    return (
        <>
            <div
                className={clsx(
                    "create-area",
                    space === 1 && "rn-section-gapTop",
                    className
                )}
            >
                <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    <div className="container">
                        <div className="row g-5">
                            <div className="col-lg-3 offset-1 ml_md--0 ml_sm--0">
                                <div className="upload-area">
                                    <div className="upload-formate mb--30">
                                        <h6 className="title">
                                            Upload music sound
                                        </h6>
                                        <p className="formate">
                                            Drag or choose your file to upload
                                        </p>
                                    </div>
                                    <div className="brows-file-wrapper">
                                        <input
                                            name="musicFile"
                                            id="musicFile"
                                            type="file"
                                            className="inputfile"
                                            accept="audio/wav, .mp3"
                                            // data-multiple-caption="{count} files selected"
                                            // multiple
                                            onChange={musicChange}
                                        />

                                        <label
                                            htmlFor="musicFile"
                                            title="No File Choosen"
                                        >
                                            <i className="feather-upload" />
                                            <span className="text-center">
                                                {selectedMusic
                                                    ? selectedMusic.name
                                                    : "Choose a File"}
                                            </span>
                                            <p className="text-center mt--10">
                                                MP3, WAV.
                                            </p>
                                        </label>
                                    </div>
                                    {hasMusicError && (
                                        <ErrorText>
                                            Music asset is required
                                        </ErrorText>
                                    )}
                                </div>

                                {/* <div className="mt--30 mt_sm--30 mt_md--30 d-none d-lg-block">
                                    <h5> Note: </h5>
                                    <span>
                                        {" "}
                                        Cost to create :{" "}
                                        <strong> 0 SOL $0</strong>
                                    </span>
                                </div> */}
                            </div>
                            <div className="col-lg-7">
                                <div className="form-wrapper-one">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-box pb-20">
                                                <div className="collection-single-wized">
                                                    <div className="upload-area">
                                                        <div className="upload-formate mb--30">
                                                            <h6 className="title">
                                                                Upload cover
                                                                image
                                                            </h6>
                                                            <p className="formate">
                                                                Drag or choose
                                                                your file to
                                                                upload
                                                            </p>
                                                        </div>
                                                        <div className="brows-file-wrapper">
                                                            <input
                                                                name="imageFile"
                                                                id="imageFile"
                                                                type="file"
                                                                className="inputfile"
                                                                accept="image/jpg, .png"
                                                                // data-multiple-caption="{count} files selected"
                                                                // multiple
                                                                onChange={
                                                                    imageChange
                                                                }
                                                            />
                                                            {selectedImage && (
                                                                <img
                                                                    id="createfileImage"
                                                                    src={URL.createObjectURL(
                                                                        selectedImage
                                                                    )}
                                                                    alt=""
                                                                    data-black-overlay="6"
                                                                />
                                                            )}
                                                            <label
                                                                htmlFor="imageFile"
                                                                title="No File Choosen"
                                                            >
                                                                <i className="feather-upload" />
                                                                <span className="text-center">
                                                                    Choose a
                                                                    File
                                                                </span>
                                                                <p className="text-center mt--10">
                                                                    JPG, PNG.
                                                                </p>
                                                            </label>
                                                        </div>
                                                        {hasImageError && (
                                                            <ErrorText>
                                                                Image asset is
                                                                required
                                                            </ErrorText>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label"
                                                >
                                                    Product Name
                                                </label>
                                                <input
                                                    id="name"
                                                    placeholder="e. g. `Digital Awesome Game`"
                                                    {...register("name", {
                                                        required:
                                                            "Name is required",
                                                    })}
                                                />
                                                {errors.name && (
                                                    <ErrorText>
                                                        {errors.name?.message as any}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label"
                                                >
                                                    Product Symbol
                                                </label>
                                                <input
                                                    id="symbol"
                                                    placeholder="e. g. `DAT"
                                                    {...register("symbol", {
                                                        required:
                                                            "Symbol is required",
                                                    })}
                                                />
                                                {errors.symbol && (
                                                    <ErrorText>
                                                        {errors.symbol?.message as any}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Description"
                                                    className="form-label"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    placeholder="e. g. “After purchasing the product you can get item...”"
                                                    {...register(
                                                        "description",
                                                        {
                                                            required:
                                                                "Description is required",
                                                        }
                                                    )}
                                                />
                                                {errors.description && (
                                                    <ErrorText>
                                                        {
                                                            errors.description
                                                                ?.message as any
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="price"
                                                    className="form-label"
                                                >
                                                    Item Price in $
                                                </label>
                                                <input
                                                    id="price"
                                                    placeholder="e. g. `20$`"
                                                    {...register("price", {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message:
                                                                "Please enter a number",
                                                        },
                                                        required:
                                                            "Price is required",
                                                    })}
                                                />
                                                {errors.price && (
                                                    <ErrorText>
                                                        {errors.price?.message as any}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="length"
                                                    className="form-label"
                                                >
                                                    Length
                                                </label>
                                                <input
                                                    id="length"
                                                    placeholder="e. g. `10s`"
                                                    {...register("length", {
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message:
                                                                "Please enter a number",
                                                        },
                                                        required:
                                                            "Length is required",
                                                    })}
                                                />
                                                {errors.size && (
                                                    <ErrorText>
                                                        {errors.size?.message as any}
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Propertie"
                                                    className="form-label"
                                                >
                                                    Properties
                                                </label>
                                                <input
                                                    id="propertiy"
                                                    placeholder="e. g. `Propertie`"
                                                    {...register("propertiy", {
                                                        required:
                                                            "Propertiy is required",
                                                    })}
                                                />
                                                {errors.propertiy && (
                                                    <ErrorText>
                                                        {
                                                            errors.propertiy
                                                                ?.message as any
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="input-box pb--20">
                                                <label
                                                    htmlFor="Royality"
                                                    className="form-label"
                                                >
                                                    Royality
                                                </label>
                                                <input
                                                    id="royality"
                                                    placeholder="e. g. `20%`"
                                                    {...register("royality", {
                                                        required:
                                                            "Royality is required",
                                                    })}
                                                />
                                                {errors.royality && (
                                                    <ErrorText>
                                                        {
                                                            errors.royality
                                                                ?.message as any
                                                        }
                                                    </ErrorText>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-box">
                                                <Button
                                                    size="large"
                                                    className="mt--10 my--10 d-block m-auto"
                                                    type="submit"
                                                    label=""
                                                    onClick={(e) => { }}
                                                    path=""
                                                    color="primary"
                                                    shape="square"
                                                    fullwidth={true}
                                                >
                                                    PAY WITH SOL
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {showConfirmModal && (
                <ConfirmModal
                    show={showConfirmModal}
                    OkHandleModal={() => handleConfirmModal()}
                    CancelHandleModal={handleCancelModal}
                    title="Confirm"
                    content={`<p>Do you want to continue to mint your NFT ?<br>You have to pay sol ${sol} $${usd}</p>`}
                />
            )}
        </>
    );
};

CreateNewArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
};

CreateNewArea.defaultProps = {
    space: 1,
};

export default CreateNewArea;
