import MoeLogo from "@/assets/moeLogo";
import { Button } from '@/ui/button';
import { ModeToggle } from '@/components/mode-toggle';



export default function Home() {
    return (
        <main className='min-h-screen mx-auto md:w-[80%] py-3 px-7'>

            <header className="flex justify-between items-center">
                <MoeLogo />

                <div className="flex items-center gap-x-4">
                    <Button variant="link" >
                        Login
                    </Button>
                    <Button className="bg-[hsl(var(--moeLogo))] hover:bg-[hsl(var(--moeLogo))]/90 dark:bg-[hsl(var(--moeLogo))] dark:hover:bg-[hsl(var(--moeLogo))]/90 dark:text-white">
                        Join now
                    </Button>
                    <ModeToggle />
                </div>
            </header>

            <section className="font-display w-[98%] md:w-[80%] py-10 mx-auto min-h-[90vh]  flex flex-col items-center justify-center gap-y-7">
                <h2 className="text-4xl font-medium">
                    Start chatting with customers, anytime, anywhere with Moe
                </h2>
                <p
                    className="text-base text-gray-400 dark:text-gray-300"
                >
                    Great software that allows you to chat from any place at any time without any interruption.
                </p>
            </section>
        </main>
    )
}
