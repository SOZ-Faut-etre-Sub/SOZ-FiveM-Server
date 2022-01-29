import React from 'react';
import MaterialList, { ListProps } from '@mui/material/List';
import {ListClasses} from "@mui/material/List/listClasses";

export type UListProps = ListProps & {
    childrenClassName?: string;
};

export const List: React.FC<UListProps> = ({ ...props }) => (
  <MaterialList aria-label="list" {...props}>
    <div className={props.childrenClassName}>
      {props.children}
    </div>
  </MaterialList>
);
