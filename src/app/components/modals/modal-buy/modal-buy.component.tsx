import { FC, useRef, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { BasicModal } from '../basic-modal.component';
import { ModalScreenLoading } from '../modal-screen-loading/modal-screen-loading.component';
import { GradientButton } from '../../gradient-button/gradient-button.component';
import { Asset } from '../../../types/api/Asset';
import { TokenType } from '../../../../constants/token-type.enum';
import { Order } from '../../../types/api/Order';
import { ReactComponent as EtherIcon } from '../../../../assets/images/ether-icon.svg';

import './modal-buy.styles.scss';
import { normalizeEthPrice } from '../../../../utils/eth-utils';
import diamond from '../../../../assets/images/diamond.png';
import { getChainById, getTransactionLink } from '../../../../constants/chains';
import useStateRef from '../../../../hooks/useStateRef';
import { useExchangeStreak } from '../../../../hooks/useContract';
import { ModalScreenOrderSelect } from '../modal-screen-order-select/modal-screen-order-select.component';
import { ModalScreenError } from '../modal-screen-error/modal-screen-error.component';

interface IProps {
  asset?: Asset;
  orders?: Order[];
  targetOrder?: Order;
  isOpen?: boolean;
  onRequestClose?: () => unknown;
  onTxStart?: (tx: any) => unknown;
}

export const ModalBuy: FC<IProps> = (props) => {
  const { asset, orders, targetOrder, onRequestClose, onTxStart, isOpen = false } = props;
  const { account, chainId } = useWeb3React();

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOrder, setSelectedOrder, selectedOrderRef] = useStateRef<Order | undefined>();
  const [waitingForTx, setWaitingForTx] = useState(false);
  const [error, setError] = useState(false);
  const txRef = useRef<any>();
  const gasEstimateRef = useRef<BigNumber>();

  const exchangeContract = useExchangeStreak(getChainById(chainId));
  const foreignOrders = orders?.filter((i) => i.creator.address !== account);

  const estimateGas = async (): Promise<BigNumber> => {
    if (!exchangeContract) throw new Error('Contract is not provided');
    if (!asset) throw new Error('Asset is not provided');
    if (!selectedOrderRef.current) throw new Error('Order is not provided');

    if (asset.type === TokenType.ERC721) {
      return exchangeContract.estimateGas.buyToken(asset.token_id, {
        value: selectedOrderRef.current.price.toString()
      });
    }
    if (asset.type === TokenType.ERC1155) {
      return exchangeContract.estimateGas.buyToken1155(
        selectedOrderRef.current.offer_id,
        selectedOrderRef.current.quantity,
        {
          value: BigNumber.from(selectedOrderRef.current.price)
            .mul(selectedOrderRef.current.quantity)
            .toString()
        }
      );
    }
    throw new Error('Unknown token type');
  };

  const buy = async (gasEstimate: BigNumber | number) => {
    if (!exchangeContract) throw new Error('Contract is not provided');
    if (!asset) throw new Error('Asset is not provided');
    if (!selectedOrderRef.current) throw new Error('Order is not provided');

    if (asset.type === TokenType.ERC721) {
      return exchangeContract.buyToken(selectedOrderRef.current.asset.token_id, {
        value: selectedOrderRef.current.price.toString(),
        gasLimit: gasEstimate
      });
    }
    if (asset.type === TokenType.ERC1155) {
      return exchangeContract.buyToken1155(
        selectedOrderRef.current.offer_id,
        selectedOrderRef.current.quantity,
        {
          gasLimit: gasEstimate,
          value: BigNumber.from(selectedOrderRef.current.price || '1')
            .mul(selectedOrderRef.current.quantity || '1')
            .toString()
        }
      );
    }
    throw new Error('Unknown token type');
  };

  const handleRequestClose = () => {
    onRequestClose?.();
    txRef.current = undefined;
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
      txRef.current = await buy(gasEstimateRef.current || 40000);
      onTxStart?.(txRef.current);
      setIsComplete(true);
      setWaitingForTx(false);
    } catch (err) {
      console.error(err);
      setWaitingForTx(false);
    }
  };

  const handleViewTransactionClick = () => {
    window.open(getTransactionLink(asset?.chain_id, txRef.current?.hash), '_blank');
    handleRequestClose();
  };

  const getOrderTotalPrice = (order?: Order) => {
    if (!order) return '---';
    const total = BigNumber.from(order.price).mul(order.quantity);
    return normalizeEthPrice(total.toString());
  };

  const handleAfterOpen = () => {
    const onlyOrder = foreignOrders?.length === 1 && foreignOrders.find(Boolean);
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
        <ModalScreenLoading title="Buy token" onCancel={handleRequestClose} />
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
      {!selectedOrder && foreignOrders && (
        <ModalScreenOrderSelect
          title="Choose Order to Buy"
          orders={foreignOrders}
          onOrderSelect={handleOrderSelect}
          showCreator
        />
      )}
      {!isComplete && selectedOrder && (
        <div className="modal-buy">
          <p className="modal-buy__title">Buy token</p>
          <p className="modal-buy__subtitle">
            You are about to buy
            <span className="modal-buy__subtitle-bold"> {asset?.title}</span>
          </p>
          <div className={cn('modal-buy__price', waitingForTx && 'modal-buy__price--darken')}>
            <EtherIcon className="modal-buy__price-icon" />
            <span className="modal-buy__price-value">{getOrderTotalPrice(selectedOrder)}</span>
          </div>
          <div className="modal-buy__subtotal">
            <span
              className={cn(
                'modal-buy__subtotal-title',
                waitingForTx && 'modal-buy__subtotal-title--darken'
              )}
            >
              Your total price
            </span>
            <span className="modal-buy__subtotal-value">
              {getOrderTotalPrice(selectedOrder)} ETH
            </span>
          </div>
          <GradientButton
            className={cn('modal-buy__confirm', waitingForTx && 'modal-buy__confirm--darken')}
            variant="filled"
            onClick={handleConfirm}
          >
            Confirm your bid
          </GradientButton>
        </div>
      )}
      {isComplete && (
        <div className="modal-buy-complete">
          <img className="modal-buy-complete__img" src={diamond} alt="icon" />
          <p className="modal-buy-complete__title">Ready. Set. Collect.</p>
          <p className="modal-buy-complete__subtitle">Your transaction has been started</p>
          <GradientButton
            onClick={handleViewTransactionClick}
            className="modal-buy-complete__transaction-btn"
            variant="contained"
          >
            View transaction
          </GradientButton>
        </div>
      )}
    </BasicModal>
  );
};
