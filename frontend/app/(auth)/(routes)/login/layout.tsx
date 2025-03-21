import NavbarComponent from "@/app/components/Navbar";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
    title: 'Sign in',
    icons: { icon: "/std-match-logo.png" },
}

const SignInLayout = ({children} : {children: React.ReactNode}) =>{
    return(
        <>
        <NavbarComponent/>
            <NextTopLoader color="#000" showSpinner={false} />
            {children}
        </>
    )
}

export default SignInLayout;