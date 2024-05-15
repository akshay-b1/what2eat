import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  FormField,
} from "@/components/ui/form";

import { Skeleton } from "@/components/ui/skeleton"
import { Ratings } from "@/components/ui/rating"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import React from "react";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
interface SurveyProps {
  id: string;
  surveyType: string;
}

type ApiResponseItem = {
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
};

export default function Survey({ id, surveyType }: SurveyProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [popularItems, setPopularItems] = useState<string[]>([]);
  const [foodRecsApiResponse, setFoodRecsApiResponse] = useState<ApiResponseItem[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);

  const router = useRouter();
  const eventname = router.query.eventName as string;

  const FormSchema = z.object({
    selectedItems: z
      .array(z.string())
      .refine((value) => value.length > 0, {
        message: "You have to select at least one choice.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedItems: [],
    },
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/getItems?type=${surveyType}`);
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setItems(data.flat());
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
  
    // Only fetch the items if surveyType is defined
    if (surveyType) {
      fetchItems();
    }
  }, [surveyType]); // Add surveyType as a dependency

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleItemPopularity();
    }, 3500); // Runs every 5 second
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a request to the server to check if the user exists
      const response = await fetch(
        `/api/checkUser?user=${user}&pass=${pass}&id=${id}`
      );
      const data = await response.json();

      if (data.exists) {
        // User exists, set authentication state
        toast({
          title: "Welcome Back!",
          description: "Your can make changes now.",
        });
        setIsAuthenticated(true);
        const storedItems = localStorage.getItem(`items-${user}`);
        if (storedItems) {
          form.setValue("selectedItems", JSON.parse(storedItems));
        }
      } else {
        // User doesn't exist, create a new user and add it to the eaters array
        const newUser = { user, pass };
        const addUserResponse = await fetch("/api/addEater", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mealId: id, eaterData: newUser }),
        });

        if (addUserResponse.ok) {
          setIsAuthenticated(true);
          toast({
            title: "Welcome!",
            description: "Your can select your choices now.",
          });
        } else {
          console.error("Error adding new user");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleUpdateChoices = async () => {
    const { selectedItems } = form.getValues();

    try {
      const response = await fetch("/api/updateChoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: id,
          name: user,
          choices: selectedItems.map((item:any) => ({
            name: item,
            selected: true,
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "Choices Updated!",
          description: "Your choices have been updated successfully.",
        });
        localStorage.setItem(`items-${user}`, JSON.stringify(selectedItems));

      } else {
        console.error("Error updating choices");
      }
    } catch (error) {
      console.error("Error updating choices:", error);
    }
  };

  const handleItemPopularity = async () => {
    try {
      const id_from_url = window.location.pathname.split("/")[1];

      const response = await fetch(`/api/getPopularToppings?id=${id_from_url}`);
      const data = await response.json();

      if (response.ok) {
        setPopularItems(data)
        console.log("Popularity data:", data);
      } else {
        console.error("Error fetching popularity data");
      }
    } catch (error) {
      console.error("Error fetching popularity data:", error);
    }
  }

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error copying link:", error);
    }
  }

  const handleFoodRecs = async (cuisine:any) => {
    setIsRecsLoading(true);
    try {

      let latitude: number;
      let longitude: number;

      // Get the user's location
      try {
        // IP address method
        const locationresponse = await fetch('https://ipapi.co/json/');
        const location = await locationresponse.json();

        // Get the latitude and longitude
        latitude = location.latitude;
        longitude = location.longitude;
      } catch (error) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        // Get the latitude and longitude
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }
        
      const response = await fetch(`/api/foodRecs?latitude=${latitude}&longitude=${longitude}&cuisine=${encodeURIComponent(cuisine)}`);

      const data = await response.json();
      if (response.ok) {
        setIsRecsLoading(false);
        setFoodRecsApiResponse(data);
      } else {
        setIsRecsLoading(false);
        console.error("Error fetching food recommendations");
      }
    } catch (error) {
      setIsRecsLoading(false);
      console.error("Error fetching food recommendations:", error);
    }
  }
  
  const renderDollarSigns = (priceLevel:number) => {
    let dollarSigns = '';
    for(let i = 0; i < priceLevel; i++) {
      dollarSigns += '💲';
    }
    return dollarSigns;
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-100 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {!isAuthenticated ? (
            <div className="flex justify-center items-center">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Name/Password are only for this event.
                    <br />
                    <strong>New to this event?</strong> Make up a password.
                    <br />
                    <strong>Returning?</strong> Use the same name/password.
                    <br />
                    To invite people to this event, <strong>click on the Copy Link Button below!</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        type="name"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="pls remember this"
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" onClick={handleCopyLink}> 
                        <CopyIcon className="mr-2 h-4 w-4" />
                        Copy Link to Share
                      </Button>
                      <Button type="button" onClick={handleLogin}> Sign In</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <h1 className="text-2xl font-bold">{eventname}</h1>
              <h2 className="text-sm font-bold mb-2">To invite people to this event, click on the Copy Link Button below.</h2>
              <h2 className="text-sm font-bold mb-2">Make sure to click Send Choice to send your responses!</h2>
              <div className="flex items-center justify-center">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-900 w-4/4 mx-auto">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
                    {items.map((item, index) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <FormField
                          control={form.control}
                          name="selectedItems"
                          render={({ field }) => (
                            <>
                              <Checkbox
                                id={`items-${item}-${index}`}
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                              <Label
                                htmlFor={`item-${item}-${index}`}
                              >
                                {item}
                              </Label>
                            </>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex">
                <Button className="outline mt-4 mr-2" onClick={handleUpdateChoices}> Send Choices</Button>
                <Button className="mt-4" onClick={handleCopyLink}> 
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-center py-10">
            <div className="grid grid-cols-1 gap-2 rounded-lg overflow-auto max-h-[400px] w-3/4 p-6 shadow bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-bold">Group&apos;s Popular Items</h2>
            {surveyType === "cuisines" && ( <h4 className="text-sm font-bold">This is a live view of your group&apos;s choices. Click the map marker icon to get restaurant suggestions near you!</h4> )}
              {popularItems.map((topping:any) => (
                <div key={topping.name} className="rounded-lg bg-white p-4 shadow dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{topping.name}</h3>
                    <div className="flex items-center justify-between w-full">
                      
                      <div className="flex items-center ml-3 space-x-1">
                        <ArrowUpIcon className="h-5 w-5 text-green-500" />
                        <span className="text-green-500">{topping.count}</span>
                      </div>
                      {surveyType === "cuisines" && ( 
                        <div className="ml-auto px-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button type="button" className="px-3 py-1  bg-blue-800 text-white rounded-lg" onClick={() => handleFoodRecs(topping.name)}><MapMarkerAltIcon /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] max-h-[400px] overflow-auto">
                              <DialogHeader>
                                <DialogTitle>Food Recommendations</DialogTitle>
                                <DialogDescription>
                                  Here are some food recommendations based on your choices. This feature might not work on some safari browsers idk why, if so try a different browser.
                                </DialogDescription>
                              </DialogHeader>
                              {isRecsLoading ? (
                                  <div className="flex flex-col space-y-3">
                                    <Skeleton className="h-[125px] w-[350px] rounded-xl" />
                                    <div className="space-y-2">
                                      <Skeleton className="h-4 w-[350px]" />
                                      <Skeleton className="h-4 w-[350px]" />
                                    </div>
                                  </div>
                                  
                                ) : (
                                  foodRecsApiResponse.map((item, index) => (
                                    <React.Fragment key={index}>
                                      <div>
                                        <h2><strong>{item.name}</strong></h2>
                                        <p>{item.address} </p>
                                        <Ratings rating={item.rating} variant="yellow" totalStars={5}/>
                                        {item.priceLevel && <p>{renderDollarSigns(item.priceLevel)}</p>}
                                      </div>
                                      {index < foodRecsApiResponse.length - 1 && <Separator />}
                                    </React.Fragment>
                                  ))
                                )}
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="submit">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


function ArrowUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function CopyIcon(props : any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function MapMarkerAltIcon(props: any) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="map-marker-alt"
      className="svg-inline--fa fa-map-marker-alt fa-w-12"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
    >
      <path
        fill="currentColor"
        d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"
      ></path>
      <circle cx="192" cy="192" r="50" fill="blue" />
    </svg>
  );
}
  

export { Survey };
