
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import Navbar from "@/components/ui/navbar"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface SurveyProps {
  id: string;
}

export default function Survey({ id }: SurveyProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const FormSchema = z.object({
    selectedIngredients: z.array(z.string()).refine((value) => value.length > 0, {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a request to the server to check if the user exists
      const response = await fetch(`/api/checkUser?user=${user}&pass=${pass}&id=${id}`);
      const data = await response.json();

      if (data.exists) {
        // User exists, set authentication state
        toast({
          title: "Welcome Back!",
          description: "Your can make changes now.",
        })
        setIsAuthenticated(true);
      } else {
        console.log("user does not exist");
        // User doesn't exist, create a new user and add it to the eaters array
        const newUser = { user, pass };
        console.log("new user",newUser);
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
          })
        } else {
          console.error("Error adding new user");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, ingredient: string) => {
    if (e.target.checked) {
      setSelectedIngredients(prevIngredients => [...prevIngredients, ingredient]);
    } else {
      setSelectedIngredients(prevIngredients => prevIngredients.filter(i => i !== ingredient));
    }
    console.log("handleCheckboxChange",selectedIngredients)
  }

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
          choices: selectedIngredients.map(ingredient => ({ name: ingredient, selected: true })),
        }),
      });
  
      if (response.ok) {
        toast({
          title: "Choices Updated!",
          description: "Your choices have been updated successfully.",
        });
      } else {
        console.error("Error updating choices");
      }
    } catch (error) {
      console.error("Error updating choices:", error);
    }
  };

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
                        Name/Password are only for this event.<br />
                        New to this event? Make up a password.<br />
                        Returning? Use the same name/password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="John Doe" type="name" value={user} onChange={(e) => setUser(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="pls remember this" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
                      </div>
                      <div className="flex justify-between">
                        <Button onClick={handleLogin}> Sign In</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
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
                                      ? field.onChange([...field.value, ingredient])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== ingredient
                                          )
                                        )
                                  }}
                                />
                                <Label htmlFor={`ingredient-${ingredient}-${index}`}>{ingredient}</Label>
                              </>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              <Button onClick={handleUpdateChoices}> Update Choices</Button>
              </div>
            )}
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              pi chart here
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
  )
}

function ArrowDownIcon(props:any) {
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
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}


function ArrowUpIcon(props:any) {
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
  )
}

export { Survey };