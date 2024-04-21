"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";

import vector from "~/assets/vectors/login.svg";
import { api } from "~/trpc/react";

import Section1 from "./_sections/Section1";
import Section2 from "./_sections/Section2";
import Section3 from "./_sections/Section3";
import Section4 from "./_sections/Section4";
import { DEFAULT_ONBOARDING } from "./constants";

export default function NewJobOpening() {
  const { update } = useSession();
  const [onboarding, setOnboarding] = useState(DEFAULT_ONBOARDING);
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        label: "Basic Details",
        Section: Section1,
      },
      {
        label: "Contact Details",
        Section: Section2,
      },
      {
        label: "Academic Details",
        Section: Section3,
      },
      {
        label: "Terms and Conditions",
        Section: Section4,
      },
    ],
    [],
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const createOnboardingMutation = api.onboarding.createOnboarding.useMutation({
    onSuccess: async () => {
      await update({
        info: {
          onboardingComplete: true,
        },
      });
      router.refresh();
    },
  });

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 absolute top-0">
      <Container
        className="hidden md:flex flex-col justify-center items-center max-h-svh"
        sx={{ bgcolor: "primary.main" }}
      >
        <Image src={vector} alt="Login" className="max-w-full max-h-min" />
      </Container>
      <Container className="flex flex-col justify-center items-center max-h-svg overflow-y-hidden">
        <Container className="flex flex-col w-full max-w-sm px-6 py-12 mt-16 mb-4 overflow-y-auto no-scrollbar">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <step.Section
                    onboarding={onboarding}
                    setOnboarding={setOnboarding}
                    onPrevious={index > 0 && handleBack}
                    onNext={index < steps.length - 1 && handleNext}
                    onFinish={
                      index === steps.length - 1 &&
                      (() => {
                        const reqData: any = onboarding;
                        reqData.dob = new Date(onboarding.dob.toISOString());
                        createOnboardingMutation.mutate(reqData);
                      })
                    }
                    isLoading={createOnboardingMutation.isLoading}
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Container>
      <Container
        className="z-10 w-full h-5 absolute bottom-0"
        maxWidth={false}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
          color: "text.disabled",
          fontSize: "0.8rem",
          backgroundColor: "bgclear",
          backdropFilter: "blur(10px)",
        }}
      >
        Created by Team GeekHaven
      </Container>
    </div>
  );
}
