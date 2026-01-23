import { memo } from "react"

export const SwitchSidesIcon = memo(() => (
    <>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M21 17l-18 0" />
        <path d="M6 10l-3 -3l3 -3" />
        <path d="M3 7l18 0" />
        <path d="M18 20l3 -3l-3 -3" />
    </>
));

SwitchSidesIcon.displayName = "SwitchSidesIcon"