import React from 'react';
import PropTypes from 'utils/propTypes';

import { Card, CardText, CardTitle, Progress, Row, Col } from 'reactstrap';
import Typography from '../Typography';

const ThreeDataWidget = ({
  title,
  color,
  data,
  ...restProps
}) => {
  if(!data)
    data = [];

  var body = []
  data.forEach((pt, i)=> {
    body.push(
        <Col sm={4} key={i}>
          <Row>
            <Col>
              <Typography tag="span" className="text-muted">
                {pt.name}
              </Typography>
            </Col>
          </Row>
          <Row>
            <Col>
              <Typography tag="span">
                {pt.value}
              </Typography>
            </Col>
          </Row>
        </Col>
      )
  })
  return (
    <Card body {...restProps}>
      <div className="d-flex justify-content-between">
        <CardText tag="div">
          <Typography className="mb-0">
            <strong>{title}</strong>
          </Typography>
        </CardText>
      </div>
      <Row style={{ textAlign: 'center' }}>
        {body}
      </Row>
    </Card>
  );
};

        // <CardTitle className={`text-${color}`}>{number}</CardTitle>

ThreeDataWidget.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
  ]),
  data: PropTypes.array,

};

ThreeDataWidget.defaultProps = {
  title: '',
  color: 'primary',
  data: [{
    name: "First",
    value: 10
  }, {
    name: "Second",
    value: 100
  }, {
    name: "Third",
    value: "1000"
  }]
};

export default ThreeDataWidget;
