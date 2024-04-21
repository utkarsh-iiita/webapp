import LoadingButton from "@mui/lab/LoadingButton";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";

import countryCodes from "~/assets/country-codes.json";

import { type SectionProps } from "../types";

export default function Section2(props: SectionProps) {
  return (
    <>
      <div className="flex flex-col w-full gap-3 mb-4">
        <FormControl>
          <TextField
            label="Phone Number"
            autoComplete="tel"
            type="tel"
            inputProps={{
              pattern: "(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}",
            }}
            value={props.onboarding.phone}
            onChange={(e) =>
              props.setOnboarding({
                ...props.onboarding,
                phone: e.target.value,
              })
            }
            required
          />
          <FormHelperText>
            Enter your phone number with country code
          </FormHelperText>
        </FormControl>

        <TextField
          label="Primary Email"
          autoComplete="email"
          type="email"
          value={props.onboarding.email}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              email: e.target.value,
            })
          }
          required
        />

        <TextField
          label="Address Line 1"
          autoComplete="address-line1"
          value={props.onboarding.addressLine1}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              addressLine1: e.target.value,
            })
          }
          required
        />

        <TextField
          label="Address Line 2"
          autoComplete="address-line2"
          value={props.onboarding.addressLine2}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              addressLine2: e.target.value,
            })
          }
        />

        <TextField
          label="Pincode"
          autoComplete="postal-code"
          type="number"
          value={props.onboarding.pincode}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              pincode: parseInt(e.target.value.toString()),
            })
          }
          required
        />

        <Autocomplete
          options={countryCodes}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              autoComplete="country"
              required
            />
          )}
          value={countryCodes.find(
            (cc) => cc.name === props.onboarding.country,
          )}
          onChange={(_, value) =>
            props.setOnboarding({
              ...props.onboarding,
              country: value?.name || "",
            })
          }
        />

        <TextField
          label="City"
          autoComplete="address-level2"
          value={props.onboarding.city}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              city: e.target.value,
            })
          }
          required
        />

        <TextField
          label="State"
          autoComplete="address-level1"
          value={props.onboarding.state}
          onChange={(e) =>
            props.setOnboarding({
              ...props.onboarding,
              state: e.target.value,
            })
          }
          required
        />
      </div>
      <Box sx={{ mb: 2 }}>
        <div>
          {props.onNext && (
            <Button
              variant="contained"
              onClick={props.onNext}
              sx={{ mt: 1, mr: 1 }}
              disabled={
                props.isLoading ||
                !props.onboarding.email ||
                !props.onboarding.phone ||
                !props.onboarding.addressLine1 ||
                !props.onboarding.pincode ||
                !props.onboarding.city ||
                !props.onboarding.state ||
                !props.onboarding.country
              }
            >
              Continue
            </Button>
          )}
          {props.onFinish && (
            <LoadingButton
              variant="contained"
              onClick={props.onFinish}
              loading={props.isLoading}
              disabled={
                !props.onboarding.email ||
                !props.onboarding.phone ||
                !props.onboarding.addressLine1 ||
                !props.onboarding.pincode ||
                !props.onboarding.city ||
                !props.onboarding.state ||
                !props.onboarding.country
              }
              sx={{ mt: 1, mr: 1 }}
            >
              Finish
            </LoadingButton>
          )}
          {props.onPrevious && (
            <Button
              onClick={props.onPrevious}
              sx={{ mt: 1, mr: 1 }}
              disabled={props.isLoading}
            >
              Back
            </Button>
          )}
        </div>
      </Box>
    </>
  );
}
