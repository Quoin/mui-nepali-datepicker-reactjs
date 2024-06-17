import { Box, Button, IconButton, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { ADToBS } from "bikram-sambat-js"
import React, { Fragment, useCallback, useEffect, useState, FunctionComponent, MouseEventHandler } from "react"
import { localeType, NepaliDatepickerEvents, ParsedDate, parsedDateInitialValue, SplittedDate } from "../Types"
import { executionDelegation, parseBSDate, stitchDate } from "../Utils/common"
import CalenderController from "./components/CalenderController"
import { DayPicker } from "./components/DayPicker"
import CalendarToday from "@mui/icons-material/CalendarToday"
import { useTrans } from "../Locale"
import { useConfig } from "../Config"
import YearPicker from "./components/YearPicker"

interface CalenderProps {
    value: string
    events: NepaliDatepickerEvents
    resetButtonText: string
    resetButtonProps?: object
}

const Calender: FunctionComponent<CalenderProps> = ({ value, events, resetButtonText, resetButtonProps }) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<ParsedDate>(parsedDateInitialValue)
    const [calenderDate, setCalenderDate] = useState<ParsedDate>(parsedDateInitialValue)

    const { getConfig } = useConfig()
    const { trans, numberTrans } = useTrans(getConfig<localeType>("currentLocale"))

    useEffect(() => {
        const parsedDateValue = parseBSDate(value || ADToBS(new Date()))

        if (value) {
            setSelectedDate(parsedDateValue)
        }

        setCalenderDate(parsedDateValue)

        setIsInitialized(true)
    }, [value])

    useEffect(() => {
        if (isInitialized && selectedDate.bsYear > 0 && selectedDate.bsMonth > 0 && selectedDate.bsDay > 0) {
            events.change(
                stitchDate({
                    year: selectedDate.bsYear,
                    month: selectedDate.bsMonth,
                    day: selectedDate.bsDay,
                }),
            )
        }
    }, [selectedDate, isInitialized])

    const onPreviousMonthHandler = useCallback(() => {
        executionDelegation(
            () => {
                setCalenderDate((date) => {
                    let year = date.bsYear
                    let month = date.bsMonth - 1

                    if (month < 1) {
                        month = 12
                        year--
                    }

                    return parseBSDate(
                        stitchDate(
                            {
                                day: date.bsDay,
                                month,
                                year,
                            },
                            "-",
                        ),
                    )
                })
            },
            () => {
                if (events.previousMonthSelect) {
                    events.previousMonthSelect({ month: calenderDate.bsMonth, year: calenderDate.bsYear })
                }
            },
        )
    }, [])

    const onNextMonthClickHandler = useCallback(() => {
        executionDelegation(
            () => {
                setCalenderDate((date) => {
                    let year = date.bsYear
                    let month = date.bsMonth + 1

                    if (month > 12) {
                        month = 1
                        year++
                    }

                    return parseBSDate(
                        stitchDate(
                            {
                                day: date.bsDay,
                                month,
                                year,
                            },
                            "-",
                        ),
                    )
                })
            },
            () => {
                if (events.nextMonthSelect) {
                    events.nextMonthSelect({ year: calenderDate.bsYear, month: calenderDate.bsMonth })
                }
            },
        )
    }, [])

    const onTodayClickHandler = useCallback(() => {
        const today = parseBSDate(ADToBS(new Date()))

        executionDelegation(
            () => {
                setCalenderDate(today)
                setSelectedDate(today)
            },
            () => {
                if (events.todaySelect) {
                    events.todaySelect({ year: today.bsYear, month: today.bsMonth, day: today.bsDay })
                }
            },
        )
    }, [])

    const onYearSelectHandler = useCallback(
        (year: SplittedDate["year"]) => {
            executionDelegation(
                () => {
                    setCalenderDate(
                        parseBSDate(
                            stitchDate({
                                year,
                                month: calenderDate.bsMonth,
                                day: calenderDate.bsDay,
                            }),
                        ),
                    )
                },
                () => {
                    if (events.yearSelect) {
                        events.yearSelect(year)
                    }

                    setShowYearPicker(false)
                },
            )
        },
        [calenderDate],
    )

    // const onMonthSelectHandler = useCallback(
    //     (month) => {
    //         executionDelegation(
    //             () => {
    //                 setCalenderDate(
    //                     parseBSDate(
    //                         stitchDate({
    //                             year: calenderDate.bsYear,
    //                             month,
    //                             day: calenderDate.bsDay,
    //                         }),
    //                     ),
    //                 )
    //             },
    //             () => {
    //                 if (events.monthSelect) {
    //                     events.monthSelect(month)
    //                 }
    //             },
    //         )
    //     },
    //     [calenderDate],
    // )

    const onDaySelectHandler = useCallback((date: SplittedDate) => {
        executionDelegation(
            () => {
                const newDate = parseBSDate(stitchDate(date))

                setCalenderDate(newDate)
                setSelectedDate(newDate)
            },
            () => {
                if (events.daySelect) {
                    events.daySelect(date)
                }
            },
        )
    }, [])

    const handleReset: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()
        events.reset()
    }

    const resetButtonTxt = resetButtonText || "Reset"

    const currentYear = numberTrans(calenderDate.bsYear)

    return (
        <Fragment>
            <DialogTitle className='calender-header-container'>
                <Box className='calender-header' bgcolor='primary.main'>
                    <Button onClick={() => setShowYearPicker(true)} size='small' className='yearBtn'>
                        {currentYear}
                    </Button>
                    <Typography variant='h4'>{numberTrans(value || ADToBS(new Date()))}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent className='calender'>
                <div className='calender-wrapper'>
                    {isInitialized &&
                        (showYearPicker ? (
                            <YearPicker date={calenderDate} onSelect={onYearSelectHandler} />
                        ) : (
                            <Fragment>
                                <CalenderController
                                    onPreviousMonth={onPreviousMonthHandler}
                                    onNextMonth={onNextMonthClickHandler}
                                    calenderDate={calenderDate}
                                />

                                <DayPicker
                                    selectedDate={selectedDate}
                                    calenderDate={calenderDate}
                                    onDaySelect={onDaySelectHandler}
                                />
                            </Fragment>
                        ))}
                </div>
            </DialogContent>
            <DialogActions className='calender-actions'>
                <IconButton onClick={onTodayClickHandler} size='small' color='primary' aria-label={trans("today")}>
                    <CalendarToday fontSize='inherit' />
                </IconButton>
                <Button onClick={handleReset} size='small' {...resetButtonProps}>
                    {resetButtonTxt}
                </Button>
            </DialogActions>
        </Fragment>
    )
}

export default Calender
