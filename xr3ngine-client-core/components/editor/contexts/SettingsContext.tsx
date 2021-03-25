import React from "react";

/**
 * [initializing defaultSettings with empty context]
 * @type {Object}
 */
export const defaultSettings = {
};

/**
 * [SettingsContext creating react context]
 */
const SettingsContext = React.createContext({
  settings: defaultSettings,
  updateSetting: () => {}
});

/**
 * [SettingsContextProvider provides component context value]
 */
export const SettingsContextProvider = SettingsContext.Provider;

/**
 * [withSettings setting component context value]
 */
export function withSettings(Component) {
  return function SettingsContextComponent(props) {
    return (
      <SettingsContext.Consumer>
        {ctx => <Component {...props} {...ctx} />}
      </SettingsContext.Consumer>
    );
  };
}
