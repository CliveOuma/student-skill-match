import Loading from "@/components/ui/loading";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Verify Email',
    icons: { icon: "/std-match-logo.png" },
}

const VerifyEmailLayout = ({children} : {children: React.ReactNode}) =>{
    return(
        <>
         <Suspense fallback={<Loading/>}>
            <NextTopLoader color="#000" showSpinner={false} />
            {children}
            </Suspense>
        </>
    )
}

export default VerifyEmailLayout;