import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Page() {
    const cookieStore = cookies();

    if(cookieStore.get("token")) {
        redirect("/client");
    } else {
        redirect("/login");
    }
}