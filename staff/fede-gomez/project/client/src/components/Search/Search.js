import React from "react";
import { Input, Col } from "mdbreact";

class SearchPage extends React.Component {
  render() {
    return (
      <Col md="6">
        <Input hint="Search" type="text" containerClass="mt-0" />
      </Col>
    );
  }
}

export default SearchPage;