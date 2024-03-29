import React, { Component, useState } from 'react';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import Lozenge from '@atlaskit/lozenge';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Banner from '@atlaskit/banner';
import Alert from 'react-bootstrap/Alert'

export const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
        <EditorMoreIcon />
      {children}
    </a>
  ));

  export const Status = (props) => {
    return(
      <div>
        { props.status == 1 && <Lozenge appearance="success" isBold>ACTIVE</Lozenge> }
        { props.status == 0  && <Lozenge appearance="moved">INACTIVE</Lozenge> }
        { props.status === '' && <Lozenge appearance="moved">PENDING</Lozenge> }
        { props.status == 2 && <Lozenge appearance="removed" isBold>DEACTIVATED</Lozenge> }
    </div>
    );
  }

  export const Badge = (props) => {
    return(
      <span>
        { props.type == 'success' && <Lozenge appearance="success" isBold>{props.title}</Lozenge> }
        { props.type == '_success' && <Lozenge appearance="success">{props.title}</Lozenge> }
        { props.type == 'moved' && <Lozenge appearance="moved">{props.title}</Lozenge> }
        { props.type == 'inprogress' && <Lozenge appearance="inprogress" isBold>{props.title}</Lozenge> }
        { props.type == 'removed' && <Lozenge appearance="removed" isBold>{props.title}</Lozenge> }
        { props.type == '_removed' && <Lozenge appearance="removed">{props.title}</Lozenge> }
        { props.type == 'default' && <Lozenge isBold>{props.title}</Lozenge> }
    </span>
    );
  }

export default  function ShowAlert(props) {
    const [show, setShow] = useState(true);
  
    if (show) {
      return (
        <div className="mt-4">
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{props.title}</Alert.Heading>
            <p>
             {props.message}
            </p>
          </Alert>
        </div>
      );
    }
    return null;
  }