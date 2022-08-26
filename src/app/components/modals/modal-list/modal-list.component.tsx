import { ChangeEventHandler, FC, useMemo, useRef, useState } from 'react';
import { parseEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { BasicModal } from '../basic-modal.component';
import { ModalScreenLoading } from '../modal-screen-loading/modal-screen-loading.component';
import { GradientButton } from '../../gradient-button/gradient-button.component';
import { Asset } from '../../../types/api/Asset';
import { TokenType } from '../../../../constants/token-type.enum';

import diamond from '../../../../assets/images/diamond.png';
import { ReactComponent as EtherIcon } from '../../../../assets/images/ether-icon.svg';
import { ReactComponent as BtnCircleMinus } from '../../../../assets/images/btn-circle-minus.svg';
import { ReactComponent as BtnCirclePlus } from '../../../../assets/images/btn-circle-plus.svg';

import './modal-list.styles.scss';
import { getChainById, getTransactionLink } from '../../../../constants/chains';
import { normalizeEthPrice } from '../../../../utils/eth-utils';
import { Order } from '../../../types/api/Order';
import {
  exchangeContractsAddresses,
  useErc1155StreakContract,
  useErc721StreakContract,
  useExchangeStreak
} from '../../../../hooks/useContract';
import { ModalScreenError } from '../modal-screen-error/modal-screen-error.component';

interface IProps {
  asset?: Asset;
  orders?: Order[];
  isOpen?: boolean;
  onRequestClose?: () => unknown;
  onTxStart?: (tx?: any) => unknown;
}

export const ModalList: FC<IProps> = (props) => {
  const { asset, orders, onRequestClose, onTxStart, isOpen = false } = props;
  const { account, chainId } = useWeb3React();
  const chain = getChainById(chainId);

  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [price, setPrice] = useState('0.1');
  const [quantity, setQuantity] = useState(1);
  const [waitingForTx, setWaitingForTx] = useState(false);
  const [error, setError] = useState(false);
  const txRef = useRef<any>();
  const gasEstimateRef = useRef<BigNumber>();

  const exchangeContract = useExchangeStreak(chain);
  const erc721Contract = useErc721StreakContract(chain);
  const erc1155Contract = useErc1155StreakContract(chain);

  const amountOwned: number = useMemo(() => {
    return (
      asset?.balances?.reduce((prev: number, curr: any) => {
        return curr.user.address === account ? prev + curr.quantity : prev;
      }, 0) || 0
    );
  }, [asset, account]);

  const amountOwnedOnSale: number = useMemo(() => {
    const yourActiveOrders = orders?.filter(
      (i) => i.side === 'SELL' && i.status === 'ACTIVE' && i.creator.address === account
    );
    return yourActiveOrders?.reduce((prev: number, curr: any) => curr.quantity + prev, 0) || 0;
  }, [amountOwned, orders, account]);

  const amountOwnedSaleable = amountOwned - amountOwnedOnSale;

  const checkIfApproved = async (type?: TokenType): Promise<boolean> => {
    if (!chain) throw new Error('Chain is not supported');

    if (type === TokenType.ERC721) {
      if (!erc721Contract) throw new Error('ERC721 contract is not provided');
      return erc721Contract.isApprovedForAll(account, exchangeContractsAddresses[chain]);
    }
    if (type === TokenType.ERC1155) {
      if (!erc1155Contract) throw new Error('ERC1155 contract is not provided');
      return erc1155Contract.isApprovedForAll(account, exchangeContractsAddresses[chain]);
    }
    throw new Error('Unknown asset type');
  };

  const approveForAll = async (type?: TokenType): Promise<any> => {
    if (!chain) throw new Error('Chain is not supported');

    if (type === TokenType.ERC721) {
      if (!erc721Contract) throw new Error('ERC721 contract is not provided');
      return erc721Contract.setApprovalForAll(exchangeContractsAddresses[chain], true);
    }
    if (type === TokenType.ERC1155) {
      if (!erc1155Contract) throw new Error('ERC1155 contract is not provided');
      return erc1155Contract.setApprovalForAll(exchangeContractsAddresses[chain], true);
    }

    throw new Error('Unknown asset type');
  };

  const estimateGas = async (): Promise<BigNumber> => {
    if (!exchangeContract) throw new Error('Exchange contract is not provided');
    if (!erc721Contract) throw new Error('ERC721 contract is not provided');
    if (!asset) throw new Error('Asset is not provided');
    if (!chain) throw new Error('Chain is not supported');

    if (asset.type === TokenType.ERC721) {
      return exchangeContract.estimateGas.listToken(asset.token_id, parseEther(price));
    }
    if (asset.type === TokenType.ERC1155) {
      return exchangeContract.estimateGas.listToken1155(
        asset.token_id,
        quantity,
        parseEther(price)
      );
    }
    throw new Error('Unknown token type');
  };

  const list = async (gasEstimate: BigNumber | number) => {
    if (!exchangeContract) throw new Error('Contract is not provided');
    if (!asset) throw new Error('Asset is not provided');

    if (asset.type === TokenType.ERC721) {
      return exchangeContract.listToken(asset.token_id, parseEther(price), {
        gasLimit: gasEstimate
      });
    }
    if (asset.type === TokenType.ERC1155) {
      return exchangeContract.listToken1155(asset.token_id, quantity, parseEther(price), {
        gasLimit: gasEstimate
      });
    }
    throw new Error('Unknown token type');
  };

  const handleApprove = async () => {
    try {
      const tx = await approveForAll(asset?.type);
      setWaitingForTx(true);
      await tx.wait();
      gasEstimateRef.current = await estimateGas();
      setWaitingForTx(false);
      setIsApproved(true);
    } catch (err) {
      setWaitingForTx(false);
      console.error(err);
      alert('ApproveForAll error');
    }
  };

  const handleQuantityMinus = () => {
    if (waitingForTx) return;
    if (quantity - 1 < 1) return;
    setQuantity(quantity - 1);
  };

  const handleQuantityPlus = () => {
    if (waitingForTx) return;
    if (quantity + 1 > amountOwnedSaleable) return;
    setQuantity(quantity + 1);
  };

  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPrice(e.target.value.replace(/[^\d.]/g, '').substr(0, 10));
  };

  const handleRequestClose = () => {
    onRequestClose?.();
    txRef.current = undefined;
    setIsLoading(true);
    setIsComplete(false);
    setWaitingForTx(false);
    setError(false);
  };

  const handleAfterOpen = async () => {
    try {
      const isUserApproved = await checkIfApproved(asset?.type);
      if (isUserApproved) {
        gasEstimateRef.current = await estimateGas();
        setIsApproved(true);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      handleRequestClose();
    }
  };

  const handleConfirm = async () => {
    if (waitingForTx) return;
    try {
      setWaitingForTx(true);
      txRef.current = await list(gasEstimateRef.current || 25000);
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
        <ModalScreenLoading title="List token" onCancel={handleRequestClose} />
      </BasicModal>
    );
  }

  const parsedPrice = parseFloat(price);
  const isPriceValid = /^((\.\d+)|(\d+(\.\d+)?))$/.test(price) && parsedPrice > 0;
  const totalPrice =
    isPriceValid && parsedPrice
      ? normalizeEthPrice(parseEther(price).mul(quantity).toString())
      : '---';

  return (
    <BasicModal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      onAfterOpen={handleAfterOpen}
      hideCloseBtn={waitingForTx}
    >
      {!isApproved && (
        <div className="modal-list-approve">
          <p className="modal-list-approve__text">
            In order to sell tokens, you need give your permission to the contract.
          </p>
          <p className="modal-list-approve__subtext">You only need to do this once. Proceed?</p>
          <GradientButton
            className="modal-list-approve__btn"
            loading={waitingForTx}
            variant="filled"
            onClick={handleApprove}
          >
            Approve
          </GradientButton>
        </div>
      )}
      {!isComplete && isApproved && (
        <div className="modal-list">
          <p className="modal-list__title">Selling</p>
          <p className="modal-list__subtitle">
            You are about to sell
            <span className="modal-list__subtitle-bold"> {asset?.title}</span>
          </p>
          <div
            className={cn(
              'modal-list__input-group',
              waitingForTx && 'modal-list__input-group--darken'
            )}
          >
            <div className="modal-list__price">
              <EtherIcon className="modal-list__price-icon" />
              <input
                className="modal-list__price-input"
                onChange={handlePriceChange}
                value={price}
                disabled={waitingForTx}
              />
            </div>
            {asset?.type === TokenType.ERC1155 && (
              <div className="modal-list__quantity">
                <span className="modal-list__quantity-available">
                  Available: {amountOwnedSaleable}
                </span>
                <BtnCircleMinus
                  className="modal-list__quantity-minus"
                  onClick={handleQuantityMinus}
                />
                <span className="modal-list__quantity-value">{quantity}</span>
                <BtnCirclePlus className="modal-list__quantity-plus" onClick={handleQuantityPlus} />
              </div>
            )}
          </div>
          <div className="modal-list__subtotal">
            <span
              className={cn(
                'modal-list__subtotal-title',
                waitingForTx && 'modal-list__subtotal-title--darken'
              )}
            >
              Total price
            </span>
            <span className="modal-list__subtotal-value">{totalPrice} ETH</span>
          </div>
          <GradientButton
            disabled={!isPriceValid}
            className={cn('modal-list__confirm', waitingForTx && 'modal-list__confirm--darken')}
            variant="filled"
            onClick={handleConfirm}
          >
            Confirm your bid
          </GradientButton>
        </div>
      )}
      {isComplete && (
        <div className="modal-list-complete">
          <img className="modal-list-complete__img" src={diamond} alt="icon" />
          <p className="modal-list-complete__title">Ready. Set. Collect.</p>
          <p className="modal-list-complete__subtitle">Your transaction has been started</p>
          <GradientButton
            onClick={handleViewTransactionClick}
            className="modal-list-complete__transaction-btn"
            variant="contained"
          >
            View transaction
          </GradientButton>
        </div>
      )}
    </BasicModal>
  );
};
