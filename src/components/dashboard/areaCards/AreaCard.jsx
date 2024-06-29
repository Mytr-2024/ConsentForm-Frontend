import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const AreaCard = ({ colors, percentFillValue, cardInfo,cardImage}) => {
  const filledValue = (percentFillValue / 100) * 360; // 360 degress for a full circle
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Remained", value: remainedValue },
    { name: "Achieved Sales", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${(value / 360) * 100} %`;
  };

  return (
    <div style={{border:"2px solid #7C46BE"}}  className="area-card d-flex">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>

      </div>
      <div className="area-card-chart">
      <img style={{height:"90px"}} src={cardImage} alt=""/>
      </div>
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
};
