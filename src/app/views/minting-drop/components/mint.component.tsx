import cn from 'classnames';
import '../minting-drop.styles.scss';
import img_mint from '../images/img-mint.png';

const MintSection = (props: any) => {
  return (
    <section className="mint-section">
      <div className="floating-icon">Bar icons</div>
      <div className="col-md-6 mint-content">
        <p className="content-title">
          <span className="gradient-title">GENESIS</span> ipsum dolor sit amet, consectetur
        </p>
        <p className="content-detail">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce feugiat mauris nec suscipit
          maximus. Pellentesque suscipit enim quis euismod auctor. Praesent eget erat leo.
        </p>
        <button type="button" className="content-mint" onClick={props.toggleCheckOutModal}>
          Mint Yours Now!
        </button>
      </div>
      <div className="col-md-6 mint-information">
        <figure className="figure">
          <img className="infor-img" src={img_mint} alt="information" />
        </figure>
        <div className="information-detail">
          <div className="end-time">
            <p className="text">Limited Drop Ends In</p>
            <p className="time">01:23:59</p>
          </div>
          <div className="split" />
          <div className="mint-ranking">
            <p className="text"># Of NFT’s Minted</p>
            <p className="ranking">420/6,000</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MintSection;
