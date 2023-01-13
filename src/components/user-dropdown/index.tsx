import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Anchor from "@ui/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { useMoralis } from "react-moralis";
import { logout } from "../../redux/actions/authActions";

import {
    WRAPPED_SOL_MINT
} from "@oysterr/common";
import {
    useUserBalance,
} from 'src/hooks_market';


const UserDropdown = () => {
    // const { logout } = useMoralis();
    const avatar = useSelector((state: any) => state.auth.avatar);
    const firstname = useSelector((state: any) => state.auth.firstname);
    const lastname = useSelector((state: any) => state.auth.lastname);
    const u_id = useSelector((state: any) => state.auth.u_id);
    const wallet = useWallet();
    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(logout() as any);
    };
    const balance = useUserBalance(WRAPPED_SOL_MINT.toBase58(), wallet.publicKey?.toBase58());
    console.log('UserDropdown.balance', balance);

    return (
        <div className="icon-box">
            <Anchor path="/author"
                className={undefined}
                rel={undefined}
                label={undefined}
                target={undefined}
                onClick={undefined}>
                <Image
                    src={`/images/avatars/${avatar || "default.png"}`}
                    alt="Images"
                    layout="fixed"
                    width={38}
                    height={38}
                />
            </Anchor>
            <div className="rn-dropdown">
                <div className="rn-inner-top">
                    <h4 className="title">
                        <Anchor path="/product"
                            className={undefined}
                            rel={undefined}
                            label={undefined}
                            target={undefined}
                            onClick={undefined}>
                            {`${firstname} ${lastname}`}
                        </Anchor>
                    </h4>
                </div>
                <div className="rn-product-inner">
                    <ul className="product-list">
                        <li className="single-product-list">
                            <div className="thumbnail">
                                <Anchor
                                    path="/product"
                                    className={undefined}
                                    rel={undefined}
                                    label={undefined}
                                    target={undefined}
                                    onClick={undefined}>
                                    <Image
                                        src="https://cdn3d.iconscout.com/3d/premium/thumb/solana-coin-4693307-3895587.png"
                                        alt="Nft Product Images"
                                        layout="fixed"
                                        width={50}
                                        height={50}
                                    />
                                </Anchor>
                            </div>
                            <div className="content">
                                <h6 className="title">
                                    <Anchor path="/product"
                                        className={undefined}
                                        rel={undefined}
                                        label={undefined}
                                        target={undefined}
                                        onClick={undefined}>Balance</Anchor>
                                </h6>
                                <span className="price">{balance.balance.toFixed(2)} SOL</span>
                            </div>
                            <div className="button" />
                        </li>
                    </ul>
                </div>
                <ul className="list-inner">
                    <li>
                        <Anchor path={{
                            pathname: "/author/[u_id]",
                            query: {
                                u_id: u_id
                            }
                        }}
                            className={undefined}
                            rel={undefined}
                            label={undefined}
                            target={undefined}
                            onClick={undefined}>My Profile</Anchor>
                    </li>
                    <li>
                        <Anchor path="/edit-profile"
                            className={undefined}
                            rel={undefined}
                            label={undefined}
                            target={undefined}
                            onClick={undefined}>Edit Profile</Anchor>
                    </li>
                    <li>
                        <button type="button" onClick={() => signOut()}>
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserDropdown;
