import { FC, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import './minting-drop.styles.scss';
import StreamSection from './components/stream.component';
import MintSection from './components/mint.component';
import RoadMapSection from './components/roadmap.component';
import { ModalMint } from '../../components/modals/modal-mint/modal-mint.component';

import CheckoutModal from './components/modal/modal-checkout.component';
import FinishModal from './components/modal/modal-finish.component';
import WarnningModal from './components/modal/modal-warnning.component';
import { metaMaskProvider } from '../../../utils/wallet';
import { OptionalTuple } from '../../../types';
import { getAvailableCnt, getTokenURLS } from '../../../api/api';
import LoadingModal from './components/modal/modal-loading.component';
import PurchasingModal from './components/modal/modal-purchasing.component';
import DropMintingContract from '../../contract/abi/MintingDrop.abi.json';
import TestToken from '../../contract/abi/TestToken.abi.json';

export const MintingDrop: FC = () => {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const [isWarnning, setIsWarnning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isPurchase, setIsPurchase] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [countEth, setCountEth] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [purchaseStatus, setPurchaseStatus] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [availableCnt, setAvailableCnt] = useState(0);
  const [isMin, setIsMin] = useState(true);
  const [isMax, setIsMax] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const userLimitBalance = 0;

  const web3js = new Web3(window.ethereum);

  const getBigNumber = (source: any) => {
    // source += '';
    const parts = source.split('.');
    let decimals = 18;
    if (parts[1] && parts[1].length) decimals -= parts[1].length;
    const zero = '0';
    if (decimals < 0) return parts[0] + parts[1].slice(0, 18);
    // console.log(parts[0] + (parts[1] ? parts[1] : '') + zero.repeat(decimals));
    return parts[0] + (parts[1] ? parts[1] : '') + zero.repeat(decimals);
  };

  const toggleProgressModal = () => {
    setIsProgress(!isProgress);
  };
  const toggleLoadingModal = () => {
    setIsLoading(!isLoading);
  };
  const toggleWarnningModal = () => {
    setIsWarnning(!isWarnning);
  };

  const checkAccountStatus = async (): Promise<boolean> => {
    // check metamask login status
    const user: string = (await metaMaskProvider.currentUser()) || '';
    if (user === '') {
      setIsLoading(false);
      await metaMaskProvider.connect();
      return false;
    }
    setCurrentUser(user);

    // check if user have enough balance in metamask
    const currentUserInfo: OptionalTuple<string, Error> =
      (await metaMaskProvider.getBalance(user)) || '';
    const balanceInfo = Number(currentUserInfo[0]) / 10 ** 18;
    const balance = Number(parseFloat(String(balanceInfo)).toFixed(4));
    setTotalBalance(balance);
    if (balance === 0 || balance <= userLimitBalance) {
      setIsLoading(false);
      setIsWarnning(true);
      return false;
    }

    // get current available mint count
    const cnt = Number(await getAvailableCnt(user));
    console.log('cnt');
    console.log(cnt);
    setAvailableCnt(Number(cnt));
    if (cnt === 0) {
      setIsMax(true);
      setIsMin(true);
      setCountEth(0);
    } else if (cnt === countEth) {
      setIsMax(true);
      setIsMin(false);
    } else if (countEth === 0) {
      setIsMin(true);
      setIsMax(false);
    } else {
      setIsMin(false);
      setIsMax(false);
    }

    setIsLoading(false);
    return true;
  };

  const toggleCheckOutModal = async () => {
    toggleLoadingModal();
    // only in case opening the modal dialog
    if (isCheckOut === false) {
      const accountStatus = await checkAccountStatus();
      if (accountStatus === false) {
        return;
      }
    }
    setIsCheckOut(!isCheckOut);
  };
  const closeCheckOutModal = async () => {
    setIsCheckOut(false);
  };
  const toggleFinishModal = () => {
    setIsFinish(!isFinish);
  };
  const purchasePayment = async () => {
    setIsCheckOut(false);
    toggleProgressModal();
    setIsFailed(false);
    let response;
    try {
      // get tokenURLS
      const tokenURLs = await getTokenURLS(currentUser, countEth);
      // call dropMinting
      const address = process.env.REACT_APP_DROPMINTING_TOKEN;
      const tokenAddress = process.env.REACT_APP_TEST_TOKEN;
      const testToken = new web3js.eth.Contract(TestToken as AbiItem[], tokenAddress);
      const mintingDropContract = new web3js.eth.Contract(
        DropMintingContract.abi as AbiItem[],
        address
      );

      const approveFlag = 'false';
      if (approveFlag === 'false') {
        console.log('address');
        console.log(address);
        console.log('currentUser');
        console.log(currentUser);
        response = await testToken.methods
          .approve(address, getBigNumber('100000000000'))
          .send({ from: currentUser, gasPrice: '100000' })
          .on('error', function () {
            window.localStorage.setItem('approveFlag', 'false');
            console.log('approve failed');
          })
          .on('receipt', function () {
            window.localStorage.setItem('approveFlag', 'true');
            console.log('approve  uccess');
          });
      }

      console.log('dropMint');
      response = await mintingDropContract.methods.dropMint(tokenURLs).send({ from: currentUser });
      console.log(response);
    } catch (error: any) {
      setIsFailed(true);
      console.log(error);
    }
    setIsProgress(false);
    toggleFinishModal();
  };
  const togglePurchaseModal = () => {
    setIsPurchase(!isPurchase);
  };
  const maximumPurchase = () => {
    setCountEth(availableCnt);
    if (availableCnt > 0) {
      setIsMin(false);
      setIsMax(true);
      setPurchaseStatus(false);
    }
  };
  const minusEther = () => {
    if (countEth > 0) {
      setCountEth(countEth - 1);
      setIsMin(false);
      setIsMax(false);
      if (countEth === 1) {
        setPurchaseStatus(true);
        setIsMin(true);
      }
    }
  };
  const plusEther = () => {
    if (countEth < availableCnt) {
      setCountEth(countEth + 1);
      setIsMin(false);
      if (countEth === availableCnt - 1) {
        setIsMax(true);
      }
      setPurchaseStatus(false);
    }
  };

  // const toggleCheckOutModal = () => {
  //   setIsMintModalOpen(true);
  // };

  const handleMintModalClose = () => {
    setIsMintModalOpen(false);
  };

  return (
    <div className={cn('minting-drop-page-root')}>
      {/* <ModalMint isOpen={isMintModalOpen} onRequestClose={handleMintModalClose} /> */}
      <LoadingModal toggleLoadingModal={toggleLoadingModal} isLoading={isLoading} />
      <PurchasingModal toggleProgressModal={toggleProgressModal} isProgress={isProgress} />
      <WarnningModal
        isWarnning={isWarnning}
        toggleWarnningModal={toggleWarnningModal}
        totalBalance={totalBalance}
      />
      <FinishModal isFinish={isFinish} toggleFinishModal={toggleFinishModal} isFailed={isFailed} />
      <CheckoutModal
        toggleCheckOutModal={toggleCheckOutModal}
        closeCheckOutModal={closeCheckOutModal}
        isMin={isMin}
        isMax={isMax}
        isCheckOut={isCheckOut}
        countEth={countEth}
        availableCnt={availableCnt}
        serviceFee={serviceFee}
        minusEther={minusEther}
        plusEther={plusEther}
        maximumPurchase={maximumPurchase}
        purchasePayment={purchasePayment}
        purchaseStatus={purchaseStatus}
      />
      <StreamSection toggleCheckOutModal={toggleCheckOutModal} />
      <MintSection toggleCheckOutModal={toggleCheckOutModal} />
      <RoadMapSection />
    </div>
  );
};
