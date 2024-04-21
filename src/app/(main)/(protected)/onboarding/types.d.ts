import type dayjs from "dayjs";

interface NewOnboarding {
  gender: string;
  dob: dayjs.Dayjs;
  tenthMarks: number;
  twelvethMarks: number;
  addressLine1: string;
  addressLine2: string;
  pincode: number;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
}

interface SectionProps {
  onboarding: NewOnboarding;
  setOnboarding: (onboarding: NewOnboarding) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
}
