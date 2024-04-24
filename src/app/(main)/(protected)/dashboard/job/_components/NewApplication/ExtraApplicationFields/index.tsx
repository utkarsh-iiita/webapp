"use client";

import { useEffect } from "react";

import LongTextFormField from "./inputFields/LongText";
import NumberFormField from "./inputFields/Number";
import TextFormField from "./inputFields/Text";

export default function ExtraApplicationFields(
  props: ExtraApplicationFieldProps,
) {
  useEffect(() => {
    if (
      props.extraApplicationFields
        .filter((field: any) => field.required)
        .some((field) => {
          if (field.format === "Number") {
            return (
              props.extraData[field.title] === "" ||
              props.extraData[field.title] === undefined
            );
          }
          return !props.extraData[field.title];
        })
    ) {
      props.setIsExtraDataRemaining(true);
    } else {
      props.setIsExtraDataRemaining(false);
    }
  }, [props.extraData, props.extraApplicationFields]);

  return props.extraApplicationFields.map((field) => {
    switch (field.format) {
      case "Text":
        return (
          <TextFormField
            key={field.title}
            title={field.title}
            description={field.description}
            value={props.extraData[field.title]}
            required={field.required}
            setValue={(data) =>
              props.setExtraData({ ...props.extraData, [field.title]: data })
            }
          />
        );
      case "LongText":
        return (
          <LongTextFormField
            key={field.title}
            title={field.title}
            description={field.description}
            value={props.extraData[field.title]}
            required={field.required}
            setValue={(data) =>
              props.setExtraData({ ...props.extraData, [field.title]: data })
            }
          />
        );
      case "Number":
        return (
          <NumberFormField
            key={field.title}
            title={field.title}
            description={field.description}
            value={props.extraData[field.title]}
            required={field.required}
            setValue={(data) =>
              props.setExtraData({ ...props.extraData, [field.title]: data })
            }
          />
        );
      default:
        return null;
    }
  });
}
