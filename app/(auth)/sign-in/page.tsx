"use client"

import { login } from "@/actions/auth";
import AuthButton from "../_components/AuthButton";

const SignIn = () => {


const handleSubmit = async (event) => {
   event.preventDefault(); // Empêche le comportement par défaut du formulaire

  const formData = new FormData(event.currentTarget);

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    console.log("No data found");
    return;
  }

  const result = await login(formData);

  if (result) {
    console.log("Login successful");
  } else {
    console.log("Login failed");
  }
  };
    return ( 
        <div className="w-full flex mt-20 justify-center">
            <section className="flex flex-col w-[400px]">
                <h1>Sign in</h1>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div><label >email</label><input type="email" placeholder="email" id="email" name='email' /></div>
                    <div><label >password</label><input type="password" placeholder="password" id="password" name="password"/></div>
                    <div>
                        <AuthButton/>
                    </div>
                    <AuthButton/>
                </form>
            </section>
        </div>
     );
}
 
export default SignIn;