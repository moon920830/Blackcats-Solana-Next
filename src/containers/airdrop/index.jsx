import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ImageUpload from "@ui/image-upload";
import AirdropInput from "@ui/airdrop-input";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import NiceSelect from "@ui/nice-select";
import { isEmpty } from "@utils/methods";

const AirdropArea = () => {
    const [collection, setCollection] = useState("");
    const [hasCatError, setHasCatError] = useState(false);

    const notify = () => toast("Your airdrop request has submitted");
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        watch,
    } = useForm({
        mode: "onChange",
    });

    // const onSendSPLTransaction = useCallback(
    //     async (toPubkey) => {

    //         const toastId = toast.loading('Processing transaction...')
    //         try {
    //             if (!publicKey) throw new WalletNotConnectedError()
    //             const toPublicKey = new PublicKey(toPubkey)
    //             const mint = new PublicKey('77rQGky8igxvjFZXSgeA1rk3w1dvS6LK4s3otsR8eR63')
    //             const payer = "Hv7LKzg2i5D1z7e2SU4zvz6sk3qgbep67eV2XmriYQdN" // how to get this Signer
    //             const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer)
    //             const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(publicKey)
    //             const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(toPublicKey)

    //             const transaction = new Transaction().add(
    //                 Token.createTransferInstruction(
    //                     TOKEN_PROGRAM_ID,
    //                     fromTokenAccount.address,
    //                     toTokenAccount.address,
    //                     publicKey,
    //                     [],
    //                     0
    //                 )
    //             )

    //             const signature = await sendTransaction(transaction, connection)

    //             const response = await connection.confirmTransaction(signature, 'processed')
    //             console.log('response', response)
    //             toast.success('Transaction sent', {
    //                 id: toastId,
    //             })
    //         } catch (error) {
    //             toast.error(`Transaction failed: ${error.message}`, {
    //                 id: toastId,
    //             })
    //         }
    //     },
    //     [publicKey, sendTransaction, connection]
    // )

    watch(["logoImg", "featImg", "bannerImg"]);

    const onSubmit = (data) => {
        setHasCatError(!collection);
        notify();
        reset();
    };

    const collectionHandler = (item) => {
        setCollection(item.value);
    };

    const onAddAddressHandler = (item) => {
        console.log("onAddAddressHandler");
    };

    return (
        <div className="airdrop-area pt--80">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="airdrop-form-wrapper"
                        >
                            <div className="airdrop-wized">
                                <h6 className="title">
                                    Enter NFT Airdrop Details
                                </h6>
                                <span className="sub">
                                    Let's get started with some details about
                                    your NFT airdrop campaign
                                </span>
                            </div>
                            <hr className="divider" />
                            <div className="airdrop-wized">
                                <h6 className="title">
                                    Recipient Wallet Address
                                </h6>
                                <span className="sub">
                                    Enter your recipient wallet address(es) and
                                    token IDs
                                </span>
                                <AirdropInput
                                    name="airdropInput"
                                    placeholder="Enter Recipient wallet address"
                                    options={[]}
                                    className="panel"
                                />
                            </div>
                            {/* <div className="airdrop-wized">
                                <h6 className="title">Select NFT Collection</h6>
                                <span className="sub">
                                    Select an NFT collection you own in your
                                    wallet connected to Coinvise
                                </span>
                                <div className="airdrop-input">
                                    <NiceSelect
                                        name="collection"
                                        placeholder="Select NFT Collection"
                                        options={[]}
                                        onChange={collectionHandler}
                                    />
                                    {((!collection && !isEmpty(errors)) ||
                                        hasCatError) && (
                                            <ErrorText>
                                                Select a NFT Collection
                                            </ErrorText>
                                        )}
                                </div>
                            </div> */}
                            {/* <div className="airdrop-wized">
                                <h6 className="title">Featured image</h6>
                                <span className="sub">
                                    This image will be used for featuring your
                                    collection on the homepage, category pages,
                                    or other promotional areas of OpenSea. 600 x
                                    400 recommended.
                                </span>
                                <ImageUpload
                                    className="feature-image"
                                    id="featImg"
                                    placeholder={{
                                        src: "/images/portfolio/portfolio-12.jpg",
                                    }}
                                    preview={getValues("featImg")?.[0]}
                                    {...register("featImg", {
                                        required: "Upload feature image",
                                    })}
                                />
                                {errors.featImg && (
                                    <ErrorText>
                                        {errors.featImg?.message}
                                    </ErrorText>
                                )}
                            </div>
                            <div className="airdrop-wized">
                                <h6 className="title">Banner image</h6>
                                <span className="sub">
                                    This image will appear at the top of your
                                    collection page. Avoid including too much
                                    text in this banner image, as the dimensions
                                    change on different devices. 1400 x 400
                                    recommended.
                                </span>
                                <ImageUpload
                                    className="banner-image"
                                    id="bannerImg"
                                    placeholder={{
                                        src: "/images/profile/cover-01.jpg",
                                    }}
                                    preview={getValues("bannerImg")?.[0]}
                                    {...register("bannerImg", {
                                        required: "Upload banner image",
                                    })}
                                />
                                {errors.bannerImg && (
                                    <ErrorText>
                                        {errors.bannerImg?.message}
                                    </ErrorText>
                                )}
                            </div>
                            <div className="airdrop-wized">
                                <h6 className="title required">Name</h6>
                                <div className="airdrop-input">
                                    <input
                                        className="name"
                                        type="text"
                                        {...register("name", {
                                            required: "Name is required",
                                        })}
                                    />
                                    {errors.name && (
                                        <ErrorText>
                                            {errors.name?.message}
                                        </ErrorText>
                                    )}
                                </div>
                            </div>
                            <div className="airdrop-wized">
                                <h6 className="title">Description</h6>
                                <span className="sub">
                                    Markdown syntax is supported. 0 of 1000
                                    characters used.
                                </span>
                                <div className="airdrop-input">
                                    <textarea
                                        className="text-area"
                                        {...register("description", {
                                            required: "Description is required",
                                        })}
                                    />
                                    {errors.description && (
                                        <ErrorText>
                                            {errors.description?.message}
                                        </ErrorText>
                                    )}
                                </div>
                            </div>
                            <div
                                className="airdrop-wized"
                                style={{ textAlign: "center" }}
                            >
                                <Button
                                    type="submit"
                                    className="max-fit-content"
                                >
                                    CREATE
                                </Button>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirdropArea;
