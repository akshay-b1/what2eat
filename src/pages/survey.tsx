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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Navbar from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";

interface SurveyProps {
  id: string;
}

export default function Survey({ id }: SurveyProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [popularIngredients, setPopularIngredients] = useState<string[]>([]);
  const router = useRouter();
  const eventname = router.query.eventName as string;

  const FormSchema = z.object({
    selectedIngredients: z
      .array(z.string())
      .refine((value) => value.length > 0, {
        message: "You have to select at least one ingredient.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedIngredients: [],
    },
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/getIngredients");
        const data = await response.json();
        setIngredients(data.flat());
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleIngredientPopularity();
    }, 5000); // Runs every 5 second
  
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
        const storedIngredients = localStorage.getItem(`ingredients-${user}`);
        if (storedIngredients) {
          form.setValue("selectedIngredients", JSON.parse(storedIngredients));
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
    const { selectedIngredients } = form.getValues();

    try {
      const response = await fetch("/api/updateChoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: id,
          name: user,
          choices: selectedIngredients.map((ingredient:any) => ({
            name: ingredient,
            selected: true,
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "Choices Updated!",
          description: "Your choices have been updated successfully.",
        });
        localStorage.setItem(`ingredients-${user}`, JSON.stringify(selectedIngredients));

      } else {
        console.error("Error updating choices");
      }
    } catch (error) {
      console.error("Error updating choices:", error);
    }
  };

  const handleIngredientPopularity = async () => {
    try {
      const id_from_url = window.location.pathname.split("/")[1];

      const response = await fetch(`/api/getPopularToppings?id=${id_from_url}`);
      const data = await response.json();

      if (response.ok) {
        setPopularIngredients(data)
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
                      <Button onClick={handleLogin}> Sign In</Button>
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
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-900 w-3/4 mx-auto">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
                    {ingredients.map((ingredient, index) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <FormField
                          control={form.control}
                          name="selectedIngredients"
                          render={({ field }) => (
                            <>
                              <Checkbox
                                id={`ingredient-${ingredient}-${index}`}
                                checked={field.value?.includes(ingredient)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        ingredient,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== ingredient
                                        )
                                      );
                                }}
                              />
                              <Label
                                htmlFor={`ingredient-${ingredient}-${index}`}
                              >
                                {ingredient}
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
            <div className="grid grid-cols-1 gap-4 rounded-lg overflow-auto max-h-[400px] w-3/4 p-6 shadow bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-bold">Popular Ingredients</h2>

              {popularIngredients.map((topping:any) => (
                <div key={topping.name} className="rounded-lg bg-white p-4 shadow dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{topping.name}</h3>
                    <div className="flex items-center space-x-2">
                      <ArrowUpIcon className="h-5 w-5 text-green-500" />
                      <span className="text-green-500">{topping.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <p>© 2023 What2Eat. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link className="hover:text-gray-400" href="#">
              Privacy Policy
            </Link>
            <Link className="hover:text-gray-400" href="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
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

export { Survey };
