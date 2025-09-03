
// import * as z from "zod";

// export const loginSchema = z.object({
//       email: z.email({ error: () => `please provide a valid email` }),
//       password: z.string().min(6,{ error: () => `password is less than 6 characters` })
//     });

// export  const signupSchema = z.object({
//     name: z.string().min(3, "Username must be at least 3 characters long"),
//     email: z.email({ error: () => `please provide a valid email.` }),
//     password: z.string(),
//     // .min(8, "Password must be at least 8 characters long")
//     // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     // .regex(/[0-9]/, "Password must contain at least one number")
//     // .regex(
//     //   /[^A-Za-z0-9]/,
//     //   "Password must contain at least one special character"
//     // )
//     role: z.enum(["teacher", "student"], {
//       required_error: "Role is required",
//     }),
//   });