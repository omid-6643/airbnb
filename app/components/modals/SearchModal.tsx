"use client";

import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import dynamic from "next/dynamic";
import { formatISO } from "date-fns";

import useSearchModal from "@/app/hooks/useSearchModal";

import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Modal from "./Modal";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}
// export const dynamic = "force-static";
const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    []
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updateQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updateQuery.startDate = formatISO(dateRange.startDate);
    }
    if (dateRange.endDate) {
      updateQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updateQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);
  }, [
    bathroomCount,
    dateRange,
    guestCount,
    location?.value,
    onNext,
    params,
    roomCount,
    router,
    searchModal,
    step,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone id free!"
        />
        <Calender
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place!" />
        <Counter
          title="Guests"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathroom"
          subtitle="How many bathroom do you need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
      title="Filters"
      actionLabel={actionLabel}
    />
  );
};

export default SearchModal;
