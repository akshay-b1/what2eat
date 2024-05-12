import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
import Navbar from "@/components/ui/navbar"

import React from "react"

export default function Landing() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [surveyUsing, setSurveyUsing] = React.useState<string>("ingredients");
  const [eventName, setEventName] = React.useState<string>("");
  const router = useRouter();


  const handleCreateEvent = async () => {
    try {
      // check if any of the fields are empty
      if (!date || !surveyUsing || !eventName) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please fill out all fields.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return;
      }

      const response = await fetch("/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: date?.toISOString(), surveyUsing, eventName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Meal created successfully");
        // You can add additional logic here, such as clearing the form or showing a success message
        toast({
          title: "Yay! 🎉",
          description: "Event created successfully.",
        })
        router.push(`/${data.id}`);

      } else {
        console.error("Error creating meal");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
        <Navbar />
      <div className="flex flex-col items-center w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <label className="sr-only" htmlFor="event-name">
            Event Name
          </label>
          <Input
            className="text-2xl font-bold text-center"
            id="event-name"
            placeholder="Enter Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-between w-full pt-7">
          <div className="flex flex-col w-1/2 space-y-4 pr-8">
            <h2 className="text-xl font-bold">When are you eating?</h2>
            <p className="text-sm">
              Click a day to choose possibilities. <br /> Click the arrows to shift the calendar.
            </p>
            <div>
              <Calendar
                initialFocus
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-fit"
              />
            </div>
          </div>
          <div className="flex flex-col w-1/2 space-y-4">
            <h2 className="text-xl font-bold">What times might work?</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm" htmlFor="survey-type">
                Survey using:
              </label>
              <Select value={surveyUsing} onValueChange={(value) => setSurveyUsing(value)}>
                <SelectTrigger id="survey-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                  <SelectItem value="cuisines">Cuisines</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </div>
        </div>
      </div>
    </div>
  )
}