import React from 'react';
import SvgIcon from "@material-ui/core/SvgIcon";
import {ReactComponent as plusImg} from '../img/plus.svg';


export default function PlusIcon(props) {
    return (
      <SvgIcon component={plusImg} {...props} />
    );
}