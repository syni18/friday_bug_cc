import React, { useEffect, useState } from "react";
import { useDevice, useExcalidrawSetAppState } from "../App";
import DropdownMenu from "../dropdownMenu/DropdownMenu";
import * as DefaultItems from "./DefaultItems";
import { UserList } from "../UserList";
import { t } from "../../i18n";
import { HamburgerMenuIcon } from "../icons";
import { WithInternalFallbackProps, withInternalFallback } from "../hoc/withInternalFallback";
import { composeEventHandlers } from "../../utils";
import { useTunnels } from "../../context/tunnels";
import { useUIAppState } from "../../context/ui-appState";

interface MainMenuProps extends WithInternalFallbackProps {
  children?: React.ReactNode;
  onSelect?: (event: Event) => void;
  userRole?: string;
}

const MainMenu = Object.assign(
  withInternalFallback(
    "MainMenu",
    ({
      children,
      onSelect,
      userRole, // Add userRole here
    }: MainMenuProps) => {
      console.log("userRole: ", userRole);

      const { MainMenuTunnel } = useTunnels();
      const device = useDevice();
      const appState = useUIAppState();
      const setAppState = useExcalidrawSetAppState();
      const onClickOutside = device.editor.isMobile
        ? undefined
        : () => setAppState({ openMenu: null });

      const [shouldRenderUserList, setShouldRenderUserList] = useState(false);

      useEffect(() => {
        if (device.editor.isMobile && appState.collaborators.size > 0) {
          setShouldRenderUserList(true);
        } else {
          setShouldRenderUserList(false);
        }
      }, [appState.collaborators]);

      return (
        <>
          <MainMenuTunnel.In>
            <DropdownMenu open={appState.openMenu === "canvas"}>
              <DropdownMenu.Trigger
                onToggle={() => {
                  setAppState({
                    openMenu: appState.openMenu === "canvas" ? null : "canvas",
                  });
                }}
                data-testid="main-menu-trigger"
                className="main-menu-trigger"
              >
                {HamburgerMenuIcon}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                onClickOutside={onClickOutside}
                onSelect={composeEventHandlers(onSelect, () => {
                  setAppState({ openMenu: null });
                })}
              >
                {children}
                {device.editor.isMobile && appState.collaborators.size > 0 && (
                  <fieldset className="UserList-Wrapper">
                    <legend>{t("labels.collaborators")}</legend>
                    <UserList
                      mobile={true}
                      collaborators={appState.collaborators}
                      userToFollow={appState.userToFollow?.socketId || null}
                      userRole={userRole!} // Pass userRole prop
                    />
                  </fieldset>
                )}
              </DropdownMenu.Content>
            </DropdownMenu>
          </MainMenuTunnel.In>
          {shouldRenderUserList && (
            <div style={{ display: "none" }}>
              <UserList
                mobile={true}
                collaborators={appState.collaborators}
                userToFollow={appState.userToFollow?.socketId || null}
                userRole={userRole!} // Pass userRole prop
              />
            </div>
          )}
        </>
      );
    },
  ),
  {
    Trigger: DropdownMenu.Trigger,
    Item: DropdownMenu.Item,
    ItemLink: DropdownMenu.ItemLink,
    ItemCustom: DropdownMenu.ItemCustom,
    Group: DropdownMenu.Group,
    Separator: DropdownMenu.Separator,
    DefaultItems,
  },
);

export default MainMenu;
