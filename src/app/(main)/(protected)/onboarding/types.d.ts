import type dayjs from "dayjs";

interface NewOnboarding {
    gender: String;
    dob: dayjs.Dayjs;
    tenthMarks: String;
    twelvethMarks: String;
    addressLine1: String;
    addressLine2: String;
    pincode: Int;
    city: String;
    state: String;
    country: String;
    isOnboarding: Boolean;
    email: String;
    phone: String;
}

