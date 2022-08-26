import { FC, useRef, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { formatRelative } from 'date-fns';
import { BasicModal } from '../basic-modal.component';
import { ModalScreenLoading } from '../modal-screen-loading/modal-screen-loading.component';
import { GradientButton } from '../../gradient-button/gradient-button.component';
import { TokenType } from '../../../../constants/token-type.enum';

import diamond from '../../../../assets/images/diamond.png';

import './modal-cancel.styles.scss';
import { getChainById, getTransactionLink } from '../../../../constants/chains';
import { normalizeEthPrice } from '../../../../utils/eth-utils';
import { Order } from '../../../types/api/Order';
import useStateRef from '../../../../hooks/useStateRef';
import { useExchangeStreak } from '../../../../hooks/useContract';
import { ModalScreenOrderSelect } from '../modal-screen-order-select/modal-screen-order-select.component';
import { ModalScreenError } from '../modal-screen-error/modal-screen-error.component';

interface IProps {
  orders?: Order[];
  targetOrder?: Order;
  isOpen?: boolean;
  onRequestClose?: () => unknown;
  onTxStart?: (tx: any) => unknown;
}

export const ModalCancel: FC<IProps> = (props) => {
  const { orders, targetOrder, onRequestClose, onTxStart, isOpen = false } = props;
  const { chainId, account } = useWeb3React();

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOrder, setSelectedOrder, selectedOrderRef] = useStateRef<Order | undefined>();
  const [waitingForTx, setWaitingForTx] = useState(false);
  const [error, setError] = useState(false);
  const txRef = useRef<any>();
  const gasEstimateRef = useRef<BigNumber>();

  const exchangeContract = useExchangeStreak(getChainById(chainId));
  const yourOrders = orders?.filter((i) => i.creator.address === account);

  const estimateGas = async (): Promise<BigNumber> => {
    if (!exchangeContract) throw new Error('Contract is not provided');
    if (!selectedOrderRef.current) throw new Error('Order is not selected');

    if (selectedOrderRef.current.asset.type === TokenType.ERC721) {
      return exchangeContract.estimateGas.removeListToken(selectedOrderRef.current.asset.token_id);
    }
    if (selectedOrderRef.current.asset.type === TokenType.ERC1155) {
      return exchangeContract.estimateGas.removeListToken1155(
        Number(selectedOrderRef.current.offer_id)
      );
    }
    throw new Error('Unknown token type');
  };

  const unlist = async (gasEstimate: BigNumber | number) => {
    if (!exchangeContract) throw new Error('Contract is not provided');
    if (!selectedOrderRef.current) throw new Error('Order is not selected');

    if (selectedOrderRef.current.asset.type === TokenType.ERC721) {
      return exchangeContract.removeListToken(selectedOrderRef.current.asset.token_id, {
        gasLimit: gasEstimate
      });
    }
    if (selectedOrderRef.current.asset.type === TokenType.ERC1155) {
      return exchangeContract.removeListToken1155(Number(selectedOrderRef.current.offer_id), {
        gasLimit: gasEstimate
      });
    }
    throw new Error('Unknown token type');
  };

  const handleRequestClose = () => {
    onRequestClose?.();
    setIsLoading(false);
    setIsComplete(false);
    setWaitingForTx(false);
    setSelectedOrder(undefined);
    setError(false);
  };

  const handleOrderSelect = async (order: Order) => {
    setSelectedOrder(order);
    setIsLoading(true);
    try {
      gasEstimateRef.current = await estimateGas();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleConfirm = async () => {
    if (waitingForTx) return;
    try {
      setWaitingForTx(true);
      txRef.current = await unlist(gasEstimateRef.current || 25000);
      onTxStart?.(txRef.current);
      setIsComplete(true);
      setWaitingForTx(false);
    } catch (err) {
      console.error(err);
      setWaitingForTx(false);
    }
  };

  const handleViewTransactionClick = () => {
    window.open(getTransactionLink(selectedOrder?.asset.chain_id, txRef.current?.hash), '_blank');
    handleRequestClose();
  };

  const getOrderTotalPrice = (order: Order) => {
    const total = BigNumber.from(order.price).mul(order.quantity);
    return normalizeEthPrice(total.toString());
  };
  const getOrderCreatedDate = (order: Order) => {
    return formatRelative(new Date(order.created_at), new Date());
  };

  const handleAfterOpen = () => {
    const onlyOrder = yourOrders?.length === 1 && yourOrders.find(Boolean);
    if (targetOrder) {
      handleOrderSelect(targetOrder);
    } else if (onlyOrder) {
      handleOrderSelect(onlyOrder);
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
      <BasicModal isOpen={isOpen} onRequestClose={handleRequestClose}>
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
      {!selectedOrder && yourOrders && (
        <ModalScreenOrderSelect
          title="Choose Order to Cancel"
          orders={yourOrders}
          onOrderSelect={handleOrderSelect}
        />
      )}
      {!isComplete && selectedOrder && (
        <div className="modal-cancel">
          <p className="modal-cancel__title">Cancel order</p>
          <p className="modal-cancel__subtitle">
            You are about to cancel your order on
            <span className="modal-cancel__subtitle-bold"> {selectedOrder?.asset.title}</span>
            <span> for </span>
            <span className="modal-cancel__subtitle-bold">
              {getOrderTotalPrice(selectedOrder)} ETH
            </span>
            <span> created </span>
            <span className="modal-cancel__subtitle-bold">
              {getOrderCreatedDate(selectedOrder)}
            </span>
          </p>
          <GradientButton
            className={cn('modal-cancel__confirm', waitingForTx && 'modal-cancel__confirm--darken')}
            variant="filled"
            onClick={handleConfirm}
          >
            Cancel order
          </GradientButton>
        </div>
      )}
      {isComplete && (
        <div className="modal-cancel-complete">
          <img className="modal-cancel-complete__img" src={diamond} alt="icon" />
          <p className="modal-cancel-complete__title">Ready. Set. Collect.</p>
          <p className="modal-cancel-complete__subtitle">Your transaction has been started</p>
          <GradientButton
            onClick={handleViewTransactionClick}
            className="modal-cancel-complete__transaction-btn"
            variant="contained"
          >
            View transaction
          </GradientButton>
        </div>
      )}
    </BasicModal>
  );
};
