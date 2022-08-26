import { FC, useRef, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { BasicModal } from '../basic-modal.component';
import { ModalScreenLoading } from '../modal-screen-loading/modal-screen-loading.component';
import { GradientButton } from '../../gradient-button/gradient-button.component';
import { TokenType } from '../../../../constants/token-type.enum';

import diamond from '../../../../assets/images/diamond.png';

import './modal-mint.styles.scss';
import { getChainById, getTransactionLink } from '../../../../constants/chains';
import { normalizeEthPrice } from '../../../../utils/eth-utils';
import { Order } from '../../../types/api/Order';
import useStateRef from '../../../../hooks/useStateRef';
import { useExchangeStreak } from '../../../../hooks/useContract';
import { ModalScreenError } from '../modal-screen-error/modal-screen-error.component';
import { ReactComponent as EtherIcon } from '../../../../assets/images/ether-icon.svg';
import { ReactComponent as BtnCircleMinus } from '../../../../assets/images/btn-circle-minus.svg';
import { ReactComponent as BtnCirclePlus } from '../../../../assets/images/btn-circle-plus.svg';

interface IProps {
  orders?: Order[];
  targetOrder?: Order;
  isOpen?: boolean;
  onRequestClose?: () => unknown;
  onTxStart?: (tx: any) => unknown;
}

export const ModalMint: FC<IProps> = (props) => {
  const { orders, targetOrder, onRequestClose, onTxStart, isOpen = false } = props;
  const { chainId, account } = useWeb3React();

  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [waitingForTx, setWaitingForTx] = useState(false);
  const [error, setError] = useState(false);
  const txRef = useRef<any>();
  const gasEstimateRef = useRef<BigNumber>();

  const exchangeContract = useExchangeStreak(getChainById(chainId));
  const yourOrders = orders?.filter((i) => i.creator.address === account);

  const estimateGas = async (): Promise<BigNumber> => {
    await new Promise((resolve) => setTimeout(() => resolve(1), 1000));
    return BigNumber.from(20000);
    // if (!exchangeContract) throw new Error('Contract is not provided');
    // if (!selectedOrderRef.current) throw new Error('Order is not selected');
    //
    // if (selectedOrderRef.current.asset.type === TokenType.ERC721) {
    //   return exchangeContract.estimateGas.removeListToken(selectedOrderRef.current.asset.token_id);
    // }
    // if (selectedOrderRef.current.asset.type === TokenType.ERC1155) {
    //   return exchangeContract.estimateGas.removeListToken1155(
    //     Number(selectedOrderRef.current.offer_id)
    //   );
    // }
    // throw new Error('Unknown token type');
  };

  // const unlist = async (gasEstimate: BigNumber | number) => {
  //   if (!exchangeContract) throw new Error('Contract is not provided');
  //   if (!selectedOrderRef.current) throw new Error('Order is not selected');
  //
  //   if (selectedOrderRef.current.asset.type === TokenType.ERC721) {
  //     return exchangeContract.removeListToken(selectedOrderRef.current.asset.token_id, {
  //       gasLimit: gasEstimate
  //     });
  //   }
  //   if (selectedOrderRef.current.asset.type === TokenType.ERC1155) {
  //     return exchangeContract.removeListToken1155(Number(selectedOrderRef.current.offer_id), {
  //       gasLimit: gasEstimate
  //     });
  //   }
  //   throw new Error('Unknown token type');
  // };

  const handleRequestClose = () => {
    onRequestClose?.();
    setQuantity(1);
    setIsLoading(true);
    setIsComplete(false);
    setWaitingForTx(false);
    setError(false);
  };

  const handleOrderSelect = async (order: Order) => {
    // setSelectedOrder(order);
    // setIsLoading(true);
    // try {
    //   gasEstimateRef.current = await estimateGas();
    //   setIsLoading(false);
    // } catch (err) {
    //   console.error(err);
    //   setError(true);
    // }
  };

  const handleConfirm = async () => {
    if (waitingForTx) return;
    try {
      setWaitingForTx(true);
      // txRef.current = await unlist(gasEstimateRef.current || 25000);
      // onTxStart?.(txRef.current);
      setIsComplete(true);
      setWaitingForTx(false);
    } catch (err) {
      console.error(err);
      setWaitingForTx(false);
    }
  };

  const handleQuantityMinus = () => {
    if (waitingForTx) return;
    if (quantity - 1 < 1) return;
    setQuantity(quantity - 1);
  };

  const MAX_QUANTITY = 20; // TODO: figure out
  const handleQuantityPlus = () => {
    if (waitingForTx) return;
    if (quantity + 1 > MAX_QUANTITY) return;
    setQuantity(quantity + 1);
  };

  const handleMaximumPurchase = () => {
    setQuantity(MAX_QUANTITY);
  };

  const handleViewTransactionClick = () => {
    // window.open(getTransactionLink(selectedOrder?.asset.chain_id, txRef.current?.hash), '_blank');
    handleRequestClose();
  };

  const handleViewNFTsClick = () => {
    handleRequestClose();
  };

  // const getOrderTotalPrice = (order: Order) => {
  //   const total = BigNumber.from(order.price).mul(order.quantity);
  //   return normalizeEthPrice(total.toString());
  // };
  // const getOrderCreatedDate = (order: Order) => {
  //   return formatRelative(new Date(order.created_at), new Date());
  // };

  const handleAfterOpen = async () => {
    console.log(123);
    try {
      // const isUserApproved = await checkIfApproved(asset?.type);
      gasEstimateRef.current = await estimateGas();
      // setIsApproved(true);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      handleRequestClose();
    }
  };

  if (error) {
    return (
      <BasicModal isOpen={isOpen} onRequestClose={handleRequestClose}>
        <ModalScreenError onClose={handleRequestClose} />
      </BasicModal>
    );
  }

  if (isLoading) {
    return (
      <BasicModal isOpen={isOpen} onRequestClose={handleRequestClose} onAfterOpen={handleAfterOpen}>
        <ModalScreenLoading title="Cancel order" onCancel={handleRequestClose} />
      </BasicModal>
    );
  }

  return (
    <BasicModal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      hideCloseBtn={waitingForTx}
      onAfterOpen={handleAfterOpen}
    >
      {!isComplete && (
        <div className="modal-mint">
          <p className="modal-mint__title">Checkout</p>
          <p className="modal-mint__subtitle">
            You are about to purchase
            <span className="modal-mint__subtitle-bold"> thing</span>
          </p>
          <div
            className={cn(
              'modal-mint__input-group',
              waitingForTx && 'modal-mint__input-group--darken'
            )}
          >
            <div className="modal-mint__quantity">
              <BtnCircleMinus
                className="modal-mint__quantity-minus"
                onClick={handleQuantityMinus}
              />
              <span className="modal-mint__quantity-value">{quantity}</span>
              <BtnCirclePlus className="modal-mint__quantity-plus" onClick={handleQuantityPlus} />
            </div>
            <div className="modal-mint__price">
              <EtherIcon className="modal-mint__price-icon" width={17} height={28} />
              <span className="modal-mint__price-value">0.2</span>
            </div>
          </div>
          <GradientButton
            className="modal-mint__max-purchase-btn"
            onClick={handleMaximumPurchase}
            filledColor="#201C21"
          >
            Maximum purchase
          </GradientButton>
          <div className="modal-mint__subtotal">
            <span
              className={cn(
                'modal-mint__subtotal-title',
                waitingForTx && 'modal-mint__subtotal-title--darken'
              )}
            >
              Total price
            </span>
            <span className="modal-mint__subtotal-value">0.1 ETH</span>
          </div>
          <GradientButton
            className={cn('modal-mint__confirm', waitingForTx && 'modal-mint__confirm--darken')}
            variant="filled"
            onClick={handleConfirm}
          >
            Process to payment
          </GradientButton>
        </div>
      )}
      {isComplete && (
        <div className="modal-mint-complete">
          <img className="modal-mint-complete__img" src={diamond} alt="icon" />
          <p className="modal-mint-complete__title">Ready. Set. Collect.</p>
          <p className="modal-mint-complete__subtitle">Your transaction has been started</p>
          <div className="modal-mint-complete__btn-group">
            <GradientButton
              onClick={handleViewNFTsClick}
              className="modal-mint-complete__view-nfts-btn"
              variant="filled"
            >
              View your NFT`s
            </GradientButton>
            <GradientButton
              onClick={handleViewTransactionClick}
              className="modal-mint-complete__transaction-btn"
              variant="contained"
              filledColor="#201C21"
            >
              View transaction
            </GradientButton>
          </div>
        </div>
      )}
    </BasicModal>
  );
};
