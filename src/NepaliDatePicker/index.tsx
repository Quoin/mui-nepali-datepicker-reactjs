import { StylesProvider, createGenerateClassName } from "@material-ui/core"
import React, { FunctionComponent, useMemo } from "react"
import "../NepaliDatePicker.scss"
import { ConfigProvider } from "./Config"
import NepaliDatePicker from "./NepaliDatePicker"
import { ENGLISH, INepaliDatePicker, NEPALI, NepaliDatePickerProps } from "./Types"

const NepaliDatePickerWrapper: FunctionComponent<NepaliDatePickerProps> = (props) => {
    const calenderOptions = useMemo(
        () => ({
            closeOnSelect: true,
            calenderLocale: NEPALI,
            valueLocale: ENGLISH,
            ...props.options,
        }),
        [props.options],
    )

    const generateClassName = createGenerateClassName({
        seed: "ne-date-picker",
    })

    return (
        <StylesProvider generateClassName={generateClassName}>
            <ConfigProvider>
                <NepaliDatePicker {...({ ...props, options: calenderOptions } as INepaliDatePicker)} />
            </ConfigProvider>
        </StylesProvider>
    )
}

NepaliDatePickerWrapper.defaultProps = {
    className: "",
    inputClassName: "",
    value: "",
    onChange: () => null,
    onSelect: () => null,
    options: {},
    componentProps: {},
}

export default NepaliDatePickerWrapper
