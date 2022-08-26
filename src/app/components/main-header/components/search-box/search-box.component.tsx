import { FC, DetailedHTMLProps, InputHTMLAttributes, MouseEventHandler } from 'react';
import classnames from 'classnames';
import { ReactComponent as MagnifierIcon } from './assets/images/magnifier.icon.svg';

import './assets/styles/search-box.styles.scss';

interface SearchBoxProps {
  onButtonClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

// TODO: Fix "Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?"
export const SearchBox: FC<
  SearchBoxProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
  const { onButtonClick, ...inputAttributeProps } = props;

  return (
    <div className="search-box">
      <button className="search-box__button" type="button" onClick={onButtonClick}>
        <MagnifierIcon className="search-box__image" />
      </button>
      <input
        {...inputAttributeProps}
        className={classnames(inputAttributeProps.className, 'search-box__input')}
        placeholder="Search by Items, Collect..."
        type="text"
      />
    </div>
  );
};

SearchBox.defaultProps = {
  className: '',
  onButtonClick: undefined
};
