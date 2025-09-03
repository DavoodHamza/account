import { useState, useRef } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Container } from "react-bootstrap";
import ActionPopover from "../product/components/actionPopover";

const Table = (props: any) => {
  return (
    <Container>
      <br />
      <Card>
        <DataGrid>
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
 />
          <HeaderFilter visible={true} />
          return (<Column></Column>
          );
          <Paging />
          <Pager />
          <Column
            alignment={"center"}
            type="buttons"
            caption="Action"
            width={110}
            cellRender={(item) => {
              return (
                <div className="table-title">
                  <Popover
                    content={<ActionPopover />}
                    placement="bottom"
                    trigger={"click"}
                  >
                    <BsThreeDotsVertical size={16} cursor={"pointer"} />
                  </Popover>
                </div>
              );
            }}
          ></Column>
          <Export />
          <Toolbar>
            <Item>
              <div className="Table-Txt">selected</div>
            </Item>

            <Item location="before" visible={true}>
              <div className="Table-Txt">{props.title}</div>
            </Item>

            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
          </Toolbar>
        </DataGrid>
      </Card>
    </Container>
  );
};

export default Table;
