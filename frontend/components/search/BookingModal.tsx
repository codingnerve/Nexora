"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Plane, Hotel, Car, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { CONTACT, toTelHref } from "@/lib/constants";
import type { FlightOffer } from "@/lib/flightsApi";
import type { HotelOffer } from "@/lib/hotelsApi";
import type { CabOffer } from "@/lib/cabsApi";

export interface BookingModalData {
  type: "flight" | "hotel" | "cab";
  item: FlightOffer | HotelOffer | CabOffer;
  summary: string;
  price: number;
}

interface BookingModalProps {
  data: BookingModalData | null;
  onClose: () => void;
}

export function BookingModal({ data, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reference, setReference] = useState("");

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    // Simulate booking request handling
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ref = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    setReference(ref);
    setLoading(false);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-[24px] border border-sand-300 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-stone-500 hover:bg-sand-200 hover:text-ink-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-[10px] bg-clay-500/10 text-clay-600">
                {data.type === "flight" ? (
                  <Plane className="size-5" />
                ) : data.type === "hotel" ? (
                  <Hotel className="size-5" />
                ) : (
                  <Car className="size-5" />
                )}
              </div>
              <div>
                <span className="text-[0.75rem] font-bold uppercase tracking-wider text-clay-700">
                  {data.type === "flight"
                    ? "Flight Reservation"
                    : data.type === "hotel"
                      ? "Hotel Reservation"
                      : "Cab Transfer"}
                </span>
                <h3 className="font-display text-[1.25rem] font-bold text-ink-900">
                  Confirm Your Booking Request
                </h3>
              </div>
            </div>

            {/* Item summary card */}
            <div className="mt-5 rounded-[16px] border border-sand-300 bg-sand-100/70 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display font-bold text-ink-900">
                    {data.summary}
                  </p>
                  <p className="mt-0.5 text-body-sm text-foreground-muted">
                    {data.type === "flight"
                      ? "Checked baggage included • Free specialist assistance"
                      : data.type === "hotel"
                        ? "Free cancellation where applicable"
                        : "Meet & greet included"}
                  </p>
                </div>
                <p className="font-display text-[1.25rem] font-extrabold text-ink-900">
                  ${data.price}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Full Name (matching ID/passport)"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
              />

              <Input
                label="Email Address (for booking voucher)"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
              />

              <PhoneInput
                label="Phone Number"
                required
                onChange={(combined) => setPhone(combined)}
              />

              <Input
                label="Special Requests / Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. aisle seat, dietary preferences"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Confirming request...
                    </span>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
                <p className="mt-2 text-center text-[0.75rem] text-stone-500">
                  No immediate charge. Our travel specialist will verify availability and contact you.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/weblogo.png"
                alt="Nexora Destinations"
                width={150}
                height={50}
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="mt-4 font-display text-[1.5rem] font-bold text-ink-900">
              Request Received!
            </h3>
            <p className="mt-2 text-body-md text-foreground-muted">
              Your booking reference is:
            </p>
            <div className="mt-3 inline-block rounded-[12px] bg-sand-200 px-4 py-2 font-mono text-[1.25rem] font-bold text-ink-900">
              {reference}
            </div>
            <p className="mt-4 text-body-sm text-foreground-muted">
              We have sent an acknowledgement to <strong>{email}</strong>. Our
              travel specialist is reviewing availability and will contact you directly to confirm your reservation.
            </p>
            {CONTACT.tollFree ? (
              <p className="mt-3 text-body-sm text-stone-600">
                Need immediate help? Call toll-free:{" "}
                <a
                  href={toTelHref(CONTACT.tollFree)}
                  className="font-semibold text-clay-700 underline underline-offset-4 hover:text-clay-800"
                >
                  {CONTACT.tollFree}
                </a>
              </p>
            ) : null}
            <div className="mt-6">
              <Button variant="primary" size="md" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
