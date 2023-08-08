/** @module @category UI */
import React, {
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEventHandler,
} from "react";
import type {} from "@openmrs/esm-globals";
import { ExtensionSlot, useStore } from "@openmrs/esm-react-utils";
import { createGlobalStore } from "@openmrs/esm-state";
import { SideNav, type SideNavProps } from "@carbon/react";
import * as styles from "./left-nav.module.scss";

interface LeftNavStore {
  slotName: string | null;
  basePath: string;
}

const leftNavStore = createGlobalStore<LeftNavStore>("left-nav", {
  slotName: null,
  basePath: window.spaBase,
});

export function setLeftNav({ name, basePath }) {
  leftNavStore.setState({ slotName: name, basePath });
}

export function unsetLeftNav(name) {
  if (leftNavStore.getState().slotName == name) {
    leftNavStore.setState({ slotName: null });
  }
}

// FIXME This should be taken from @carbon/react directly
export type LeftNavMenuProps = ComponentProps<"nav"> & {
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  isChildOfHeader?: boolean | undefined;
  onToggle?: (
    event: FocusEvent<HTMLElement> | KeyboardEvent<HTMLElement> | boolean,
    value: boolean
  ) => void | undefined;
  href?: string | undefined;
  isFixedNav?: boolean | undefined;
  isRail?: boolean | undefined;
  isPersistent?: boolean | undefined;
  addFocusListeners?: boolean | undefined;
  addMouseListeners?: boolean | undefined;
  onOverlayClick?: MouseEventHandler<HTMLDivElement> | undefined;
  onSideNavBlur?: () => void | undefined;
  enterDelayMs?: number;
  inert?: boolean;
};

export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>(
  (props, ref) => {
    const { slotName, basePath } = useStore(leftNavStore);
    const currentPath = window.location ?? { pathname: "" };

    return (
      <SideNav
        ref={ref}
        expanded
        aria-label="Left navigation"
        className={styles.leftNav}
        {...props}
      >
        <ExtensionSlot name="global-nav-menu-slot" />
        {slotName ? (
          <ExtensionSlot name={slotName} state={{ basePath, currentPath }} />
        ) : null}
      </SideNav>
    );
  }
);
