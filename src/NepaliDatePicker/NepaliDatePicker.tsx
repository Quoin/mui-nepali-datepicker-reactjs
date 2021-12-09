import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react"
import { Calender } from "./Calender"
import { useConfig } from "./Config"
import { useTrans } from "./Locale"
import { ENGLISH, INepaliDatePicker, localeType, NepaliDatepickerEvents } from "./Types"
import { executionDelegation, stitchDate } from "./Utils/common"
import Dialog from "@material-ui/core/Dialog"
import { TextField } from "@material-ui/core"

const NepaliDatePicker: FunctionComponent<INepaliDatePicker> = (props) => {
    const {
        className,
        inputClassName,
        value,
        onChange,
        onSelect,
        options,
        componentProps,
        resetButtonText,
        resetButtonProps,
    } = props

    const nepaliDatePickerWrapper = useRef<HTMLDivElement>(null)
    const nepaliDatePickerInput = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<string>("")
    const [showCalendar, setShowCalendar] = useState<boolean>(false)

    const { setConfig, getConfig } = useConfig()
    const { numberTrans } = useTrans(getConfig<localeType>("currentLocale"))

    const toEnglish = useCallback((val: string): string => numberTrans(val, ENGLISH), [])
    const returnDateValue = useCallback(
        (val: string): string => numberTrans(val, options.valueLocale),
        [options.valueLocale],
    )

    useEffect(() => {
        setConfig("currentLocale", options.calenderLocale)
    }, [options.calenderLocale])

    useEffect(() => {
        setDate(toEnglish(value))
    }, [value])

    // const handleClickOutside = useCallback((event: any) => {
    //     if (nepaliDatePickerWrapper.current && childOf(event.target, nepaliDatePickerWrapper.current)) {
    //         return
    //     }

    //     setShowCalendar(false)
    // }, [])

    // useLayoutEffect(() => {
    //     if (showCalendar) {
    //         document.addEventListener("mousedown", handleClickOutside)
    //     }

    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside)
    //     }
    // }, [showCalendar])

    // useLayoutEffect(() => {
    //     if (showCalendar && nepaliDatePickerWrapper.current) {
    //         const nepaliDatePicker = nepaliDatePickerWrapper.current.getBoundingClientRect()
    //         const screenHeight = window.innerHeight

    //         const calender: HTMLDivElement | null = nepaliDatePickerWrapper.current.querySelector(".calender")
    //         if (calender) {
    //             setTimeout(() => {
    //                 const calenderHeight = calender.clientHeight

    //                 if (calenderHeight + nepaliDatePicker.bottom > screenHeight) {
    //                     if (calenderHeight < nepaliDatePicker.top) {
    //                         calender.style.bottom = `${nepaliDatePicker.height}px`
    //                     }
    //                 }
    //             }, 0)
    //         }
    //     }
    // }, [showCalendar])

    const handleSetShowCalendar = (visible = false) => {
        setShowCalendar(visible)
    }

    const handleOnChange = useCallback(
        (changedDate: string) => {
            executionDelegation(
                () => {
                    setDate(changedDate)
                },
                () => {
                    if (onChange) {
                        onChange(returnDateValue(changedDate))
                    }
                },
            )
        },
        [onChange],
    )

    const handleOnDaySelect = useCallback(
        (selectedDate) => {
            executionDelegation(
                () => {
                    if (options.closeOnSelect) {
                        setShowCalendar(false)
                    }
                },
                () => {
                    if (onSelect) {
                        onSelect(returnDateValue(stitchDate(selectedDate)))
                    }
                },
            )
        },
        [onSelect],
    )

    const handleReset = () => {
        executionDelegation(
            () => {
                if (options.closeOnSelect) {
                    setShowCalendar(false)
                }
            },
            () => {
                handleOnChange("")
            },
        )
    }

    const datepickerEvents: NepaliDatepickerEvents = {
        change: handleOnChange,
        daySelect: handleOnDaySelect,
        todaySelect: handleOnDaySelect,
        reset: handleReset,
    }

    return (
        <div>
            <div ref={nepaliDatePickerWrapper} className={`nepali-date-picker ${className}`}>
                <TextField
                    onClick={() => handleSetShowCalendar(true)}
                    inputRef={nepaliDatePickerInput}
                    value={numberTrans(date)}
                    InputProps={{
                        readOnly: true,
                    }}
                    className={inputClassName}
                    {...componentProps}
                />
            </div>
            <Dialog open={showCalendar} onClose={() => handleSetShowCalendar(false)} scroll='paper'>
                <Calender
                    value={date}
                    events={datepickerEvents}
                    resetButtonText={resetButtonText}
                    resetButtonProps={resetButtonProps}
                />
            </Dialog>
        </div>
    )
}

export default NepaliDatePicker
