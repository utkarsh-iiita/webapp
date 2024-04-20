"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

import LoadingButton from "@mui/lab/LoadingButton";
import {
    Autocomplete,
    Avatar,
    Checkbox,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";

import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";

import { DEFAULT_ONBOARDING } from "./constants";




export default function NewJobOpening() {
    const { update } = useSession();
    const [onboarding, setOnboarding] = useState(DEFAULT_ONBOARDING);
    const router = useRouter();
    const createOnboardingMutation = api.onboarding.createOnboarding.useMutation(
        {
            onSuccess: async () => {
                await update({
                    info: {
                        onboardingComplete: true,
                    },
                });
                router.refresh();
            },
        },
    );
    return (
        <Container className="flex flex-col gap-4 py-4">
            <Typography variant="h5" color="primary" className="px-4">
                Onboarding
            </Typography>
            <Divider />
            <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    const reqData: any = onboarding;
                    createOnboardingMutation.mutate(reqData)

                }}
            >
                <FormControl variant="standard">
                    <TextField
                        label="Gender"
                        name="gender"
                        value={onboarding.gender}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, gender: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.gender.length}/180
                    </FormHelperText>
                </FormControl>


                <DateTimePicker
                    name="dob"
                    value={onboarding.dob}
                    onChange={(date) =>
                        setOnboarding({ ...onboarding, dob: date })
                    }
                    label="Date Of Birth"
                />
                <FormControl variant="standard">
                    <TextField
                        label="TenthMarks"
                        name="tenthMraks"
                        value={onboarding.tenthMarks}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, tenthMarks: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.tenthMarks.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="TwelvethMarks"
                        name="twelvethMarks"
                        value={onboarding.twelvethMarks}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, twelvethMarks: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.twelvethMarks.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="AddressLine1"
                        name="addressLine1"
                        value={onboarding.addressLine1}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, addressLine1: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.addressLine1.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="AddressLine2"
                        name="addressLine2"
                        value={onboarding.addressLine2}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, addressLine2: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.addressLine2.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="Pincode"
                        name="pincode"
                        type="number"
                        value={onboarding.pincode}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, pincode: Number(e.target.value) })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.pincode.length}/180
                    </FormHelperText>
                </FormControl>

                <FormControl variant="standard">
                    <TextField
                        label="City"
                        name="city"
                        value={onboarding.city}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, city: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.city.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="State"
                        name="state"
                        value={onboarding.state}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, state: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.state.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="Country"
                        name="country"
                        value={onboarding.country}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, country: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.country.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="Email"
                        name="email"
                        value={onboarding.email}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, email: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.email.length}/180
                    </FormHelperText>
                </FormControl>
                <FormControl variant="standard">
                    <TextField
                        label="Phone"
                        name="phone"
                        value={onboarding.phone}
                        onChange={(e) =>
                            setOnboarding({ ...onboarding, phone: e.target.value })
                        }
                        inputProps={{ maxLength: 180 }}
                        required
                    />
                    <FormHelperText className="text-right">
                        {onboarding.phone.length}/180
                    </FormHelperText>
                </FormControl>
                <Divider className="mt-12" />
                <Container className="flex flex-row justify-end">
                    <LoadingButton
                        type="submit"
                        variant="contained"
                    // disabled={isCreationDisabled}
                    >
                        Submit
                    </LoadingButton>
                </Container>

            </form>
        </Container >
    );
}
