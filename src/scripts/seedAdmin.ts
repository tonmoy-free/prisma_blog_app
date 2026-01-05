import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmine() {
    try {
        console.log("***  Seeding Admin started")
        const adminData = {
            name: "Admin2 Shaheb",
            email: "admin2@admin.com",
            role: UserRole.ADMIN,
            password: "admin12345"
        }
        console.log("** checking Admin exist or not")
        //check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            throw new Error("User already exists!!")
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        })


        if (signUpAdmin.ok) {
            console.log("**Admin created")
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
            console.log("**** Email verification status updated")
        }

        console.log("****success*****")

    } catch (error) {
        console.error(error);
    }
}

seedAdmine();