import dayjs from "dayjs";

import { type NewOnboarding } from "./types";

export const DEFAULT_ONBOARDING: NewOnboarding = {
    gender: "",
    dob: dayjs(),
    tenthMarks: "",
    twelvethMarks: "",
    addressLine1: "",
    addressLine2: "",
    pincode: 0,
    city: "",
    state: "",
    country: "",
    isOnboarding: false,
    email: "",
    phone: "",
};
