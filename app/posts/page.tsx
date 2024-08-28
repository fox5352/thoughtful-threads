
const getPosts = async (page=0, amount=10) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts?page=${page}&amount=${amount}`, {
        method: "GET",
    })
    

    if (res.ok) {
        const data = await res.json();
        
        if (data.body){
            return data.body;
        }
        return [];
    }
    
    return []
}

export default async function Page({searchParams}:{searchParams: any}) {
    const page = searchParams?.page;
    const amount = searchParams?.amount;
    let posts = [];

    if (!page && !amount) {
        posts = (await getPosts());
    }else {
        posts = (await getPosts(page, amount));
    }

    console.log(posts);
    

    return (
        <main className="scrollbar pl-2 w-full max-w-7xl h-[100vh] overflow-x-hidden">
        </main>
    )
}