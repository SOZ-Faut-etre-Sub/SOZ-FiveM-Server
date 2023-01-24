import { fetchNui } from "@public/nui/fetch";
import { DrivingSchoolConfig, DrivingSchoolMenuData } from "@public/shared/driving-school";
import { NuiEvent } from "@public/shared/event";
import { MenuType } from "@public/shared/nui/menu";
import { FunctionComponent, useEffect, useState } from "react";
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemSelect, MenuItemSelectOption, MenuItemSelectOptionBox, MenuItemSubMenuLink, MenuTitle, SubMenu } from "../Styleguide/Menu";

type DrivingSchoolMenuProps = {
  data?: DrivingSchoolMenuData;
};

export const DrivingSchoolMenu: FunctionComponent<DrivingSchoolMenuProps> = ({ data }) => {
  if (!data) {
    data = {
      currentVehicleLimit: 1,
    };
  }

  const [limit, setLimit] = useState(0);
  const [price, setPrice] = useState(0);

  const banner = 'https://nui-img/soz/menu_shop_drivingschool';

  useEffect(() => {
    if (data?.currentVehicleLimit) {
      setLimit(data.currentVehicleLimit);
    }
  }, [data]);

  useEffect(() => {
    const currentLimit = data.currentVehicleLimit;
    let newPrice = 0;
    for (let i = currentLimit + 1; i <= limit; i++) {
      newPrice += DrivingSchoolConfig.vehicleLimits[i];
    }
    setPrice(newPrice);
  }, [limit]);

  const onConfirm = () => {
    fetchNui(NuiEvent.DrivingSchoolUpdateVehicleLimit, {
      limit,
      price,
    });
  }

  const onChange = (selectedLimit: number) => {
    setLimit(selectedLimit);
  }

  const onCheckVehicleSlot = () => {
    fetchNui(NuiEvent.DrivingSchoolCheckVehicleSlots);
  }

  return (
    <Menu type={MenuType.DrivingSchool}>
      <MainMenu>
        <MenuTitle banner={banner}></MenuTitle>
        <MenuContent>
          <MenuItemSubMenuLink id="vehicle-limit-upgrades">
            Améliorations
          </MenuItemSubMenuLink>
          <MenuItemButton onConfirm={() => onCheckVehicleSlot()}>Vérifier les places restantes</MenuItemButton>
        </MenuContent>
      </MainMenu>
      <SubMenu id="vehicle-limit-upgrades">
        <MenuTitle banner={banner}>
          Améliorations
        </MenuTitle>
        <MenuContent>
          <MenuItemSelect
            value={data.currentVehicleLimit}
            title='Niveau'
            showAllOptions
            useGrid
            onChange={(index, value) => onChange(value)}
          >
            {Object.entries(DrivingSchoolConfig.vehicleLimits).map(([limit, _], index) => (
              <MenuItemSelectOptionBox key={index} value={parseInt(limit)}>{parseInt(limit)}</MenuItemSelectOptionBox>
            ))}
          </MenuItemSelect>
          <MenuItemButton className="border-t border-white/50" onConfirm={() => onConfirm()}>
              <div className="flex w-full justify-between items-center">
                  <span>Confirmer</span>
                  <span>${price.toFixed()}</span>
              </div>
          </MenuItemButton>
        </MenuContent>
      </SubMenu>
    </Menu>
  )
}