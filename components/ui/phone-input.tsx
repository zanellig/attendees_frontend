"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void;
}

export function PhoneInput({
  className,
  label,
  error,
  countryCode = "54",
  onCountryCodeChange,
  onChange,
  value,
  ...props
}: PhoneInputProps) {
  // Format phone number as "XX-XXXX-XXXX"
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.substring(0, 10);

    // Format as "XX-XXXX-XXXX"
    if (limited.length > 6) {
      return `${limited.substring(0, 2)}-${limited.substring(
        2,
        6
      )}-${limited.substring(6)}`;
    } else if (limited.length > 2) {
      return `${limited.substring(0, 2)}-${limited.substring(2)}`;
    }

    return limited;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);

    // Update the input value with the formatted version
    e.target.value = formattedValue;

    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  };

  // Convert formatted phone number to raw digits for form submission
  const getRawValue = () => {
    if (typeof value !== "string") return "";
    return value.replace(/\D/g, "");
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <div className="flex">
        <div className="flex-shrink-0">
          <Select value={countryCode} onValueChange={onCountryCodeChange}>
            <SelectTrigger className="w-[80px] rounded-r-none border-r-0">
              <SelectValue placeholder="+54" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="54">+54</SelectItem>
              <SelectItem value="1">+1</SelectItem>
              <SelectItem value="44">+44</SelectItem>
              <SelectItem value="34">+34</SelectItem>
              <SelectItem value="55">+55</SelectItem>
              <SelectItem value="52">+52</SelectItem>
              <SelectItem value="56">+56</SelectItem>
              <SelectItem value="57">+57</SelectItem>
              <SelectItem value="51">+51</SelectItem>
              <SelectItem value="598">+598</SelectItem>
              <SelectItem value="58">+58</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          {...props}
          className={cn("flex-1 rounded-l-none", className)}
          value={value}
          onChange={handleInputChange}
          placeholder="11-XXXX-XXXX"
          maxLength={12} // 10 digits + 2 hyphens
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
