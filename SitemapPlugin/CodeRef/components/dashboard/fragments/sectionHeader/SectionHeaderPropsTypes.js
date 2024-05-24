// @flow

export type SectionHeaderPropsTypes = {
    data: Array<SectionHeaderItemTypes>,
}

export type SectionHeaderItemTypes = {
    type: string,
    title: string,
    value: string | number,
    iconComponent: ?React$Element<any>,
    colClass: string,
    labelConfig: string,
    labelText: string,
};
