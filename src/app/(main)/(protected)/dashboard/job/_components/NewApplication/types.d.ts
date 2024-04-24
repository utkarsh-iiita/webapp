type ExtraApplicationData = Record<string, string | number | undefined>;

interface ApplicationFormProps {
  jobOpeningId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface ExtraApplicationFieldProps {
  extraApplicationFields: any;
  extraData: ExtraApplicationData;
  setExtraData: (extraData: ExtraApplicationData) => void;
  setIsExtraDataRemaining: (isRemaining: boolean) => void;
}

interface FieldProps {
  title: string;
  description?: string;
  value: ExtraApplicationData[string];
  setValue: (data: ExtraApplicationData[string]) => void;
  required?: boolean;
}
