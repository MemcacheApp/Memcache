import { Loader } from "@/ui/components/Loader";

export const LoadingMessage = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[180px]">
            <Loader varient="ellipsis" />
            <div>{message}</div>
        </div>
    );
};
