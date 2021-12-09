import { IconButton } from "@material-ui/core"
import React, { FunctionComponent } from "react"
import { CalenderData, useConfig } from "../../Config"
import { useTrans } from "../../Locale"
import { localeType, ParsedDate } from "../../Types"
import ArrowBackIos from "@material-ui/icons/ArrowBackIos"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"

interface CalenderControllerProps {
    onNextMonth: () => void
    onPreviousMonth: () => void
    calenderDate: ParsedDate
}

const CalenderController: FunctionComponent<CalenderControllerProps> = (props) => {
    const { onNextMonth, onPreviousMonth, calenderDate } = props
    const { getConfig } = useConfig()
    const { trans, numberTrans } = useTrans(getConfig<localeType>("currentLocale"))
    const currentMonth = CalenderData.months.ne[calenderDate.bsMonth - 1]
    const currentYear = numberTrans(calenderDate.bsYear)

    return (
        <div className='calendar-controller'>
            <IconButton onClick={onPreviousMonth} aria-label={trans("previous")} size='small'>
                <ArrowBackIos fontSize='inherit' />
            </IconButton>
            <div>
                {currentMonth} {currentYear}
            </div>

            <IconButton onClick={onNextMonth} aria-label={trans("next")} size='small'>
                <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
        </div>
    )
}

export default CalenderController
